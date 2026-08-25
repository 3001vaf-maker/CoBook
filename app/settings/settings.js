(function(){
 function childContent(name){
   const mod=CoBook.modules[name];
   if(!mod||typeof mod.render!=='function')return '<div class="profile-empty">Раздел временно недоступен.</div>';
   const host=document.createElement('div');
   host.innerHTML=mod.render();
   const content=host.querySelector('.content');
   return content?content.innerHTML:host.innerHTML;
 }
 function activeModule(){const name=state.settingsView||'home';return name!=='home'?CoBook.modules[name]:null}
 function render(){
   const view=state.settingsView||'home';
   if(view!=='home'&&CoBook.modules[view]) return shell(childContent(view));
   return shell(`<section class="page-head"><div class="eyebrow">РАБОЧИЕ НАСТРОЙКИ</div><h1>Настройки</h1></section><button class="management-folder" data-action="navigate" data-page="profile" type="button"><span class="management-folder-icon">◎</span><span><b>Профиль пользователя</b><small>Личная и профессиональная информация</small></span><span class="management-chevron">›</span></button><button class="management-folder" data-action="navigate" data-page="service" type="button"><span class="management-folder-icon">▱</span><span><b>Сервис</b><small>Процедуры и товары</small></span><span class="management-chevron">›</span></button><button class="management-folder" data-action="navigate" data-page="work" type="button"><span class="management-folder-icon">◈</span><span><b>Рабочие материалы</b><small>Рецепты и справочник материалов</small></span><span class="management-chevron">›</span></button><button class="management-folder" data-action="navigate" data-page="documents" type="button"><span class="management-folder-icon">▤</span><span><b>Документы</b><small>Согласия и документы</small></span><span class="management-chevron">›</span></button><button class="management-folder" data-action="navigate" data-page="loyalty" type="button"><span class="management-folder-icon">♡</span><span><b>Лояльность</b><small>Программы и специальные предложения</small></span><span class="management-chevron">›</span></button>`)
 }
 function handle(action,e){const mod=activeModule();if(mod&&typeof mod.handle==='function')return mod.handle(action,e)}
 function handleModal(action,m){const mod=activeModule();if(mod&&typeof mod.handleModal==='function')return mod.handleModal(action,m)}
 CoBook.modules.settings={render,handle,handleModal,onEnter(){},onLeave(){state.settingsView='home'}};
})();
