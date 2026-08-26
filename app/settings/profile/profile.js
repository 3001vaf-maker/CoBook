(function(){
  let section='home';
  const professions=['Парикмахер','Колорист','Барбер','Визажист','Стилист','Мастер маникюра','Мастер педикюра','Бровист','Лэшмейкер','Косметолог','Массажист','Мастер по наращиванию волос','Мастер перманентного макияжа','Другое'];
  const experience=['Без опыта','До 1 года','1–3 года','3–5 лет','5–10 лет','10–15 лет','15–20 лет','Более 20 лет'];
  let data={profession:'',experience:'',about:''};
  try{const saved=JSON.parse(localStorage.getItem('cobook_profile')||'{}');data={...data,...saved}}catch(e){}
  function save(){try{localStorage.setItem('cobook_profile',JSON.stringify(data))}catch(e){}}
  function render(){const content=section==='home'?home():section==='profession'?profession():personal();return shell(`<div class="profile-root">${content}</div>`)}
  function home(){return `<section class="page-head"><div class="eyebrow">НАСТРОЙКИ</div><h1>Профиль</h1><p>Профиль мастера</p></section>
    <button type="button" class="profile-clean-folder" data-action="profile-personal"><b>Личные данные</b><span>Имя, телефон и информация о себе</span></button>
    <button type="button" class="profile-clean-folder" data-action="profile-profession"><b>Профессия</b><span>Профессия, опыт работы и информация о профессии</span></button>
    <button type="button" class="section-back-button" data-action="profile-back">Назад</button>`}
  function personal(){return `<section class="page-head"><div class="eyebrow">ПРОФИЛЬ</div><h1>Личные данные</h1></section>${CoBook.profileSections.personal.render()}<button type="button" class="section-back-button" data-action="profile-back">Назад</button>`}
  function profession(){return `<section class="page-head"><div class="eyebrow">ПРОФИЛЬ</div><h1>Профессия</h1></section>
    <button type="button" class="profile-clean-folder" data-action="profile-profession-select"><b>Профессия</b><span>${data.profession||'Выберите профессию'}</span></button>
    <button type="button" class="profile-clean-folder" data-action="profile-experience-select"><b>Опыт работы</b><span>${data.experience||'Выберите стаж'}</span></button>
    <label class="profile-field"><b>О профессии</b><textarea data-profile-about placeholder="Расскажите о своей профессии">${data.about}</textarea></label>
    <button type="button" class="profile-clean-folder" data-action="profile-save-profession"><b>Сохранить</b><span>Сохранить данные профессии</span></button>
    <button type="button" class="section-back-button" data-action="profile-back">Назад</button>`}
  function modal(title,items,action){return `<div class="profile-choice" data-modal><div class="profile-choice-inner"><h2>${title}</h2>${items.map(x=>`<button type="button" data-action="${action}" data-value="${x}">${x}</button>`).join('')}<button type="button" data-action="modal-close">Отмена</button></div></div>`}
  function refresh(){window.app.innerHTML=render()}
  function reset(){section='home'}
  function handle(action,e){
    if(action==='profile-personal'){section='personal';return refresh()}
    if(action==='profile-profession'){section='profession';return refresh()}
    if(action==='profile-profession-select'){return document.body.insertAdjacentHTML('beforeend',modal('Выберите профессию',professions,'profile-profession-choice'))}
    if(action==='profile-experience-select'){return document.body.insertAdjacentHTML('beforeend',modal('Опыт работы',experience,'profile-experience-choice'))}
    if(action==='profile-profession-choice'){data.profession=e.dataset.value;save();e.closest('[data-modal]')?.remove();return refresh()}
    if(action==='profile-experience-choice'){data.experience=e.dataset.value;save();e.closest('[data-modal]')?.remove();return refresh()}
    if(action==='profile-save-profession'){const a=document.querySelector('[data-profile-about]');if(a)data.about=a.value;save();return refresh()}
    if(action==='profile-back'){if(section!=='home'){section='home';return refresh()}reset();return navigate('settings')}
  }
  document.addEventListener('input',e=>{if(e.target?.matches('[data-profile-about]')){data.about=e.target.value;save()}},{once:true});
  CoBook.modules.profile={render,refresh,handle,onEnter:reset,onLeave:reset};
})();
