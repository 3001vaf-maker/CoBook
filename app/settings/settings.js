(function(){
 const folders=[
  ['◎','Профиль пользователя','Личная и профессиональная информация','profile'],
  ['▱','Сервис','Процедуры и товары','service'],
  ['◈','Рабочие материалы','Рецепты и справочник материалов','work'],
  ['▤','Документы','Согласия и документы','documents'],
  ['♡','Лояльность','Программы и специальные предложения','loyalty'],
  ['#','Ярлыки','Пользовательские метки для данных','tags'],
  ['₽','Кошельки','Способы оплаты и пользовательские кошельки','wallets']
 ];
 function render(){
  const items=folders.map(([icon,title,subtitle,page])=>CoBook.ui.folder({title:`${icon}  ${title}`,subtitle,action:'navigate',attrs:`data-page="${page}"`,className:'management-folder'})).join('');
  return shell(`<section class="page-head"><div class="eyebrow">РАБОЧИЕ НАСТРОЙКИ</div><h1>Настройки</h1></section>${items}`);
 }
 CoBook.modules.settings={render,handle(){},handleModal(){},onEnter(){state.settingsView='home'},onLeave(){}};
})();
