(function(){
 const readStorage=(key,fallback)=>{try{const raw=localStorage.getItem(key);return raw===null?fallback:JSON.parse(raw)}catch(e){try{localStorage.removeItem(key)}catch(_){}return fallback}};
 const today=new Date(); const dateKey=(y,m,d)=>`${y}-${m+1}-${d}`;
 const savedRules=readStorage('cobook_work_rules',{}), savedProcedures=readStorage('cobook_procedures',[{name:'Женская стрижка',duration:60,price:''},{name:'Мужская стрижка',duration:45,price:''},{name:'Детская стрижка',duration:45,price:''}]), savedProducts=readStorage('cobook_products',[{name:'Шампунь',price:''},{name:'Кондиционер',price:''},{name:'Краска для волос',price:''}]), savedClients=readStorage('cobook_clients',[]);
 window.CoBook=window.CoBook||{}; CoBook.modules=CoBook.modules||{};
 window.state={page:'journal',settingsView:'home',year:today.getFullYear(),month:today.getMonth(),selectedDates:new Set(),startTime:'10:00',endTime:'20:00',rules:savedRules||{},journalDate:dateKey(today.getFullYear(),today.getMonth(),today.getDate()),journalMode:'day',serviceMode:'procedures',procedures:Array.isArray(savedProcedures)?savedProcedures:[],products:Array.isArray(savedProducts)?savedProducts:[],clients:Array.isArray(savedClients)?savedClients:[],activeClientId:null,maineView:'main',tagsView:'home',walletsView:'home'};
 const app=document.getElementById('app'); window.app=app; window.dateKey=dateKey;
 window.minutesValue=t=>{const [h,m]=String(t).split(':').map(Number);return h*60+m}; window.readStorage=readStorage;
 const navItems=[['maine','⌂','Главная'],['timetable','▦','График'],['journal','▤','Журнал'],['chat','◌','Чат'],['settings','⚙','Настройки']];
 window.nav=()=>`<nav class="bottom">${navItems.map(([p,i,l])=>`<button class="nav" data-action="navigate" data-page="${p}" type="button"><span class="nav-icon">${i}</span><span>${l}</span></button>`).join('')}</nav>`;
 window.shell=(content,plain=false)=>`<div class="shell">${plain?'':`<header class="topbar"><div class="brand">CoBook</div><div class="subtitle">Кабинет мастера</div></header>`}<main class="content">${content}</main>${nav()}</div>`;
 const moduleFor=p=>CoBook.modules[p];
 const settingsChildPages=new Set(['profile','service','work','documents','loyalty','tags','wallets']);
 const actionOwners=new Map([
   ['clients-open','maine'],['client-new','maine'],['client-open','maine'],['client-save','maine'],['client-back','maine'],['maine-back','maine']
 ]);
 window.navigate=page=>{
   const nextPage=String(page||'maine');
   const previousPage=state.page;
   const previousModule=moduleFor(previousPage);
   if(previousModule&&typeof previousModule.onLeave==='function')previousModule.onLeave(nextPage);
   state.page=nextPage;
   state.settingsView=nextPage==='settings'?'home':(settingsChildPages.has(nextPage)?nextPage:'home');
   if(nextPage!=='maine')state.maineView='main';
   const nextModule=moduleFor(nextPage);
   if(nextModule&&typeof nextModule.onEnter==='function')nextModule.onEnter(previousPage);
   render();
 };
 window.render=()=>{const mod=moduleFor(state.page)||CoBook.modules.maine;app.innerHTML=mod.render();};
 window.dispatchAction=(action,e)=>{
   if(action==='navigate')return navigate(e.dataset.page);
   if(action==='modal-close')return e.closest('[data-modal]')?.remove();
   const owner=actionOwners.get(action);
   const mod=moduleFor(owner||state.page);
   if(mod&&typeof mod.handle==='function')return mod.handle(action,e,e.closest('[data-modal]')||null);
 };
 document.addEventListener('click',function(e){
   const target=e.target;
   const actionElement=target?.closest?.('[data-action]')||target?.parentElement?.closest?.('[data-action]');
   if(!actionElement)return;
   dispatchAction(actionElement.dataset.action,actionElement);
 },false);
 window.CoBook.core={moduleFor};
})();
