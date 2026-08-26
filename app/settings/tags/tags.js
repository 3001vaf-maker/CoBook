/* CoBook TAGS — user-defined labels */
(function(){
 const KEY='cobook_tags';
 const read=()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v:[]}catch(_){return[]}};
 const write=v=>localStorage.setItem(KEY,JSON.stringify(v));
 const esc=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;');
 const back=()=>`<button class="section-back-button" data-action="navigate" data-page="settings" type="button">Назад</button>`;
 function home(){
   const tags=read();
   return shell(`<section class="page-head"><div class="eyebrow">НАСТРОЙКИ · ЯРЛЫКИ</div><h1>Ярлыки</h1></section><div class="tags-list">${tags.length?tags.map((t,i)=>`<div class="tags-row"><span class="tag-chip" style="--tag-color:${esc(t.color)}">${esc(t.name)}</span><button class="secondary tags-delete" data-tag-delete="${i}" type="button">Удалить</button></div>`).join(''):'<div class="loyalty-empty">Ярлыков пока нет</div>'}</div><button class="primary full" data-tag-create type="button">Добавить ярлык</button>${back()}`);
 }
 function editor(){return shell(`<section class="page-head"><div class="eyebrow">НАСТРОЙКИ · ЯРЛЫК</div><h1>Новый ярлык</h1></section><section class="loyalty-form"><label class="service-field"><span>Название</span><input data-tag-name maxlength="40" placeholder="Например, VIP"></label><label class="service-field"><span>Цвет</span><input data-tag-color type="color" value="#8a7466"></label><button class="primary full" data-tag-save type="button">Сохранить</button></section>${back()}`);}
 function handle(_,e){
   if(e.hasAttribute('data-tag-create'))return renderEditor();
   if(e.hasAttribute('data-tag-save')){const name=document.querySelector('[data-tag-name]')?.value.trim();const color=document.querySelector('[data-tag-color]')?.value||'#8a7466';if(!name)return;const tags=read();tags.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),name,color});write(tags);return render();}
   const del=e.getAttribute('data-tag-delete');if(del!==null){const tags=read();tags.splice(Number(del),1);write(tags);return render();}
 }
 function renderEditor(){state.tagsView='editor';app.innerHTML=editor();}
 function render(){return state.tagsView==='editor'?editor():home()}
 document.addEventListener('click',e=>{const t=e.target instanceof Element?e.target:e.target?.parentElement;if(state.page!=='tags')return;const el=t?.closest?.('[data-tag-create],[data-tag-save],[data-tag-delete]');if(el)handle(null,el)},false);
 CoBook.modules.tags={render,handle,onEnter(){state.tagsView='home'},onLeave(){}};
})();
