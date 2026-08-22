/* CoBook — клиентский сценарий записи: услуга → дата → время → подтверждение → главная */

function clientMonthCalendar(){
  const days=allMonthDays(st.month), week=['Пн','Вт','Ср','Чт','Пт','Сб','Вс'], s=svc(st.service);
  return `<div class="month-head"><button class="secondary" data-cflow-month="prev">‹</button><b>${esc(monthName(st.month))}</b><button class="secondary" data-cflow-month="next">›</button></div>
  <div class="month-grid">${week.map(x=>`<div class="weekday">${x}</div>`).join('')}${days.map(x=>{
    const other=x.slice(0,7)!==st.month;
    const working=isWorking(x);
    const available=!!s && slots(x,s).length>0;
    const usable=working&&available;
    return `<button class="month-day ${other?'other':''} ${usable?'working':'off'} ${x===st.date?'selected':''}" data-cflow-date="${x}" ${usable?'':'disabled'}><span>${D(x).getDate()}</span></button>`;
  }).join('')}</div>
  <div class="calendar-legend"><span><i class="legend-work">●</i> доступно</span><span><i>—</i> недоступно</span></div>`;
}

function clientBooking(){
  const s=svc(st.service);
  if(st.page==='selectDate') return shell(`<div class="row"><div><h2>Выбор даты</h2><div class="small muted">${esc(s.name)} · ${s.duration} мин · ${money(s.price)}</div></div><button class="secondary" data-cflow-back="service">← Услуга</button></div>${clientMonthCalendar()}<div class="notice">Чёрным жирным показаны даты, где для выбранной услуги есть свободное время.</div>`,'');
  if(st.page==='selectTime'){
    const sl=slots(st.date,s);
    return shell(`<div class="row"><div><h2>Выбор времени</h2><div class="small muted">${esc(s.name)} · ${fmt(st.date)}</div></div><button class="secondary" data-cflow-back="date">← Дата</button></div>${sl.length?`<div class="grid">${sl.map(t=>`<button class="slot ${t===st.slot?'active':''}" data-cflow-slot="${t}">${t}</button>`).join('')}`:'<div class="empty card">На эту дату свободного времени нет.</div>'}${st.slot?`<button class="primary" data-cflow-next-confirm>Продолжить</button>`:''}`,'');
  }
  if(st.page==='confirm') return confirmPage();
  return shell(`<div class="hero"><h1>Новая запись</h1><p>Выберите услугу.</p></div><h2>1. Услуга</h2>${db.services.filter(x=>x.active).map(x=>`<button class="service" data-cflow-service="${x.id}"><div class="row"><div><b>${esc(x.name)}</b><div class="small muted">${x.duration} минут</div></div><b>${money(x.price)}</b></div></button>`).join('')}`,'');
}

function clientOverride(){
  if(st.page==='home') return clientHome();
  return clientBooking();
}

const _oldRender=render;
render=function(){
  document.getElementById('app').innerHTML=st.role?(st.role==='master'?master():clientOverride()):home();
  bind();
};

let _cflowBound=false;
if(!_cflowBound){
  document.addEventListener('click',e=>{
    const service=e.target.closest('[data-cflow-service]');
    if(service){
      e.preventDefault(); st.service=service.dataset.cflowService; st.date=today(); st.month=st.date.slice(0,7); st.slot=null; st.page='selectDate'; render(); return;
    }
    const date=e.target.closest('[data-cflow-date]');
    if(date && !date.disabled){
      e.preventDefault(); st.date=date.dataset.cflowDate; st.month=st.date.slice(0,7); st.slot=null; st.page='selectTime'; render(); return;
    }
    const slot=e.target.closest('[data-cflow-slot]');
    if(slot){
      e.preventDefault(); st.slot=slot.dataset.cflowSlot; render(); return;
    }
    const next=e.target.closest('[data-cflow-next-confirm]');
    if(next){
      e.preventDefault(); st.page='confirm'; render(); return;
    }
    const back=e.target.closest('[data-cflow-back]');
    if(back){
      e.preventDefault(); st.slot=null; st.page=back.dataset.cflowBack==='service'?'home':'selectDate'; render(); return;
    }
    const month=e.target.closest('[data-cflow-month]');
    if(month){
      e.preventDefault(); const d=D(st.month+'-01'); d.setMonth(d.getMonth()+(month.dataset.cflowMonth==='next'?1:-1)); st.month=iso(d).slice(0,7); render(); return;
    }
  },true);
  _cflowBound=true;
}

render();
