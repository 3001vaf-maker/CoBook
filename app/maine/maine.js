(function(){
  function main(){
    return shell(`<section class="hero"><div class="eyebrow">КАБИНЕТ МАСТЕРА</div><h1>Главная</h1></section><section class="panel"><button class="ui-button ui-folder" data-action="account-open" type="button"><span class="management-folder-icon">◉</span><span><b>Аккаунты</b><small>Список аккаунтов</small></span><span class="management-chevron">›</span></button></section>`);
  }

  CoBook.modules.maine={render:main,handle:function(){}};
})();
