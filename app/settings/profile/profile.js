(function(){
  // Naming rule: profileWork = where the master works. Work module = what the master works with (materials/recipes).
  let section='home';
  const professions=['Парикмахер','Колорист','Барбер','Визажист','Стилист','Мастер маникюра','Мастер педикюра','Бровист','Лэшмейкер','Косметолог','Массажист','Мастер по наращиванию волос','Мастер перманентного макияжа','Другое'];
  const experience=['Без опыта','До 1 года','1–3 года','3–5 лет','5–10 лет','10–15 лет','15–20 лет','Более 20 лет'];
  const currencies=['₽','€','$','₸','BYN','Другой'];
  function read(){try{return Object.assign({photo:'',name:'',phone:'',about:'',profession:'',experience:'',aboutProfession:'',workplaces:[]},JSON.parse(localStorage.getItem('cobook_profile')||'{}'))}catch(e){return {photo:'',name:'',phone:'',about:'',profession:'',experience:'',aboutProfession:'',workplaces:[]}}}
  function save(p){try{localStorage.setItem('cobook_profile',JSON.stringify(p))}catch(e){}}
  function esc(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;')}
  function render(){const content=section==='home'?home():section==='profession'?profession():section==='profileWork'?profileWork():personal();return shell(`<div class="profile-root">${content}</div>`)}
  function home(){return `<section class="page-head"><div class="eyebrow">НАСТРОЙКИ</div><h1>Профиль</h1><p>Профиль мастера</p></section>
    <button type="button" class="profile-clean-folder" data-action="profile-personal"><b>Личные данные</b><span>Имя, телефон и информация о себе</span></button>
    <button type="button" class="profile-clean-folder" data-action="profile-profession"><b>Профессия</b><span>Профессия, опыт работы и информация о профессии</span></button>
    <button type="button" class="profile-clean-folder" data-action="profile-workplace"><b>Работа</b><span>Места работы и рабочая информация</span></button>
    <button type="button" class="section-back-button" data-action="profile-back">Назад</button>`}
  function personal(){return `<section class="page-head"><div class="eyebrow">ПРОФИЛЬ</div><h1>Личные данные</h1></section>${CoBook.profileSections.personal.render()}<button type="button" class="section-back-button" data-action="profile-back">Назад</button>`}
  function profession(){const p=read();return `<section class="page-head"><div class="eyebrow">ПРОФИЛЬ</div><h1>Профессия</h1></section>
    <div class="profile-clean-card"><form data-profession-form>
      <label><span>Профессия</span><button type="button" class="profile-select" data-action="profile-profession-select"><span>${esc(p.profession||'Выберите профессию')}</span><b>⌄</b></button></label>
      <label><span>Опыт работы</span><button type="button" class="profile-select" data-action="profile-experience-select"><span>${esc(p.experience||'Выберите стаж')}</span><b>⌄</b></button></label>
      <label><span>О профессии</span><textarea name="aboutProfession" placeholder="Расскажите о своей профессии">${esc(p.aboutProfession||'')}</textarea></label>
      <div class="profile-clean-actions"><button class="primary" type="submit">Сохранить</button></div>
    </form></div>
    <button type="button" class="section-back-button" data-action="profile-back">Назад</button>`}
  function profileWork(){const p=read(),ws=Array.isArray(p.workplaces)?p.workplaces:[];return `<section class="page-head"><div class="eyebrow">ПРОФИЛЬ</div><h1>Работа</h1><p>Места работы мастера</p></section>
    ${ws.map((w,i)=>workCard(w,i)).join('')}
    <button type="button" class="profile-clean-folder" data-action="profile-workplace-add"><b>Добавить место работы</b><span>Создать отдельную карточку рабочего места</span></button>
    ${ws.length?'':`<div class="profile-clean-muted profile-work-empty">Можно добавить несколько мест работы, в том числе в разных городах.</div>`}
    <button type="button" class="section-back-button" data-action="profile-back">Назад</button>`}
  function workCard(w,i){return `<div class="profile-clean-card profile-work-card"><form data-workplace-form data-index="${i}">
      <div class="profile-work-card-title"><b>Место работы ${i+1}</b><button type="button" class="profile-work-remove" data-action="profile-workplace-remove" data-index="${i}">Удалить</button></div>
      <label><span>Название</span><input name="name" value="${esc(w.name)}" placeholder="Название места работы"></label>
      <label><span>Город</span><input name="city" value="${esc(w.city)}" placeholder="Город"></label>
      <label><span>Адрес</span><input name="address" value="${esc(w.address)}" placeholder="Адрес"></label>
      <label><span>Рабочий телефон</span><input name="phone" value="${esc(w.phone)}" placeholder="Телефон"></label>
      <label><span>Валюта</span><button type="button" class="profile-select" data-action="profile-workplace-currency-select" data-index="${i}"><span>${esc(w.currency||'Выберите валюту')}</span><b>⌄</b></button></label>
      <label><span>График работы</span><input name="schedule" value="${esc(w.schedule)}" placeholder="Например, Пн–Пт 10:00–20:00"></label>
      <label><span>Рабочие ссылки</span><input name="links" value="${esc(w.links)}" placeholder="Ссылка на сайт или соцсети"></label>
      <label><span>О рабочем пространстве</span><textarea name="about" placeholder="Расскажите о рабочем пространстве">${esc(w.about)}</textarea></label>
      <div class="profile-clean-actions"><button class="primary" type="submit">Сохранить</button></div>
    </form></div>`}
  function modal(title,items,action,index){return `<div class="profile-choice" data-modal><div class="profile-choice-inner"><h2>${title}</h2>${items.map(x=>`<button type="button" data-action="${action}" data-value="${x}" ${index!==undefined?`data-index="${index}"`:''}>${x}</button>`).join('')}<button type="button" data-action="modal-close">Отмена</button></div></div>`}
  function refresh(){window.app.innerHTML=render()}
  function reset(){section='home'}
  function handle(action,e){
    if(action==='profile-personal'){section='personal';return refresh()}
    if(action==='profile-profession'){section='profession';return refresh()}
    if(action==='profile-workplace'){section='profileWork';return refresh()}
    if(action==='profile-profession-select')return document.body.insertAdjacentHTML('beforeend',modal('Профессия',professions,'profile-profession-choice'))
    if(action==='profile-experience-select')return document.body.insertAdjacentHTML('beforeend',modal('Опыт работы',experience,'profile-experience-choice'))
    if(action==='profile-profession-choice'){const p=read();p.profession=e.dataset.value;save(p);e.closest('[data-modal]')?.remove();return refresh()}
    if(action==='profile-experience-choice'){const p=read();p.experience=e.dataset.value;save(p);e.closest('[data-modal]')?.remove();return refresh()}
    if(action==='profile-workplace-currency-select')return document.body.insertAdjacentHTML('beforeend',modal('Валюта',currencies,'profile-workplace-currency-choice',e.dataset.index))
    if(action==='profile-workplace-currency-choice'){const p=read(),i=+e.dataset.index;p.workplaces=Array.isArray(p.workplaces)?p.workplaces:[];if(p.workplaces[i])p.workplaces[i].currency=e.dataset.value;save(p);e.closest('[data-modal]')?.remove();return refresh()}
    if(action==='profile-workplace-add'){const p=read();p.workplaces=Array.isArray(p.workplaces)?p.workplaces:[];p.workplaces.push({name:'',city:'',address:'',phone:'',currency:'',schedule:'',links:'',about:''});save(p);return refresh()}
    if(action==='profile-workplace-remove'){const p=read();p.workplaces=Array.isArray(p.workplaces)?p.workplaces:[];p.workplaces.splice(+e.dataset.index,1);save(p);return refresh()}
    if(action==='profile-back'){if(section!=='home'){section='home';return refresh()}reset();return navigate('settings')}
  }
  document.addEventListener('submit',e=>{const form=e.target.closest('[data-profession-form]');if(form){e.preventDefault();const p=read();p.aboutProfession=String(new FormData(form).get('aboutProfession')||'');save(p);refresh();return}const wf=e.target.closest('[data-workplace-form]');if(wf){e.preventDefault();const i=+wf.dataset.index,p=read();p.workplaces=Array.isArray(p.workplaces)?p.workplaces:[];if(p.workplaces[i]){const f=new FormData(wf);p.workplaces[i]={...p.workplaces[i],name:String(f.get('name')||''),city:String(f.get('city')||''),address:String(f.get('address')||''),phone:String(f.get('phone')||''),schedule:String(f.get('schedule')||''),links:String(f.get('links')||''),about:String(f.get('about')||'')};save(p)}refresh()}})
  CoBook.modules.profile={render,refresh,handle,onEnter:reset,onLeave:reset};
})();
