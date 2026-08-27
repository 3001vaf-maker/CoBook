/* CoBook WALLETS — fixed payment types + user-defined wallets */
(function(){
 const KEY='cobook_wallets';
 const read=()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v:[]}catch(_){return[]}};
 const write=v=>localStorage.setItem(KEY,JSON.stringify(v));
 const esc=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;');
 const newId=()=>crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random());
 const back=()=>`<button class="section-back-button" data-action="navigate" data-page="settings" type="button">Назад</button>`;
 function confirmDelete(wallet){
   if(!wallet)return '';
   return `<div class="confirm-modal" data-modal="wallet-delete" role="dialog" aria-modal="true" aria-labelledby="wallet-delete-title"><div class="confirm-modal-inner"><div class="confirm-modal-eyebrow">УДАЛЕНИЕ КОШЕЛЬКА</div><h2 id="wallet-delete-title">Удалить «${esc(wallet.name)}»?</h2><p>Это действие удалит кошелёк и все данные, связанные с ним. Восстановить удалённые данные будет невозможно.</p><div class="confirm-modal-actions"><button class="primary" data-action="wallet-delete-cancel" type="button">Отмена</button><button class="danger" data-action="wallet-delete-confirm" type="button">Подтвердить удаление</button></div></div></div>`;
 }
 const listItem=(icon,title,subtitle,action='',index=null)=>CoBook.ui.listItem({icon,title,subtitle,action,actionLabel:action?'Удалить':'',actionAttrs:action&&index!==null?`data-wallet-index="${index}"`:'',itemClass:'wallet-list-item'});
 function home(){
   const wallets=read();
   const pending=Number.isInteger(state.walletDeleteIndex)?wallets[state.walletDeleteIndex]:null;
   return shell(`<section class="page-head"><div class="eyebrow">НАСТРОЙКИ · КОШЕЛЬКИ</div><h1>Кошельки</h1><p>Системные способы оплаты и ваши собственные кошельки.</p></section><section class="wallet-section"><div class="wallet-section-title">Способы оплаты</div><div class="service-list wallet-list">${listItem('₽','Наличный расчёт','Системный способ оплаты')}${listItem('▣','Безналичный расчёт','Системный способ оплаты')}</div></section><section class="wallet-section"><div class="wallet-section-title">Мои кошельки</div>${wallets.length?`<div class="service-list wallet-list">${wallets.map((w,i)=>listItem('◉',w.name,'Пользовательский кошелёк','wallet-delete',i)).join('')}</div>`:'<div class="wallet-empty">Кошельков пока нет</div>'}</section><button class="primary full" data-action="wallet-create" type="button">Добавить кошелёк</button>${back()}${pending?confirmDelete(pending):''}`);
 }
 function editor(){return shell(`<section class="page-head"><div class="eyebrow">НАСТРОЙКИ · КОШЕЛЁК</div><h1>Новый кошелёк</h1></section><section class="panel"><label class="service-field"><span>Название кошелька</span><input data-wallet-name maxlength="60" autocomplete="off" placeholder="Например, Сбербанк"></label><button class="primary full" data-action="wallet-save" type="button">Сохранить</button></section>${back()}`)}
 function render(){return state.walletsView==='editor'?editor():home()}
 function refresh(){app.innerHTML=render()}
 function handle(action,e){
   if(action==='wallet-create'){state.walletsView='editor';state.walletDeleteIndex=null;refresh();return}
   if(action==='wallet-save'){
     const name=document.querySelector('[data-wallet-name]')?.value.trim();
     if(!name)return;
     const wallets=read(); wallets.push({id:newId(),name}); write(wallets);
     state.walletsView='home'; state.walletDeleteIndex=null; refresh(); return;
   }
   if(action==='wallet-delete'){
     const index=Number(e.dataset.walletIndex),wallets=read();
     if(!Number.isInteger(index)||index<0||index>=wallets.length)return;
     state.walletDeleteIndex=index; refresh(); return;
   }
   if(action==='wallet-delete-cancel'){state.walletDeleteIndex=null;refresh();return}
   if(action==='wallet-delete-confirm'){
     const index=state.walletDeleteIndex,wallets=read();
     if(!Number.isInteger(index)||index<0||index>=wallets.length){state.walletDeleteIndex=null;refresh();return}
     wallets.splice(index,1);write(wallets);state.walletDeleteIndex=null;refresh();
   }
 }
 CoBook.modules.wallets={render,handle,onEnter(){state.walletsView='home';state.walletDeleteIndex=null},onLeave(){}};
})();
