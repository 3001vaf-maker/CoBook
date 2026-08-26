/* CoBook TAGS — user-defined labels */
(function(){
 const KEY='cobook_tags';
 const read=()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v:[]}catch(_){return[]}};
 const write=v=>localStorage.setItem(KEY,JSON.stringify(v));
 const esc=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;');
 const back=()=>`<button class="section-back-button" data-action="navigate" data-page="settings" type="button">Назад</button>`;
 function home(){
   const tags=read();
   return shell(`<section class="page-head"><div class="eyebrow">НАСТРОЙКИ · ЯРЛЫКИ</div><h1>Ярлыки</h1></section><div class="tags-list">${tags.length?tags.map((t,i)=>`<div class="tags-row"><span class="tag-chip" style="--tag-color:${esc(t.color)}">${esc(t.name)}</span><button class="danger tags-delete" data-action="tag-delete" data-tag-index="${i}" type="button">Удалить</button></div>`).join(''):'<div class="loyalty-empty">Ярлыков пока нет</div>'}</div><button class="primary full" data-action="tag-create" type="button">Добавить ярлык</button>${back()}`);
 }
 function editor(){return shell(`<section class="page-head"><div class="eyebrow">НАСТРОЙКИ · ЯРЛЫК</div><h1>Новый ярлык</h1></section><section class="loyalty-form"><label class="service-field"><span>Название</span><input data-tag-name maxlength="40" placeholder="Например, VIP"></label><label class="service-field"><span>Цвет</span><input data-tag-color type="color" value="#8a7466"></label><button class="primary full" data-action="tag-save" type="button">Сохранить</button></section>${back()}`);}
 function handle(action,e){
   if(action==='tag-create')return renderEditor();
   if(action==='tag-save'){
     const name=document.querySelector('[data-tag-name]')?.value.trim();
     const color=document.querySelector('[data-tag-color]')?.value||'#8a7466';
     if(!name)return;
     const tags=read();
     tags.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),name,color});
     write(tags);
     state.tagsView='home';
     return render();
   }
   if(action==='tag-delete'){
     const index=Number(e.dataset.tagIndex);
     const tags=read();
     if(!Number.isInteger(index)||index<0||index>=tags.length)return;
     tags.splice(index,1);
     write(tags);
     return render();
   }
 }
 function renderEditor(){state.tagsView='editor';app.innerHTML=editor();}
 function render(){return state.tagsView==='editor'?editor():home()}
 CoBook.modules.tags={render,handle,onEnter(){state.tagsView='home'},onLeave(){}};
})();
