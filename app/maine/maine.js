(function(){
  function main(){
    return shell(`<section class="hero"><div class="eyebrow">КАБИНЕТ МАСТЕРА</div><h1>Главная</h1></section><div class="premium-grid"><button class="premium" data-action="clients-open" type="button"><span class="premium-title">Клиенты</span><span class="premium-value">${state.clients.length}</span><span class="premium-meta">Клиентская база</span></button></div>`);
  }

  function renderView(){
    if(state.maineView==='clients'||state.maineView==='client')return CoBook.modules.clients.render();
    return main();
  }

  function handle(action){
    if(action==='clients-open'){
      state.maineView='clients';
      window.render();
    }
    if(action==='maine-back'){
      state.maineView='main';
      window.render();
    }
  }

  CoBook.modules.maine={render:renderView,handle};
})();
