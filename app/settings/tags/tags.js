/* CoBook TAGS — user-defined labels */
(function(){
 const KEY='cobook_tags';
 const read=()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v:[]}catch(_){return[]}};
 const write=v=>localStorage.setItem(KEY,JSON.stringify(v));
 const back=()=>`<button class="section-back-button" data-action="navigate" data-page="settings" type="button">Назад</button>`;
 function home(){
   const tags=read();
   return shell(`<section class="page-head"><div class="eyebrow">НАСТРОЙКИ · ЯРЛЫКИ</div><h1>Ярлыки</h1></section><section class="service-list tags-list">${tags.length?tags.map((t,i)=>CoBook.ui.listItem({icon:'●',iconAttrs:`data-tag-color="${String(t.color||'#8a7466').replace(/\"/g,'&quot;')}"`,title:t.name,subtitle:'Пользовательский ярлык',action:'tag-delete',actionLabel:'Удалить',actionAttrs:`data-tag-index="${i}"`,itemClass:'tag-list-item'})).join(''):'<div class="loyalty-empty">Ярлыков пока нет</div>'}</section><button class="primary full" data-action="tag-create" type="button">Добавить ярлык</button>${back()}`);
 }
 function editor(){return shell(`<section class="page-head"><div class="eyebrow">НАСТРОЙКИ · ЯРЛЫК</div><h1>Новый ярлык</h1></section><section class="panel"><label class="service-field"><span>Название</span><input data-tag-name maxlength="40" placeholder="Например, VIP"></label><label class="service-field"><span>Цвет</span><input data-tag-color type="color" value="#8a7466"></label><button class="primary full" data-action="tag-save" type="button">Сохранить</button></section>${back()}`);}
 function render(){return state.tagsView==='editor'?editor():home()}
 function refresh(){window.render()}
 function handle(action,e){
   if(action==='tag-create'){state.tagsView='editor';return refresh()}
   if(action==='tag-save'){
     const name=document.querySelector('[data-tag-name]')?.value.trim();
     const color=document.querySelector('[data-tag-color]')?.value||'#8a7466';
     if(!name)return;
     const tags=read(); tags.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),name,color}); write(tags);
     state.tagsView='home'; refresh(); return;
   }
   if(action==='tag-delete'){
     const index=Number(e.dataset.tagIndex),tags=read();
     if(!Number.isInteger(index)||index<0||index>=tags.length)return;
     tags.splice(index,1); write(tags); refresh();
   }
 }
 CoBook.modules.tags={render,handle,onEnter(){state.tagsView='home'},onLeave(){}};
})();
