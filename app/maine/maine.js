(function(){
  function main(){
    return shell(`<section class="hero"><div class="eyebrow">КАБИНЕТ МАСТЕРА</div><h1>Главная</h1>${CoBook.ui.button({label:'Аккаунты',action:'account-open',variant:'primary'})}</section>`);
  }

  CoBook.modules.maine={render:main,handle:function(){}};
})();
