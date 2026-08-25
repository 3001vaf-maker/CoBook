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
      <div class="profile-clean-actions"><button class="primary" type="submit">Сохранить</button></div>
    </form></div>`;
  }
  window.CoBook=window.CoBook||{};
  CoBook.profileSections=CoBook.profileSections||{};
  CoBook.profileSections.personal={render,read,save};
  document.addEventListener('submit',e=>{
    const form=e.target.closest('[data-personal-form]');
    if(!form)return;
    e.preventDefault();
    const p=Object.assign({},read(),Object.fromEntries(new FormData(form).entries()));
    save(p);
    if(typeof window.CoBook.modules?.profile?.refresh==='function')window.CoBook.modules.profile.refresh();
  });
})();
