(function(){
  let section='home';
  function render(){
    const content=section==='home'?home():personal();
    return shell(`<div class="profile-root">${content}</div>`);
  }
  function home(){
    return `<section class="page-head"><div class="eyebrow">НАСТРОЙКИ</div><h1>Профиль</h1><p>Профиль мастера</p></section>
      <button type="button" class="profile-clean-folder" data-action="profile-personal"><b>Личные данные</b><span>Имя, телефон и информация о себе</span></button>
      <button type="button" class="section-back-button" data-action="profile-back">Назад</button>`;
  }
  function personal(){
    return `<section class="page-head"><div class="eyebrow">ПРОФИЛЬ</div><h1>Личные данные</h1></section>${CoBook.profileSections.personal.render()}<button type="button" class="section-back-button" data-action="profile-back">Назад</button>`;
  }
  function refresh(){window.app.innerHTML=render();}
  function reset(){section='home';}
  function handle(action){
    if(action==='profile-personal'){section='personal';return refresh();}
    if(action==='profile-back'){
      if(section==='personal'){section='home';return refresh();}
      reset();return navigate('settings');
    }
  }
  CoBook.modules.profile={render,refresh,handle,onEnter:reset,onLeave:reset};
})();
