(function(){
 function render(){if(state.maineView==='clients')return CoBook.maineClients.render();return shell(`<section class="hero"><div class="eyebrow">КАБИНЕТ МАСТЕРА</div><h1>Главная</h1><button class="primary full" data-action="maine-clients" type="button">Клиенты</button></section>`)}
 function handle(action,e){if(action==='maine-clients'){state.maineView='clients';state.clientView='list';state.selectedClientId=null;return render()}if(CoBook.maineClients&&typeof CoBook.maineClients.handle==='function')return CoBook.maineClients.handle(action,e)}
 CoBook.modules.maine={render,handle};
})();
