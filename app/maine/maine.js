(function(){
  function main(){
    return shell(`<section class="hero"><div class="eyebrow">КАБИНЕТ МАСТЕРА</div><h1>Главная</h1></section><div class="premium-grid"><button class="premium" data-action="main-open" type="button"><span class="premium-title">Клиенты</span><span class="premium-value">${state.clients.length}</span><span class="premium-meta">Клиентская база</span></button></div>`);
  }

  function handle(action){
    if(action==='main-open')navigate('clients');
  }

  CoBook.modules.maine={render:main,handle};
})();
