(function(){
  let active=null;
  const ensure=()=>{let r=document.getElementById('cobook-master-booking-fix');if(!r){r=document.createElement('div');r.id='cobook-master-booking-fix';document.body.appendChild(r)}return r};
  const close=()=>{active=null;const r=document.getElementById('cobook-master-booking-fix');if(r)r.innerHTML=''};
  const selected=()=>active.services.filter(s=>s.checked);
  const total=()=>selected().reduce((n,s)=>n+Number(s.duration||0),0);
  const render=()=>{
    if(!active)return;
    const r=ensure();
    if(active.step===1){
      r.innerHTML=`<div class="booking-modal-backdrop"><section class="booking-modal">
        <h3>1. Уточнить время начала</h3>
        <div class="muted small" style="margin-bottom:12px">Вы выбрали ${esc(active.original)}. Проверьте время начала.</div>
        <label>Начало<input id="fix-start" type="time" value="${active.start}"></label>
        <div class="modal-actions"><button class="secondary" id="fix-cancel">Отмена</button><button class="primary" id="fix-next">Далее</button></div>
      </section></div>`;
      document.getElementById('fix-cancel').onclick=close;
      document.getElementById('fix-next').onclick=()=>{const v=document.getElementById('fix-start').value;if(!v){alert('Укажите время начала.');return}active.start=v;active.step=2;render()};
      return;
    }
    if(active.step===2){
      r.innerHTML=`<div class="booking-modal-backdrop"><section class="booking-modal">
        <h3>2. Выберите услуги</h3>
        <div class="small muted" style="margin-bottom:8px">Можно выбрать несколько услуг. Длительность каждой можно изменить.</div>
        ${active.services.map((s,i)=>`<label class="booking-service"><input type="checkbox" data-fix-check="${i}" ${s.checked?'checked':''}><div class="booking-service-name"><b>${esc(s.name)}</b><span>По прайсу: ${s.baseDuration} мин · ${money(s.price)}</span></div><input type="number" min="15" step="15" data-fix-duration="${i}" value="${s.duration}"></label>`).join('')}
        <div class="booking-summary"><div class="row"><span>Выбрано</span><b>${selected().length}</b></div><div class="row"><span>Общая длительность</span><b>${total()} мин</b></div></div>
        <div class="modal-actions"><button class="secondary" id="fix-back">Назад</button><button class="primary" id="fix-services-next">Далее</button></div>
      </section></div>`;
      document.querySelectorAll('[data-fix-check]').forEach(x=>x.onchange=()=>{active.services[Number(x.dataset.fixCheck)].checked=x.checked;render()});
      document.querySelectorAll('[data-fix-duration]').forEach(x=>x.onchange=()=>{const i=Number(x.dataset.fixDuration);active.services[i].duration=Math.max(15,Number(x.value)||15);render()});
      document.getElementById('fix-back').onclick=()=>{active.step=1;render()};
      document.getElementById('fix-services-next').onclick=()=>{if(!selected().length){alert('Выберите хотя бы одну услугу.');return}active.step=3;render()};
      return;
    }
    const start=M(active.start), duration=total(), end=start+duration;
    const h=db.hours[wd(st.date)]||['10:00','20:00'];
    const outside=end>M(h[1]);
    const breakHit=db.breaks.some(x=>x.day===wd(st.date)&&overlap(start,end,M(x.start),M(x.end)));
    const busy=db.bookings.some(x=>x.date===st.date&&x.status!=='cancelled'&&overlap(start,end,M(x.start),M(x.end)));
    const price=selected().reduce((n,s)=>n+Number(s.price||0),0);
    r.innerHTML=`<div class="booking-modal-backdrop"><section class="booking-modal">
      <h3>3. Подтвердить запись</h3>
      <div class="booking-summary"><div class="row"><span>Дата</span><b>${fmt(st.date)}</b></div><div class="row"><span>Начало</span><b>${active.start}</b></div><div class="row"><span>Окончание</span><b>${HM(end)}</b></div><div class="row"><span>Длительность</span><b>${duration} мин</b></div><div class="row"><span>Стоимость</span><b>${money(price)}</b></div></div>
      <h4>Услуги</h4>${selected().map(s=>`<div class="row"><span>${esc(s.name)} · ${s.duration} мин</span><span>${money(s.price)}</span></div>`).join('')}
      <label style="display:block;margin-top:12px">Клиент (необязательно)<input id="fix-name" type="text" placeholder="Без клиента"></label>
      ${outside?'<div class="notice" style="margin-top:10px">Запись выходит за пределы рабочего времени.</div>':''}
      ${breakHit?'<div class="notice" style="margin-top:10px">Запись пересекает перерыв.</div>':''}
      ${busy?'<div class="notice" style="margin-top:10px">Это время уже занято.</div>':''}
      <div class="modal-actions"><button class="secondary" id="fix-back-services">Назад</button><button class="primary" id="fix-confirm" ${outside||breakHit||busy?'disabled':''}>Подтвердить</button></div>
    </section></div>`;
    document.getElementById('fix-back-services').onclick=()=>{active.step=2;render()};
    document.getElementById('fix-confirm').onclick=()=>{
      const name=(document.getElementById('fix-name').value||'').trim()||'Без клиента';
      const ss=selected();
      db.bookings.push({id:'b'+Date.now(),date:st.date,start:active.start,end:HM(end),serviceId:ss[0].id,serviceName:ss.map(s=>s.name).join(' + '),services:ss.map(s=>({id:s.id,name:s.name,duration:s.duration,price:s.price})),price,duration,name,status:'confirmed'});
      save();close();window.render();
    };
  };
  const open=(slot)=>{const services=db.services.filter(s=>s.active);active={step:1,original:slot,start:slot,services:services.map(s=>({id:s.id,name:s.name,baseDuration:s.duration,duration:s.duration,price:s.price,checked:false}))};render()};
  document.addEventListener('click',e=>{const b=e.target.closest('[data-free-slot],[data-free]');if(!b||st.role!=='master')return;e.preventDefault();e.stopImmediatePropagation();open(b.dataset.freeSlot||b.dataset.free)},true);
})();