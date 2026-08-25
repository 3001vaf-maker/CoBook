(function(){
  let section='home';
  const root=()=>window.app;
  function render(){
    const content=section==='home'?home():personal();
    return shell(`<div class="profile-root">${content}</div>`);
  }
  function home(){
    return `<section class="page-head"><div class="eyebrow">НАСТРОЙКИ</div><h1>Профиль</h1><p>Профиль мастера</p></section>
      <button type="button" class="profile-clean-folder" data-profile-action="personal"><b>Личные данные</b><span>Имя, телефон и информация о себе</span></button>
      <button type="button" class="section-back-button" data-profile-action="back">Назад</button>`;
  }
  function personal(){
    return `<section class="page-head"><div class="eyebrow">ПРОФИЛЬ</div><h1>Личные данные</h1></section>${CoBook.profileSections.personal.render()}<button type="button" class="section-back-button" data-profile-action="back">Назад</button>`;
  }
  function refresh(){root().innerHTML=render();}
  function reset(){section='home';}
  root().addEventListener('click',e=>{
    const b=e.target.closest('[data-profile-action]');
    if(!b||!root().contains(b))return;
    e.preventDefault();
    e.stopPropagation();
    const action=b.dataset.profileAction;
    if(action==='personal'){section='personal';refresh();return;}
    if(action==='back'){
      if(section==='personal'){section='home';refresh();return;}
      reset();navigate('settings');
    }
  });
  CoBook.modules.profile={render,refresh,handle(){},onEnter:reset,onLeave:reset};
})();
