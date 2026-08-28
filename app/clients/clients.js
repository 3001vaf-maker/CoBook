(function(){
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const formatMoney=value=>new Intl.NumberFormat('ru-RU').format(Number(value)||0)+' ₽';
  const formatDate=value=>{if(!value)return '';const date=new Date(value);if(Number.isNaN(date.getTime()))return value;return new Intl.DateTimeFormat('ru-RU').format(date)};
  const saveClients=()=>localStorage.setItem('cobook_clients',JSON.stringify(state.clients));
  const nextCode=()=>{const max=state.clients.reduce((highest,client)=>{const match=String(client.code||'').match(/(\d+)$/);return Math.max(highest,match?Number(match[1]):0)},0);return `C${String(max+1).padStart(4,'0')}`};
  const getClient=id=>state.clients.find(client=>String(client.id)===String(id));
  const field=(label,name,value,type='text',attrs='')=>CoBook.ui.field({label,name,value,type,attrs,className:'client-field'});
  const selectField=(label,name,value,options)=>CoBook.ui.select({label,name,value,options,className:'client-field'});
  const button=(label,action,variant='primary',attrs='')=>CoBook.ui.button({label,action,variant,attrs,className:variant==='primary'?'full':''});

  function clients(){
    const list=state.clients.length?`<div class="ui-list client-list">${state.clients.map(client=>CoBook.ui.listItem({icon:'●',title:client.name||'Без имени',subtitle:`${client.code} · ${client.phone||'Телефон не указан'}`,rootTag:'button',rootAction:'client-open',rootAttrs:`data-client-id="${esc(client.id)}"`,itemClass:'client-row'})).join('')}</div>`:`<section class="panel client-empty"><div class="panel-title">Клиентов пока нет</div><p>Создайте первую карточку клиента.</p></section>`;
    return shell(`<section class="page-head"><div class="eyebrow">ГЛАВНАЯ</div><h1>Клиенты</h1><p>${state.clients.length} ${state.clients.length===1?'клиент':'клиентов'}</p></section>${list}${button('Добавить клиента','client-new')}${CoBook.ui.button({label:'Назад',action:'maine-back',variant:'secondary',className:'back-button'})}`);
  }

  function clientCard(client){
    const visits=Array.isArray(client.visits)?client.visits:[];
    return shell(`<section class="client-card-head"><div class="eyebrow">КЛИЕНТ</div><div class="client-primary"><div><h1>${esc(client.name||'Без имени')}</h1><p>${esc(client.code)} · ${esc(client.phone||'Телефон не указан')}</p></div></div></section>
      <section class="panel"><div class="panel-title">Идентификация</div>${field('Имя','client-name',client.name)}${field('Код','client-code',client.code,'text','readonly')}</section>
      <section class="panel"><div class="panel-title">Личные данные</div>${field('Фамилия','client-surname',client.surname)}${selectField('Пол','client-gender',client.gender,[{value:'',label:'Не указан'},{value:'female',label:'Женский'},{value:'male',label:'Мужской'},{value:'other',label:'Другой'}])}${field('Дата рождения','client-birth-date',client.birthDate,'date')}</section>
      <section class="panel"><div class="panel-title">Контакты</div>${field('Телефон','client-phone',client.phone,'tel')}${field('Telegram','client-telegram',client.telegram)}${field('Email','client-email',client.email,'email')}</section>
      <section class="panel"><div class="panel-title">Программы</div>${field('Бонусная','client-bonus',client.programs?.bonus||'')}${field('Реферальная','client-referral',client.programs?.referral||'')}${field('Другие','client-other-programs',client.programs?.other||'')}</section>
      <section class="panel"><div class="panel-title">Клиентские данные</div>${field('Дата создания профиля','client-created-at',formatDate(client.createdAt),'text','readonly')}${selectField('Статус','client-status',client.status||'active',[{value:'active',label:'Активный'},{value:'inactive',label:'Неактивный'},{value:'archive',label:'Архив'}])}${field('Ярлыки','client-tags',Array.isArray(client.tags)?client.tags.join(', '):'')}${CoBook.ui.textarea({label:'Заметки',name:'client-notes',value:client.notes,className:'client-field'})}</section>
      <section class="panel"><div class="panel-title">История</div><div class="client-history"><div><span>Визиты</span><b>${visits.length}</b></div><div><span>Количество визитов</span><b>${Number(client.visitCount)||visits.length}</b></div><div><span>Общая сумма</span><b>${formatMoney(client.totalSpent)}</b></div></div></section>
      ${button('Сохранить','client-save','primary',`data-client-id="${esc(client.id)}"`)}${CoBook.ui.button({label:'Назад',action:'client-back',variant:'secondary',className:'back-button'})}`);
  }

  function render(){
    if(state.maineView==='clients')return clients();
    if(state.maineView==='client'){
      const client=getClient(state.activeClientId);
      if(client)return clientCard(client);
      state.maineView='clients';
      return clients();
    }
    return clients();
  }

  function newClient(){
    const now=new Date().toISOString();
    const client={id:`client-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,code:nextCode(),name:'',surname:'',gender:'',birthDate:'',phone:'',telegram:'',email:'',programs:{bonus:'',referral:'',other:''},createdAt:now,status:'active',tags:[],notes:'',visits:[],visitCount:0,totalSpent:0};
    state.clients.push(client);
    state.activeClientId=client.id;
    state.maineView='client';
    saveClients();
    window.render();
  }

  function saveClient(id){
    const client=getClient(id);
    if(!client)return;
    const value=fieldId=>document.querySelector(`[data-field="${fieldId}"]`)?.value??'';
    client.name=value('client-name').trim();
    client.surname=value('client-surname').trim();
    client.gender=value('client-gender');
    client.birthDate=value('client-birth-date');
    client.phone=value('client-phone').trim();
    client.telegram=value('client-telegram').trim();
    client.email=value('client-email').trim();
    client.programs={bonus:value('client-bonus').trim(),referral:value('client-referral').trim(),other:value('client-other-programs').trim()};
    client.status=value('client-status')||'active';
    client.tags=value('client-tags').split(',').map(tag=>tag.trim()).filter(Boolean);
    client.notes=value('client-notes').trim();
    saveClients();
    window.render();
  }

  function handle(action,e){
    switch(action){
      case'client-new':newClient();break;
      case'client-open':state.activeClientId=String(e.dataset.clientId||'');state.maineView='client';window.render();break;
      case'client-save':saveClient(e.dataset.clientId);break;
      case'client-back':state.maineView='clients';window.render();break;
    }
  }

  CoBook.modules.clients={render,handle};
})();
