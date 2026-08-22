(function(){
  const oldRender=window.render;
  const esc2=s=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  function tabs(active){return `<div class="journal-tabs"><button class="journal-tab ${active==='day'?'active':''}" data-jv="day">День</button><button class="journal-tab ${active==='month'?'active':''}" data-jv="month">Месяц</button><button class="journal-tab ${active==='list'?'active':''}" data-jv="list">Список</button></div>`}
  function monthLoadPercent(date){
    if(!isWorking(date))return 0;
    const raw=db.workingDates&&db.workingDates[date];
    const h=Array.isArray(raw)?raw:(db.hours[wd(date)]||['10:00','20:00']);
    let total=Math.max(0,M(h[1])-M(h[0]));
    const breaks=(db.breaks||[]).filter(x=>x&&x.date===date&&x.start&&x.end);
    breaks.forEach(x=>{total-=Math.max(0,M(x.end)-M(x.start))});
    if(total<=0)return 0;
    const booked=(db.bookings||[]).filter(b=>b.date===date&&b.status!=='cancelled').reduce((sum,b)=>sum+Math.max(0,M(b.end)-M(b.start)),0);
    return Math.max(0,Math.min(100,Math.round(booked/total*100)));
  }
  function monthTab(){
    const days=allMonthDays(st.month),week=['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
    const cells=days.map(x=>{
      const other=x.slice(0,7)!==st.month;
      const working=isWorking(x);
      const count=db.bookings.filter(b=>b.date===x&&b.status!=='cancelled').length;
      const load=monthLoadPercent(x);
      const dow=wd(x);
      return `<button class="journal-month-cell ${other?'other':''} ${working?'working':'off'} ${dow===0||dow===6?'weekend':''} ${x===st.date?'selected':''}" data-month-date="${x}" style="--fill:${load}%"><span class="num">${D(x).getDate()}</span><span class="indicator" title="Загрузка ${load}%"></span>${count?`<em>${count}</em>`:''}</button>`;
    }).join('');
    return shell(`${tabs('month')}<style>
      .journal-month-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px;width:100%;align-items:stretch}
      .journal-month-weekday{min-width:0;text-align:center;font-size:12px;font-weight:700;color:#777;padding:7px 2px}
      .journal-month-weekday.weekend{color:#c62828}
      .journal-month-cell{min-width:0!important;width:100%;aspect-ratio:1/1;border:1px solid #e5e5e2!important;border-radius:12px!important;background:#fff!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:3px!important;padding:4px!important;position:relative;cursor:pointer}
      .journal-month-cell .num{font-size:16px;line-height:1;font-weight:400;color:#777}
      .journal-month-cell.working .num{font-weight:800;color:#111}
      .journal-month-cell.off .num{font-weight:400;color:#777}
      .journal-month-cell.weekend .num{color:#c62828}
      .journal-month-cell.other{opacity:.42}
      .journal-month-cell.selected{outline:2px solid #171717;outline-offset:-2px}
      .journal-month-cell .indicator{width:10px;height:10px;border-radius:2px;border:1px solid #d5d5d1;background:#f3f3f1;overflow:hidden;position:relative}
      .journal-month-cell .indicator:after{content:"";position:absolute;left:0;bottom:0;width:100%;height:var(--fill,0%);background:#63b66a;border-radius:1px}
      .journal-month-cell em{position:absolute;right:5px;top:4px;font-size:9px;font-style:normal;color:#777}
      .journal-month-head{display:grid;grid-template-columns:42px 1fr 42px;align-items:center;text-align:center;gap:8px;margin:12px 0}
    </style><div class="journal-month-head"><button class="secondary" data-month-nav="prev">‹</button><b>${esc2(monthName(st.month))}</b><button class="secondary" data-month-nav="next">›</button></div><div class="journal-month-grid">${week.map((x,i)=>`<div class="journal-month-weekday ${i>4?'weekend':''}">${x}</div>`).join('')}${cells}</div>`,nav());
  }
  function day(){const date=st.date,h=db.hours[wd(date)]||['10:00','20:00'],start=M(h[0]),end=M(h[1]),dayBreaks=(db.breaks||[]).filter(x=>x&&x.date===date).map(x=>({start:M(x.start),end:M(x.end)}));let rows='';for(let t=start;t<end;t+=30){const br=dayBreaks.find(x=>x.start<=t&&x.end>t);const b=!br&&db.bookings.find(x=>x.date===date&&x.status!=='cancelled'&&M(x.start)<=t&&M(x.end)>t);if(b&&M(b.start)!==t)continue;rows+=`<div class="day-sheet-row"><div class="day-time">${HM(t)}</div><div class="day-line">${br?`<div class="day-break" style="height:24px;min-height:24px;background:rgba(120,120,120,.22);border-radius:6px;padding:3px 8px;box-sizing:border-box;color:#666;font-size:12px;display:flex;align-items:center">Перерыв ${HM(br.start)}–${HM(br.end)}</div>`:b?`<div class="day-booking ${M(b.end)-M(b.start)>60?'multi':''}" style="height:${Math.max(24,Math.ceil((M(b.end)-M(b.start))/30)*30-6)}px"><b>${esc2(b.name||'Без клиента')} · ${b.start}–${b.end}</b><span>${esc2(b.serviceName||'Услуга')}</span></div>`:`<button class="day-free" data-open-master-booking="${HM(t)}"></button>`}</div></div>`}return shell(`${tabs('day')}<div class="journal-date-switch"><button class="secondary" data-jd="prev">‹</button><div class="date-label">${fmt(date)}</div><button class="secondary" data-jd="next">›</button></div>${isWorking(date)?`<div class="day-sheet">${rows}</div>`:'<button class="day-off-panel" id="open-working-day"><b>Выходной день</b><span>Нажмите, чтобы указать начало и завершение рабочего дня</span></button>'}`,nav())}
  function listTab(){const bs=db.bookings.filter(x=>x.status!=='cancelled').sort((a,b)=>(a.date+a.start).localeCompare(b.date+b.start));return shell(`${tabs('list')}<div class="hero"><h2>Список записей</h2></div>${bs.map(b=>`<div class="card"><div class="row"><div><b>${esc2(b.name||'Без клиента')}</b><div class="small muted">${fmt(b.date)} · ${b.start}–${b.end}</div><div class="small muted">${esc2(b.serviceName||'Услуга')}</div></div><span class="badge green">Запись</span></div></div>`).join('')||'<div class="empty card">Записей пока нет.</div>'}`,nav())}
  function booking(startTime){const root=document.createElement('div');root.id='master-booking-modal';root.innerHTML=`<div class="booking-modal-backdrop"><section class="booking-modal"><h3>1. Время начала</h3><p class="muted">Проверьте время. Можно изменить только начало.</p><label>Начало<input id="mb-start" type="time" value="${startTime}"></label><div class="modal-actions"><button class="secondary" id="mb-cancel">Отмена</button><button class="primary" id="mb-next">Далее</button></div></section></div>`;document.body.appendChild(root);const close=()=>root.remove();root.querySelector('#mb-cancel').onclick=close;root.querySelector('#mb-next').onclick=()=>services(root,root.querySelector('#mb-start').value,close)}
  function services(root,startTime,close){root.querySelector('.booking-modal').innerHTML=`<h3>2. Услуги</h3><p class="muted">Выберите одну или несколько услуг. Длительность можно изменить.</p>${db.services.filter(s=>s.active).map((s,i)=>`<label class="booking-service"><input type="checkbox" data-ms="${i}"><div class="booking-service-name"><b>${esc2(s.name)}</b><span>По прайсу: ${s.duration} мин · ${money(s.price)}</span></div><input type="number" min="15" step="15" value="${s.duration}" data-md="${i}"></label>`).join('')}<div class="modal-actions"><button class="secondary" id="mb-back">Назад</button><button class="primary" id="mb-next2">Далее</button></div>`;root.querySelector('#mb-back').onclick=()=>booking(startTime);root.querySelector('#mb-next2').onclick=()=>{const selected=[...root.querySelectorAll('[data-ms]')].filter(x=>x.checked).map(x=>{const s=db.services.filter(z=>z.active)[Number(x.dataset.ms)];return {...s,duration:Number(root.querySelector(`[data-md="${x.dataset.ms}"]`).value)||s.duration}});if(!selected.length)return alert('Выберите хотя бы одну услугу.');confirmBooking(root,startTime,selected,close)}}
  function confirmBooking(root,startTime,selected,close){const total=selected.reduce((a,s)=>a+s.duration,0),end=M(startTime)+total,h=db.hours[wd(st.date)]||['10:00','20:00'],bad=end>M(h[1]);root.querySelector('.booking-modal').innerHTML=`<h3>3. Подтвердить запись</h3><div class="booking-summary"><div class="row"><span>Дата</span><b>${fmt(st.date)}</b></div><div class="row"><span>Время</span><b>${startTime}–${HM(end)}</b></div><div class="row"><span>Длительность</span><b>${HM(total)}</b></div></div>${selected.map(s=>`<div class="row"><span>${esc2(s.name)}</span><b>${s.duration} мин</b></div>`).join('')}${bad?'<div class="notice">Запись не помещается до конца рабочего дня.</div>':''}<div class="modal-actions"><button class="secondary" id="mb-back3">Назад</button><button class="primary" id="mb-save" ${bad?'disabled':''}>Подтвердить</button></div>`;root.querySelector('#mb-back3').onclick=()=>services(root,startTime,close);root.querySelector('#mb-save').onclick=()=>{db.bookings.push({id:'b'+Date.now(),date:st.date,start:startTime,end:HM(end),serviceId:selected[0].id,serviceName:selected.map(s=>s.name).join(' + '),services:selected.map(s=>({id:s.id,name:s.name,duration:s.duration,price:s.price})),duration:total,price:selected.reduce((a,s)=>a+s.price,0),name:'Без клиента',status:'confirmed'});save();close();window.render()}}
  window.render=function(){oldRender();if(st.role!=='master')return;if(st.page==='journal')document.getElementById('app').innerHTML=day();if(st.page==='journal-month')document.getElementById('app').innerHTML=monthTab();if(st.page==='journal-list')document.getElementById('app').innerHTML=listTab();document.querySelectorAll('[data-jv]').forEach(b=>b.onclick=()=>{st.page=b.dataset.jv==='day'?'journal':b.dataset.jv==='month'?'journal-month':'journal-list';window.render()});document.querySelectorAll('[data-jd]').forEach(b=>b.onclick=()=>{st.date=addDays(st.date,b.dataset.jd==='next'?1:-1);window.render()});document.querySelectorAll('[data-open-master-booking]').forEach(b=>b.onclick=()=>booking(b.dataset.openMasterBooking));document.querySelectorAll('[data-month-nav]').forEach(b=>b.onclick=()=>{const d=D(st.month+'-01');d.setMonth(d.getMonth()+(b.dataset.monthNav==='next'?1:-1));st.month=iso(d).slice(0,7);window.render()});document.querySelectorAll('[data-month-date]').forEach(b=>b.onclick=()=>{st.date=b.dataset.monthDate;st.month=st.date.slice(0,7);st.page='journal';window.render()});document.querySelectorAll('[data-toggle-date]').forEach(b=>b.onclick=()=>{db.workingDates[st.date]=!isWorking(st.date);save();window.render()})};
})();

/* Approved Journal Day extension: configure a working range only when the selected day is a day off. */
(function(){
  const previousRender=window.render;
  function workingDayModal(){
    const date=st.date;
    const root=document.createElement('div');
    root.id='working-day-modal';
    root.innerHTML=`<div class="booking-modal-backdrop"><section class="booking-modal"><h3>Начало рабочего дня</h3><label>Начало<input id="wd-start" type="time" value="10:00"></label><label>Завершение рабочего дня<input id="wd-end" type="time" value="20:00"></label><div class="modal-actions"><button class="secondary" id="wd-cancel">Отмена</button><button class="primary" id="wd-save">Сохранить</button></div></section></div>`;
    document.body.appendChild(root);
    const close=()=>root.remove();
    root.querySelector('#wd-cancel').onclick=close;
    root.querySelector('#wd-save').onclick=()=>{
      const start=root.querySelector('#wd-start').value;
      const end=root.querySelector('#wd-end').value;
      if(!start||!end||M(end)<=M(start)){alert('Время завершения должно быть позже начала.');return;}
      db.workingDates[date]=true;
      db.dateHours=db.dateHours||{};
      db.dateHours[date]=[start,end];
      save();
      close();
      window.render();
    };
  }
  window.render=function(){
    previousRender();
    if(st.role!=='master'||st.page!=='journal'||isWorking(st.date))return;
    const panel=document.getElementById('open-working-day');
    if(panel)panel.onclick=workingDayModal;
  };
})();