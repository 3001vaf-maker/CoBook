(function(){
  const KEY='cobook_profile';
  const defaults={photo:'',name:'',phone:'',about:''};
  const read=()=>readStorage(KEY,defaults);
  const save=p=>localStorage.setItem(KEY,JSON.stringify(p));
  function render(){const p=read();return `<div class="profile-clean-card"><form data-personal-form>${CoBook.ui.field({label:'Имя *',name:'name',value:p.name,placeholder:'Ваше имя',attrs:'required'})}${CoBook.ui.field({label:'Телефон',name:'phone',value:p.phone,type:'tel',placeholder:'Номер телефона'})}${CoBook.ui.textarea({label:'О себе',name:'about',value:p.about,placeholder:'Коротко о себе'})}<div class="profile-clean-actions">${CoBook.ui.button({label:'Сохранить',action:'profile-personal-save',variant:'primary'})}</div></form></div>`}
  function handle(action,e){if(action!=='profile-personal-save')return;const form=e.closest('[data-personal-form]');if(!form)return;const data=Object.fromEntries(new FormData(form).entries());if(!String(data.name||'').trim())return;save(Object.assign({},read(),data));if(typeof window.CoBook.modules?.profile?.refresh==='function')window.CoBook.modules.profile.refresh()}
  window.CoBook=window.CoBook||{};CoBook.profileSections=CoBook.profileSections||{};CoBook.profileSections.personal={render,read,save,handle};
})();