(function(){
 const readStorage=(key,fallback)=>{try{const raw=localStorage.getItem(key);return raw===null?fallback:JSON.parse(raw)}catch(e){try{localStorage.removeItem(key)}catch(_){}return fallback}};
 const today=new Date(); const dateKey=(y,m,d)=>`${y}-${m+1}-${d}`;
 const savedRules=readStorage('cobook_work_rules',{}), savedProcedures=readStorage('cobook_procedures',[{name:'Женская стрижка',duration:60,price:''},{name:'Мужская стрижка',duration:45,price:''},{name:'Детская стрижка',duration:45,price:''}]), savedProducts=readStorage('cobook_products',[{name:'Шампунь',price:''},{name:'Кондиционер',price:''},{name:'Краска для волос',price:''}]), savedClients=readStorage('cobook_clients',[]);
 window.CoBook=window.CoBook||{}; CoBook.modules=CoBook.modules||{};
 window.state={page:'maine',settingsView:'home',year:today.getFullYear(),month:today.getMonth(),selectedDates:new Set(),startTime:'10:00',endTime:'20:00',rules:savedRules||{},journalDate:dateKey(today.getFullYear(),today.getMonth(),today.getDate()),journalMode:'day',serviceMode:'procedures',procedures:Array.isArray(savedProcedures)?savedProcedures:[],products:Array.isArray(savedProducts)?savedProducts:[],clients:Array.isArray(savedClients)?savedClients:[],maineView:'main',clientView:'list',selectedClientId:null};
 const app=document.getElementById('app'); window.app=app; window.dateKey=dateKey;
 window.minutesValue=t=>{const [h,m]=String(t).split(':').map(Number);return h*60+m}; window.readStorage=readStorage;
 const navItems=[['journal','▤','Журнал'],['timetable','▦','График'],['maine','⌂','Главная'],['chat','◌','Чат'],['settings','⚙','Настройки']];
 window.nav=()=>`<nav class="bottom">${navItems.map(([p,i,l])=>`<button class="nav" data-action="navigate" data-page="${p}" type="button"><span class="nav-icon">${i}</span><span>${l}</span></button>`).join('')}</nav>`;
 window.shell=(content,plain=false)=>`<div class="shell">${plain?'':`<header class="topbar"><div class="brand">CoBook</div><div class="subtitle">Кабинет мастера</div></header>`}<main class="content">${content}</main>${nav()}</div>`;
 const moduleFor=p=>CoBook.modules[p];
 const settingsChildPages=new Set(['profile','service','work','documents','loyalty']);
 window.navigate=page=>{
   const requested=String(page||'maine');
   const nextPage=settingsChildPages.has(requested)?'settings':requested;
   const previousPage=state.page;
   const previousSettingsView=state.settingsView||'home';
   if(previousPage==='settings'&&nextPage!=='settings'){
     const child=previousSettingsView!=='home'?moduleFor(previousSettingsView):null;
     if(child&&typeof child.onLeave==='function')child.onLeave(nextPage);
   }
   if(nextPage==='settings') state.settingsView=requested==='settings'?'home':requested;
   else state.settingsView='home';
   if(previousPage===nextPage){
     if(nextPage==='settings'&&requested!=='settings'){
       const child=moduleFor(requested);
       if(child&&typeof child.onEnter==='function')child.onEnter(previousPage);
     }
     render();return;
   }
   const previousModule=moduleFor(previousPage);
   if(previousModule&&typeof previousModule.onLeave==='function')previousModule.onLeave(nextPage);
   state.page=nextPage;
   if(nextPage!=='maine'){state.maineView='main';state.clientView='list';state.selectedClientId=null}
   if(nextPage==='settings'&&requested!=='settings'){
     const child=moduleFor(requested);
     if(child&&typeof child.onEnter==='function')child.onEnter(previousPage);
   }else{
     const nextModule=moduleFor(nextPage);
     if(nextModule&&typeof nextModule.onEnter==='function')nextModule.onEnter(previousPage);
   }
   render()
 };
 window.render=()=>{const mod=moduleFor(state.page)||CoBook.modules.maine;app.innerHTML=mod.render();};
 window.dispatchAction=(action,e)=>{if(action==='navigate')return navigate(e.dataset.page);const mod=moduleFor(state.page);if(mod&&typeof mod.handle==='function'){const result=mod.handle(action,e);if(typeof result==='string')app.innerHTML=result;return result}};
 app.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(b&&app.contains(b))dispatchAction(b.dataset.action,b)});
 document.body.addEventListener('click',e=>{const b=e.target.closest('[data-modal-action]');if(!b)return;const m=b.closest('[data-modal]');if(!m)return;if(b.dataset.modalAction==='close')m.remove();else {const mod=moduleFor(state.page);if(mod&&typeof mod.handleModal==='function')mod.handleModal(b.dataset.modalAction,m)}});
 window.CoBook.core={moduleFor};
})();
