(function(){
 function render(){
   const clientCount=Array.isArray(state.clients)?state.clients.length:0;
   return shell(`<section class="hero"><div class="eyebrow">КАБИНЕТ МАСТЕРА</div><h1>Главная</h1><div class="premium-grid"><button class="premium" data-action="maine-clients" type="button"><span class="premium-title">Клиенты</span><span class="premium-value">${clientCount}</span><span class="premium-meta">клиентов</span></button><button class="premium" data-action="maine-finance" type="button"><span class="premium-title">Финансы</span><span class="premium-value">0 ₽</span><span class="premium-meta">средний чек</span></button></div></section>`)
 }
 function handle(action){if(action==='maine-clients')return; if(action==='maine-finance')return;}
 CoBook.modules.maine={render,handle};
})();
