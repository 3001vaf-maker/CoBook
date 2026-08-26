(function(){
  let section='home';
  const professions=['Парикмахер','Колорист','Барбер','Визажист','Стилист','Мастер маникюра','Мастер педикюра','Бровист','Лэшмейкер','Косметолог','Массажист','Мастер по наращиванию волос','Мастер перманентного макияжа','Другое'];
  const experience=['Без опыта','До 1 года','1–3 года','3–5 лет','5–10 лет','10–15 лет','15–20 лет','Более 20 лет'];
  function read(){try{return Object.assign({photo:'',name:'',phone:'',about:'',profession:'',experience:'',aboutProfession:''},JSON.parse(localStorage.getItem('cobook_profile')||'{}'))}catch(e){return {photo:'',name:'',phone:'',about:'',profession:'',experience:'',aboutProfession:''}}}
  function save(p){try{localStorage.setItem('cobook_profile',JSON.stringify(p))}catch(e){}}
  function esc(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;')}
  function render(){const content=section==='home'?home():section==='profession'?profession():personal();return shell(`<div class="profile-root">${content}</div>`)}
  function home(){return `<section class="page-head"><div class="eyebrow">НАСТРОЙКИ</div><h1>Профиль</h1><p>Профиль мастера</p></section>
    <button type="button" class="profile-clean-folder" data-action="profile-personal"><b>Личные данные</b><span>Имя, телефон и информация о себе</span></button>
    <button type="button" class="profile-clean-folder" data-action="profile-profession"><b>Профессия</b><span>Профессия, опыт работы и информация о профессии</span></button>
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
  function modal(title,items,action){return `<div class="profile-choice" data-modal><div class="profile-choice-inner"><h2>${title}</h2>${items.map(x=>`<button type="button" data-action="${action}" data-value="${x}">${x}</button>`).join('')}<button type="button" data-action="modal-close">Отмена</button></div></div>`}
  function refresh(){window.app.innerHTML=render()}
  function reset(){section='home'}
  function handle(action,e){
    if(action==='profile-personal'){section='personal';return refresh()}
    if(action==='profile-profession'){section='profession';return refresh()}
    if(action==='profile-profession-select')return document.body.insertAdjacentHTML('beforeend',modal('Профессия',professions,'profile-profession-choice'))
    if(action==='profile-experience-select')return document.body.insertAdjacentHTML('beforeend',modal('Опыт работы',experience,'profile-experience-choice'))
    if(action==='profile-profession-choice'){const p=read();p.profession=e.dataset.value;save(p);e.closest('[data-modal]')?.remove();return refresh()}
    if(action==='profile-experience-choice'){const p=read();p.experience=e.dataset.value;save(p);e.closest('[data-modal]')?.remove();return refresh()}
    if(action==='profile-back'){if(section!=='home'){section='home';return refresh()}reset();return navigate('settings')}
  }
  document.addEventListener('submit',e=>{const form=e.target.closest('[data-profession-form]');if(!form)return;e.preventDefault();const p=read();p.aboutProfession=String(new FormData(form).get('aboutProfession')||'');save(p);refresh()})
  CoBook.modules.profile={render,refresh,handle,onEnter:reset,onLeave:reset};
})();
