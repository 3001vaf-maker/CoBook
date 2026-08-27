(function(){
  const KEY='cobook_profile';
  const defaults={photo:'',name:'',phone:'',about:''};
  const read=()=>readStorage(KEY,defaults);
  const save=p=>localStorage.setItem(KEY,JSON.stringify(p));
  function render(){
    const p=read();
    const esc=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;');
    return `<div class="profile-clean-card"><form data-personal-form>
      <label><span>Имя *</span><input name="name" required value="${esc(p.name)}" placeholder="Ваше имя"></label>
      <label><span>Телефон</span><input name="phone" type="tel" value="${esc(p.phone)}" placeholder="Номер телефона"></label>
      <label><span>О себе</span><textarea name="about" placeholder="Коротко о себе">${esc(p.about)}</textarea></label>
      <div class="profile-clean-actions"><button class="primary" type="button" data-action="profile-personal-save">Сохранить</button></div>
    </form></div>`;
  }
  function handle(action,e){
    if(action!=='profile-personal-save')return;
    const form=e.closest('[data-personal-form]');
    if(!form)return;
    const data=Object.fromEntries(new FormData(form).entries());
    if(!String(data.name||'').trim())return;
    save(Object.assign({},read(),data));
    if(typeof window.CoBook.modules?.profile?.refresh==='function')window.CoBook.modules.profile.refresh();
  }
  window.CoBook=window.CoBook||{};
  CoBook.profileSections=CoBook.profileSections||{};
  CoBook.profileSections.personal={render,read,save,handle};
})();
