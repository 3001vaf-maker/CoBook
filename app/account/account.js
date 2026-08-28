(function(){
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const saveAccounts=()=>localStorage.setItem('cobook_accounts',JSON.stringify(state.accounts));
  const field=(label,name,value,type='text',attrs='')=>CoBook.ui.field({label,name,value,type,attrs,className:'account-field'});
  const selectField=(label,name,value,options)=>CoBook.ui.select({label,name,value,options,className:'account-field'});
  const button=(label,action,variant='primary',attrs='')=>CoBook.ui.button({label,action,variant,attrs,className:variant==='primary'?'full':''});

  function accountList(){
    const accounts=Array.isArray(state.accounts)?state.accounts:[];
    const items=accounts.map(account=>CoBook.ui.listItem({
      icon:'◉',
      title:account.name||'Без имени',
      subtitle:account.phone||account.telegram||'Аккаунт',
      rootTag:'button',
      rootAction:'account-open-item',
      rootAttrs:`data-account-id="${esc(account.id)}"`
    })).join('');
    return shell(`<section class="page-head"><div class="eyebrow">ГЛАВНАЯ</div><h1>Аккаунты</h1></section>${items}${button('Добавить аккаунт','account-new')}${CoBook.ui.button({label:'Назад',action:'account-back',variant:'secondary',className:'back-button'})}`);
  }

  function accountCard(account){
    return shell(`<section class="page-head"><div class="eyebrow">АККАУНТ</div><h1>${esc(account.name||'Новый аккаунт')}</h1></section>
      <section class="panel"><div class="panel-title">Идентификация</div>${field('ID','account-id',account.id,'text','readonly')}</section>
      <section class="panel"><div class="panel-title">Личные данные</div>${field('Имя','account-name',account.name)}${field('Фамилия','account-surname',account.surname)}${selectField('Пол','account-gender',account.gender,[{value:'',label:'Не указан'},{value:'female',label:'Женский'},{value:'male',label:'Мужской'},{value:'other',label:'Другой'}])}${field('Дата рождения','account-birth-date',account.birthDate,'date')}</section>
      <section class="panel"><div class="panel-title">Контакты</div>${field('Телефон','account-phone',account.phone,'tel')}${field('Telegram','account-telegram',account.telegram)}${field('Email','account-email',account.email,'email')}</section>
      <section class="panel"><div class="panel-title">Согласия</div>${selectField('Согласия ПДН','account-pdn-consent',account.consents?.pdn||'',[{value:'',label:'Не указано'},{value:'yes',label:'Дано'},{value:'no',label:'Не дано'}])}${selectField('Согласия рассылки','account-mailing-consent',account.consents?.mailing||'',[{value:'',label:'Не указано'},{value:'yes',label:'Дано'},{value:'no',label:'Не дано'}])}</section>
      <section class="panel"><div class="panel-title">Программы</div>${field('Программы','account-programs',account.programs||'')}</section>
      <section class="panel"><div class="panel-title">Клиентские данные</div>${field('Код','account-code',account.code,'text','readonly')}${field('Статус','account-status',account.status||'active')}</section>
      <section class="panel"><div class="panel-title">История</div><div class="account-history"><div><span>Дата создания</span><b>${esc(account.createdAt||'')}</b></div></div></section>
      ${button('Сохранить','account-save','primary',`data-account-id="${esc(account.id)}"`)}${CoBook.ui.button({label:'Назад',action:'account-back',variant:'secondary',className:'back-button'})}`);
  }

  function getAccount(id){return state.accounts.find(account=>String(account.id)===String(id));}

  function newAccount(){
    const account={
      id:`account-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      code:`A${String(state.accounts.length+1).padStart(4,'0')}`,
      name:'',surname:'',gender:'',birthDate:'',phone:'',telegram:'',email:'',
      consents:{pdn:'',mailing:''},programs:'',status:'active',createdAt:new Date().toLocaleString('ru-RU')
    };
    state.accounts.push(account);
    state.activeAccountId=account.id;
    state.accountsView='account';
    saveAccounts();
    window.render();
  }

  function saveAccount(id){
    const account=getAccount(id);if(!account)return;
    const value=name=>document.querySelector(`[data-field="${name}"]`)?.value??'';
    account.name=value('account-name').trim();
    account.surname=value('account-surname').trim();
    account.gender=value('account-gender');
    account.birthDate=value('account-birth-date');
    account.phone=value('account-phone').trim();
    account.telegram=value('account-telegram').trim();
    account.email=value('account-email').trim();
    account.consents={pdn:value('account-pdn-consent'),mailing:value('account-mailing-consent')};
    account.programs=value('account-programs').trim();
    account.status=value('account-status')||'active';
    saveAccounts();
    state.accountsView='list';
    window.render();
  }

  function render(){
    if(state.accountsView==='account'){
      const account=getAccount(state.activeAccountId);
      if(account)return accountCard(account);
      state.accountsView='list';
    }
    return accountList();
  }

  function handle(action,e){
    switch(action){
      case'account-new':newAccount();break;
      case'account-open-item':state.activeAccountId=String(e.dataset.accountId||'');state.accountsView='account';window.render();break;
      case'account-save':saveAccount(e.dataset.accountId);break;
      case'account-back':state.accountsView='list';navigate('maine');break;
      case'account-open':state.accountsView='list';window.render();break;
    }
  }

  CoBook.modules.account={render,handle};
})();
