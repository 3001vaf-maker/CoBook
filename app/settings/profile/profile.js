(function(){
 const STORAGE_KEY='cobook_profile';
 const readProfile=()=>readStorage(STORAGE_KEY,{name:'',phone:'',email:'',birthDate:'',city:'',role:'',experience:'',about:''});
 const roles=['Парикмахер','Барбер','Колорист','Мастер по наращиванию волос','Мастер маникюра','Мастер педикюра','Нейл-мастер','Визажист','Бровист','Лэшмейкер','Косметолог','Эстетист','Мастер депиляции','Мастер шугаринга','Мастер перманентного макияжа','Массажист','Стилист / имиджмейкер','Тату-мастер','Другое'];
 function render(){
  const p=readProfile();
  return shell(`<section class="page-head"><div class="eyebrow">НАСТРОЙКИ</div><h1>Профиль пользователя</h1><p>Основная информация о мастере и его профессиональной деятельности.</p></section>
  <form class="profile-form" data-profile-form>
   <div class="profile-block"><div class="profile-block-title">Личная информация</div>
    <label class="profile-field"><span>Имя</span><input name="name" type="text" value="${escapeHtml(p.name)}" placeholder="Ваше имя" autocomplete="name"></label>
    <label class="profile-field"><span>Телефон</span><input name="phone" type="tel" value="${escapeHtml(p.phone)}" placeholder="Номер телефона" autocomplete="tel"></label>
    <label class="profile-field"><span>Email</span><input name="email" type="email" value="${escapeHtml(p.email)}" placeholder="Электронная почта" autocomplete="email"></label>
    <label class="profile-field"><span>Дата рождения</span><input name="birthDate" type="date" value="${escapeHtml(p.birthDate)}"></label>
    <label class="profile-field"><span>Город</span><input name="city" type="text" value="${escapeHtml(p.city)}" placeholder="Город" autocomplete="address-level2"></label>
   </div>
   <div class="profile-block"><div class="profile-block-title">Профессиональная информация</div>
    <label class="profile-field"><span>Кто я</span><select name="role"><option value="">Выберите специализацию</option>${roles.map(role=>`<option value="${escapeHtml(role)}" ${p.role===role?'selected':''}>${escapeHtml(role)}</option>`).join('')}</select></label>
    <label class="profile-field"><span>Опыт работы</span><select name="experience"><option value="">Выберите опыт</option>${['До 1 года','1–3 года','3–5 лет','5–10 лет','10–20 лет','Более 20 лет'].map(v=>`<option value="${escapeHtml(v)}" ${p.experience===v?'selected':''}>${escapeHtml(v)}</option>`).join('')}</select></label>
    <label class="profile-field"><span>О себе</span><textarea name="about" rows="4" placeholder="Коротко о себе, специализации и работе">${escapeHtml(p.about)}</textarea></label>
   </div>
   <button class="primary profile-save" type="submit">Сохранить</button>
  </form>
  <div class="section-back-wrap"><button class="section-back-button" data-action="navigate" data-page="settings" type="button">Назад</button></div>`);
 }
 function escapeHtml(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
 function handle(action,e){if(action!=='profile-save')return;const form=e.closest('[data-profile-form]');if(!form)return;const data=Object.fromEntries(new FormData(form).entries());localStorage.setItem(STORAGE_KEY,JSON.stringify(data));render();}
 document.addEventListener('submit',e=>{const form=e.target.closest('[data-profile-form]');if(!form)return;e.preventDefault();handle('profile-save',form.querySelector('.profile-save'));});
 CoBook.modules.profile={render,handle};
})();
