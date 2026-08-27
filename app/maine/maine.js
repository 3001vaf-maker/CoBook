(function(){
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const formatMoney=value=>new Intl.NumberFormat('ru-RU').format(Number(value)||0)+' ₽';
  const formatDate=value=>{
    if(!value)return '';
    const date=new Date(value);
    if(Number.isNaN(date.getTime()))return value;
    return new Intl.DateTimeFormat('ru-RU').format(date);
  };
  const saveClients=()=>localStorage.setItem('cobook_clients',JSON.stringify(state.clients));
  const nextCode=()=>{
    const max=state.clients.reduce((highest,client)=>{
      const match=String(client.code||'').match(/(\d+)$/);
      return Math.max(highest,match?Number(match[1]):0);
    },0);
    return `C${String(max+1).padStart(4,'0')}`;
  };
  const getClient=id=>state.clients.find(client=>String(client.id)===String(id));
  const field=(label,id,value,type='text',extra='')=>`<label class="profile-field"><b>${esc(label)}</b><input id="${id}" type="${type}" value="${esc(value)}" ${extra}></label>`;
  const selectField=(label,id,value,options)=>`<label class="profile-field"><b>${esc(label)}</b><select id="${id}" class="client-select">${options.map(option=>`<option value="${esc(option.value)}"${option.value===value?' selected':''}>${esc(option.label)}</option>`).join('')}</select></label>`;

  function main(){
    return shell(`<section class="hero"><div class="eyebrow">КАБИНЕТ МАСТЕРА</div><h1>Главная</h1></section><div class="premium-grid"><button class="premium" data-action="clients-open" type="button"><span class="premium-title">Клиенты</span><span class="premium-value">${state.clients.length}</span><span class="premium-meta">Клиентская база</span></button></div>`);
  }

  function clients(){
    const list=state.clients.length
      ? `<div class="client-list">${state.clients.map(client=>`<button class="management-folder client-row" data-action="client-open" data-client-id="${esc(client.id)}" type="button"><span class="management-folder-icon">●</span><span><b>${esc(client.name||'Без имени')}</b><small>${esc(client.code)} · ${esc(client.phone||'Телефон не указан')}</small></span><span class="management-chevron">›</span></button>`).join('')}</div>`
      : `<section class="panel client-empty"><div class="panel-title">Клиентов пока нет</div><p>Создайте первую карточку клиента.</p></section>`;
    return shell(`<section class="page-head"><div class="eyebrow">MAINE</div><h1>Клиенты</h1><p>${state.clients.length} ${state.clients.length===1?'клиент':'клиентов'}</p></section>${list}<button class="action-button full" data-action="client-new" type="button">Добавить клиента</button><button class="back-button" data-action="maine-back" type="button">Назад</button>`);
  }

  function clientCard(client){
    const visits=Array.isArray(client.visits)?client.visits:[];
    return shell(`<section class="client-card-head"><div class="eyebrow">КЛИЕНТ</div><div class="client-primary"><div><h1>${esc(client.name||'Без имени')}</h1><p>${esc(client.code)} · ${esc(client.phone||'Телефон не указан')}</p></div></div></section>
      <section class="panel"><div class="panel-title">Идентификация</div>${field('Имя','client-name',client.name)}${field('Код','client-code',client.code,'text','readonly')}</section>
      <section class="panel"><div class="panel-title">Личные данные</div>${field('Фамилия','client-surname',client.surname)}${selectField('Пол','client-gender',client.gender,[{value:'',label:'Не указан'},{value:'female',label:'Женский'},{value:'male',label:'Мужской'},{value:'other',label:'Другой'}])}${field('Дата рождения','client-birth-date',client.birthDate,'date')}</section>
      <section class="panel"><div class="panel-title">Контакты</div>${field('Телефон','client-phone',client.phone,'tel')}${field('Telegram','client-telegram',client.telegram)}${field('Email','client-email',client.email,'email')}</section>
      <section class="panel"><div class="panel-title">Программы</div>${field('Бонусная','client-bonus',client.programs?.bonus||'')}${field('Реферальная','client-referral',client.programs?.referral||'')}${field('Другие','client-other-programs',client.programs?.other||'')}</section>
      <section class="panel"><div class="panel-title">Клиентские данные</div>${field('Дата создания профиля','client-created-at',formatDate(client.createdAt),'text','readonly')}${selectField('Статус','client-status',client.status||'active',[{value:'active',label:'Активный'},{value:'inactive',label:'Неактивный'},{value:'archive',label:'Архив'}])}${field('Ярлыки','client-tags',Array.isArray(client.tags)?client.tags.join(', '):'')}<label class="profile-field"><b>Заметки</b><textarea id="client-notes" class="client-note">${esc(client.notes)}</textarea></label></section>
      <section class="panel"><div class="panel-title">История</div><div class="client-history"><div><span>Визиты</span><b>${visits.length}</b></div><div><span>Количество визитов</span><b>${Number(client.visitCount)||visits.length}</b></div><div><span>Общая сумма</span><b>${formatMoney(client.totalSpent)}</b></div></div></section>
      <button class="action-button full" data-action="client-save" data-client-id="${esc(client.id)}" type="button">Сохранить</button><button class="back-button" data-action="client-back" type="button">Назад</button>`);
  }

  function render(){
    if(state.maineView==='clients')return clients();
    if(state.maineView==='client'){
      const client=getClient(state.activeClientId);
      if(client)return clientCard(client);
      state.maineView='clients';
      return clients();
    }
    return main();
  }

  function newClient(){
    const now=new Date().toISOString();
    const client={id:`client-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,code:nextCode(),name:'',surname:'',gender:'',birthDate:'',phone:'',telegram:'',email:'',programs:{bonus:'',referral:'',other:''},createdAt:now,status:'active',tags:[],notes:'',visits:[],visitCount:0,totalSpent:0};
    state.clients.push(client); state.activeClientId=client.id; state.maineView='client'; saveClients(); render();
  }

  function saveClient(id){
    const client=getClient(id); if(!client)return;
    const value=id=>document.getElementById(id)?.value??'';
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
    saveClients(); render();
  }

  function handle(action,e){
    switch(action){
      case 'clients-open': state.maineView='clients'; render(); break;
      case 'client-new': newClient(); break;
      case 'client-open': state.activeClientId=String(e.dataset.clientId||''); state.maineView='client'; render(); break;
      case 'client-save': saveClient(e.dataset.clientId); break;
      case 'client-back': state.maineView='clients'; render(); break;
      case 'maine-back': state.maineView='main'; render(); break;
    }
  }

  CoBook.modules.maine={render,handle};
})();
