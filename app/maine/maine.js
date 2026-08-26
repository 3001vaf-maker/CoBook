(function(){
 function render(){if(state.maineView==='clients')return CoBook.maineClients.render();const clientCount=Array.isArray(state.clients)?state.clients.length:0;return shell(`<section class="hero"><div class="eyebrow">КАБИНЕТ МАСТЕРА</div><h1>Главная</h1><div class="premium-grid"><button class="premium" data-action="maine-clients" type="button"><span class="premium-title">Клиенты</span><span class="premium-meta">${clientCount} клиентов</span></button><button class="premium" data-action="maine-finance" type="button"><span class="premium-title">Финансы</span><span class="premium-meta">Средний чек: 0 ₽</span></button></div></section>`)}
 function handle(action,e){if(action==='maine-clients'){state.maineView='clients';state.clientView='list';state.selectedClientId=null;return render()}if(action==='maine-finance'){return}if(CoBook.maineClients&&typeof CoBook.maineClients.handle==='function')return CoBook.maineClients.handle(action,e)}
 CoBook.modules.maine={render,handle};
})();
