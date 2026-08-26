/* CoBook WALLETS — fixed payment types + user-defined wallets */
(function(){
 const KEY='cobook_wallets';
 const read=()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v:[]}catch(_){return[]}};
 const write=v=>localStorage.setItem(KEY,JSON.stringify(v));
 const esc=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;');
 const newId=()=>crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random());
 const back=()=>`<button class="section-back-button" data-action="navigate" data-page="settings" type="button">Назад</button>`;
 function home(){
   const wallets=read();
   return shell(`<section class="page-head"><div class="eyebrow">НАСТРОЙКИ · КОШЕЛЬКИ</div><h1>Кошельки</h1><p>Системные способы оплаты и ваши собственные кошельки.</p></section><section class="wallet-section"><div class="wallet-section-title">Способы оплаты</div><div class="wallet-list"><div class="wallet-row"><span class="wallet-icon">₽</span><span><b>Наличный расчёт</b><small>Системный способ оплаты</small></span></div><div class="wallet-row"><span class="wallet-icon">▣</span><span><b>Безналичный расчёт</b><small>Системный способ оплаты</small></span></div></div></section><section class="wallet-section"><div class="wallet-section-title">Мои кошельки</div>${wallets.length?`<div class="wallet-list">${wallets.map((w,i)=>`<div class="wallet-row"><span class="wallet-icon">◉</span><span><b>${esc(w.name)}</b><small>Пользовательский кошелёк</small></span><button class="danger wallet-delete" data-action="wallet-delete" data-wallet-index="${i}" type="button">Удалить</button></div>`).join('')}</div>`:'<div class="wallet-empty">Кошельков пока нет</div>'}</section><button class="primary full" data-action="wallet-create" type="button">Добавить кошелёк</button>${back()}`);
 }
 function editor(){return shell(`<section class="page-head"><div class="eyebrow">НАСТРОЙКИ · КОШЕЛЁК</div><h1>Новый кошелёк</h1></section><section class="panel"><label class="service-field"><span>Название кошелька</span><input data-wallet-name maxlength="60" autocomplete="off" placeholder="Например, Сбербанк"></label><button class="primary full" data-action="wallet-save" type="button">Сохранить</button></section>${back()}`)}
 function render(){return state.walletsView==='editor'?editor():home()}
 function refresh(){app.innerHTML=render()}
 function handle(action,e){
   if(action==='wallet-create'){state.walletsView='editor';refresh();return}
   if(action==='wallet-save'){
     const name=document.querySelector('[data-wallet-name]')?.value.trim();
     if(!name)return;
     const wallets=read();
     wallets.push({id:newId(),name});
     write(wallets);
     state.walletsView='home';
     refresh();
     return;
   }
   if(action==='wallet-delete'){
     const index=Number(e.dataset.walletIndex),wallets=read();
     if(!Number.isInteger(index)||index<0||index>=wallets.length)return;
     wallets.splice(index,1);
     write(wallets);
     refresh();
   }
 }
 CoBook.modules.wallets={render,handle,onEnter(){state.walletsView='home'},onLeave(){}};
})();
