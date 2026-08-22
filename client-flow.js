/* CoBook — клиент: услуга → дата → время → подтверждение → главная */

function clientMonthCalendar(){
  const days=allMonthDays(st.month), week=['Пн','Вт','Ср','Чт','Пт','Сб','Вс'], s=svc(st.service);
  return `<div class="month-head"><button class="secondary" data-cflow-month="prev">‹</button><b>${esc(monthName(st.month))}</b><button class="secondary" data-cflow-month="next">›</button></div><div class="month-grid">${week.map(x=>`<div class="weekday">${x}</div>`).join('')}${days.map(x=>{const other=x.slice(0,7)!==st.month;const working=isWorking(x);const available=!!s&&slots(x,s).length>0;const statusClass=working?(available?'working':'working-no-time'):'off';return `<button class="month-day ${other?'other':''} ${statusClass} ${x===st.date?'selected':''}" data-cflow-date="${x}" ${available&&!other?'':'disabled'}><span>${D(x).getDate()}</span></button>`}).join('')}</div><div class="calendar-legend"><span><i>●</i> рабочий день</span><span><i>—</i> выходной</span></div>`;
}

function clientBooking(){
  const s=svc(st.service);
  if(st.page==='selectDate')return shell(`<div class="stepbar"><span>1. Услуга</span><b>2. Дата</b><span>3. Время</span><span>4. Подтверждение</span></div><div class="row"><div><h2>Выберите дату</h2><div class="small muted">${esc(s.name)} · ${s.duration} мин · ${money(s.price)}</div></div><button class="secondary" data-cflow-back="service">← Услуга</button></div>${clientMonthCalendar()}`,'');
  if(st.page==='selectTime'){const sl=slots(st.date,s);return shell(`<div class="stepbar"><span>1. Услуга</span><span>2. Дата</span><b>3. Время</b><span>4. Подтверждение</span></div><div class="row"><div><h2>Выберите время</h2><div class="small muted">${esc(s.name)}</div><div class="small muted">${fmt(st.date)}</div></div><button class="secondary" data-cflow-back="date">← Дата</button></div>${sl.length?`<div class="grid">${sl.map(t=>`<button class="slot" data-cflow-slot="${t}">${t}</button>`).join('')}`:'<div class="empty card">На эту дату свободного времени нет.</div>'}`,'');}
  if(st.page==='confirm')return confirmPage();
  return shell(`<div class="stepbar"><b>1. Услуга</b><span>2. Дата</span><span>3. Время</span><span>4. Подтверждение</span></div><h2>Выберите услугу</h2>${db.services.filter(x=>x.active).map(x=>`<button class="service" data-cflow-service="${x.id}"><div class="row"><div><b>${esc(x.name)}</b><div class="small muted">${x.duration} минут</div></div><b>${money(x.price)}</b></div></button>`).join('')}`,'');
}

function clientOverride(){if(st.page==='home')return clientHome();return clientBooking();}

render=function(){document.getElementById('app').innerHTML=st.role?(st.role==='master'?master():clientOverride()):home();bind();};

/* Client flow owns the client controls. This avoids the old app.js handlers
   interfering with the separate-screen booking flow. */
document.addEventListener('click',e=>{
  const role=e.target.closest('[data-role]');
  if(role){
    e.preventDefault();
    e.stopImmediatePropagation();
    st.role=role.dataset.role;
    st.page='home';
    st.service=null;
    st.slot=null;
    st.date=today();
    st.month=st.date.slice(0,7);
    render();
    return;
  }

  if(st.role!=='client')return;

  const newBooking=e.target.closest('[data-new-booking]');
  if(newBooking){
    e.preventDefault();
    e.stopImmediatePropagation();
    st.page='selectService';
    st.service=null;
    st.slot=null;
    st.date=today();
    st.month=st.date.slice(0,7);
    render();
    return;
  }

  const service=e.target.closest('[data-cflow-service]');
  if(service){
    e.preventDefault();
    e.stopImmediatePropagation();
    st.service=service.dataset.cflowService;
    st.date=today();
    st.month=st.date.slice(0,7);
    st.slot=null;
    st.page='selectDate';
    render();
    return;
  }

  const date=e.target.closest('[data-cflow-date]');
  if(date&&!date.disabled){
    e.preventDefault();
    e.stopImmediatePropagation();
    st.date=date.dataset.cflowDate;
    st.month=st.date.slice(0,7);
    st.slot=null;
    st.page='selectTime';
    render();
    return;
  }

  const slot=e.target.closest('[data-cflow-slot]');
  if(slot){
    e.preventDefault();
    e.stopImmediatePropagation();
    st.slot=slot.dataset.cflowSlot;
    st.page='confirm';
    render();
    return;
  }

  const back=e.target.closest('[data-cflow-back]');
  if(back){
    e.preventDefault();
    e.stopImmediatePropagation();
    st.slot=null;
    st.page=back.dataset.cflowBack==='service'?'home':'selectDate';
    render();
    return;
  }

  const month=e.target.closest('[data-cflow-month]');
  if(month){
    e.preventDefault();
    e.stopImmediatePropagation();
    const d=D(st.month+'-01');
    d.setMonth(d.getMonth()+(month.dataset.cflowMonth==='next'?1:-1));
    st.month=iso(d).slice(0,7);
    render();
    return;
  }
},true);

render();
