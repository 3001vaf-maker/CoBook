(function(){
 function technicalId(){return 'c_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8)}
 function esc(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;')}
 function normalize(c){
   c=c||{};
   if(!c.client_id)c.client_id=technicalId();
   if(c.code===undefined)c.code=String(c.client_id).match(/^\d+$/)?String(c.client_id):'';
   if(c.created_at===undefined)c.created_at=new Date().toISOString().slice(0,10);
   if(c.status===undefined)c.status='';
   if(!Array.isArray(c.tags))c.tags=[];
   if(c.notes===undefined)c.notes='';
   if(c.bonus_program===undefined)c.bonus_program='';
   if(c.referral_program===undefined)c.referral_program='';
   if(c.other_programs===undefined)c.other_programs='';
   if(c.visits_count===undefined)c.visits_count=0;
   if(c.total_spent===undefined)c.total_spent=0;
   if(!Array.isArray(c.visits))c.visits=[];
   if(!Array.isArray(c.telegram_ids))c.telegram_ids=[];
   return c;
 }
 function save(){state.clients=state.clients.map(normalize);localStorage.setItem('cobook_clients',JSON.stringify(state.clients))}
 function field(label,key,value,type='text'){return `<label class="client-field"><span>${label}</span><input type="${type}" data-client-field="${key}" value="${esc(value)}"></label>`}
 function textarea(label,key,value){return `<label class="client-field"><span>${label}</span><textarea data-client-field="${key}">${esc(value)}</textarea></label>`}
 function section(title,body){return `<section class="client-section"><div class="client-section-head"><b>${title}</b></div>${body}</section>`}
 function render(){
   if(state.clientView==='profile'){
     const c=state.clients.find(x=>String(x.client_id)===String(state.selectedClientId));
     if(!c){state.clientView='list';state.selectedClientId=null;return render()}
     normalize(c);
     const fullName=[c.name,c.surname].filter(Boolean).join(' ')||'Без имени';
     return shell(`<section class="page-head"><button class="back-button" data-action="maine-back-clients" type="button">‹ Клиенты</button><div class="eyebrow">КЛИЕНТ</div><h1>${esc(fullName)}</h1></section><section class="client-profile">
       <div class="client-priority"><div><span>Код</span><b>${esc(c.code||'—')}</b></div><div><span>Имя</span><b>${esc(c.name||'—')}</b></div><div><span>Телефон</span><b>${esc(c.phone||'—')}</b></div></div>
       ${section('Идентификация',field('Имя','name',c.name)+field('Код','code',c.code))}
       ${section('Личные данные',field('Фамилия','surname',c.surname)+`<label class="client-field"><span>Пол</span><select data-client-field="gender"><option value="">Не указан</option><option value="Женский" ${c.gender==='Женский'?'selected':''}>Женский</option><option value="Мужской" ${c.gender==='Мужской'?'selected':''}>Мужской</option></select></label>`+field('Дата рождения','birth_date',c.birth_date,'date'))}
       ${section('Контакты',field('Телефон','phone',c.phone,'tel')+field('Telegram','telegram',c.telegram)+field('Email','email',c.email,'email'))}
       ${section('Программы',field('Бонусная','bonus_program',c.bonus_program)+field('Реферальная','referral_program',c.referral_program)+field('Другие','other_programs',c.other_programs))}
       ${section('Клиентские данные',field('Дата создания профиля','created_at',c.created_at,'date')+field('Статус','status',c.status)+field('Ярлыки','tags',c.tags.join(', '))+textarea('Заметки','notes',c.notes))}
       ${section('История',`<div class="client-history-grid"><div><span>Визиты</span><b>${c.visits.length}</b></div><div><span>Количество визитов</span><b>${Number(c.visits_count)||0}</b></div><div><span>Общая сумма</span><b>${Number(c.total_spent)||0} ₽</b></div></div>`)}
       <button class="primary full" data-action="save-client" data-client-id="${esc(c.client_id)}" type="button">Сохранить</button>
     </section>`,false)
   }
   return shell(`<section class="page-head"><div class="eyebrow">ГЛАВНАЯ · КЛИЕНТЫ</div><h1>Клиенты</h1></section><section class="client-list">${state.clients.length?state.clients.map(c=>{normalize(c);return `<button class="client-card" data-action="open-client" data-client-id="${esc(c.client_id)}" type="button"><span class="client-card-code">${esc(c.code||'—')}</span><span class="client-card-main"><b>${esc(c.name||'Без имени')}</b><small>${esc(c.phone||'Телефон не указан')}</small></span><span class="client-card-arrow">›</span></button>`}).join(''):'<div class="empty-state">Клиентов пока нет</div>'}</section><button class="primary full" data-action="create-client" type="button">Создать клиента</button>`,false)
 }
 function create(){
   const c=normalize({client_id:technicalId(),code:'',name:'',phone:'',telegram:'',email:'',surname:'',gender:'',birth_date:'',status:'',tags:[],notes:'',bonus_program:'',referral_program:'',other_programs:'',visits:[],visits_count:0,total_spent:0,telegram_ids:[]});
   state.clients.push(c);save();state.selectedClientId=c.client_id;state.clientView='profile';renderApp()
 }
 function renderApp(){window.render()}
 function handle(a,e){
   if(a==='open-client'){state.selectedClientId=e.dataset.clientId;state.clientView='profile';return renderApp()}
   if(a==='maine-back-clients'){state.clientView='list';state.selectedClientId=null;state.maineView='main';return renderApp()}
   if(a==='create-client')return create()
   if(a==='save-client'){
     const c=state.clients.find(x=>String(x.client_id)===String(e.dataset.clientId));if(!c)return;
     const fields=app.querySelectorAll('[data-client-field]');fields.forEach(el=>{const key=el.dataset.clientField;c[key]=el.value.trim()});
     c.tags=String(c.tags||'').split(',').map(v=>v.trim()).filter(Boolean);
     c.visits_count=Math.max(0,Number(c.visits_count)||0);c.total_spent=Math.max(0,Number(c.total_spent)||0);save();return renderApp()
   }
 }
 CoBook.maineClients={render,handle};
})();
