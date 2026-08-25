(function(){
 const KEY='cobook_profile';
 const roles=['Парикмахер','Барбер','Колорист','Мастер по наращиванию волос','Мастер маникюра','Мастер педикюра','Нейл-мастер','Визажист','Бровист','Лэшмейкер','Косметолог','Эстетист','Мастер депиляции','Мастер шугаринга','Мастер перманентного макияжа','Массажист','Стилист / имиджмейкер','Тату-мастер','Другое'];
 const experiences=['До 1 года','1–3 года','3–5 лет','5–10 лет','10–20 лет','Более 20 лет'];
 const esc=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;').replace(/'/g,'&#39;');
 const opt=(list,v,empty)=>`<option value="">${empty}</option>`+list.map(x=>`<option value="${esc(x)}" ${v===x?'selected':''}>${esc(x)}</option>`).join('');
 function read(){return readStorage(KEY,{photo:'',name:'',phone:'',about:'',links:[],role:'',experience:'',professionAbout:''})}
 function render(){const p=read();return `<form class="profile-form" data-profile-form><section class="profile-card"><div class="profile-card-title">Профессиональные данные</div><label class="profile-field"><span>Профессия</span><select name="role">${opt(roles,p.role,'Выберите профессию')}</select></label><label class="profile-field"><span>Опыт работы</span><select name="experience">${opt(experiences,p.experience,'Выберите опыт')}</select></label><label class="profile-field"><span>О профессии</span><textarea name="professionAbout" rows="5" placeholder="Расскажите о своей специализации и опыте">${esc(p.professionAbout)}</textarea></label></section><button class="primary profile-save" type="submit">Сохранить</button></form>`}
 window.CoBook=window.CoBook||{};CoBook.profileSections=CoBook.profileSections||{};CoBook.profileSections.profession={render,roles,experiences};
})();
