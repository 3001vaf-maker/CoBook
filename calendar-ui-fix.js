(function(){
  const originalMaster=window.master;
  const originalBind=window.bind;

  function intervalFor(date){
    const override=db.workingDates && db.workingDates[date];
    if(override && typeof override==='object' && override.working!==false && override.start && override.end){
      return [override.start,override.end];
    }
    if(override===false)return null;
    if(override===true)return db.hours[wd(date)]||['10:00','20:00'];
    return db.hours[wd(date)]||null;
  }

  function workIsWorking(date){return !!intervalFor(date);}

  function workSlots(date,s){
    const h=intervalFor(date);
    if(!h||!s)return[];
    const start=M(h[0]),end=M(h[1]);
    if(end<=start)return[];
    const out=[];
    for(let t=start;t+s.duration<=end;t+=db.master.step){
      const br=db.breaks.filter(x=>x.day===wd(date)).some(x=>overlap(t,t+s.duration,M(x.start),M(x.end)));
      const busy=db.bookings.some(x=>x.date===date&&x.status!=='cancelled'&&overlap(t,t+s.duration,M(x.start),M(x.end)));
      if(!br&&!busy)out.push(HM(t));
    }
    return out;
  }

  function workMonthCalendar(){
    const days=allMonthDays(st.month),week=['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
    const multi=!!st.workMulti,selected=st.workSelected||[];
    return `<div class="month-head"><button class="secondary" data-month="prev">‹</button><b>${esc(monthName(st.month))}</b><button class="secondary" data-month="next">›</button></div><div class="month-grid">${week.map(x=>`<div class="weekday">${x}</div>`).join('')}${days.map(x=>{const other=x.slice(0,7)!==st.month,working=workIsWorking(x),chosen=multi?selected.includes(x):x===st.date,h=intervalFor(x);return `<button class="month-day ${other?'other':''} ${working?'working':'off'} ${chosen?'selected':''}" data-work-date="${x}" title="${working&&h?`Рабочий интервал ${h[0]}–${h[1]}`:'Выходной'}"><span>${D(x).getDate()}</span><i style="display:none">${working?'●':'—'}</i></button>`}).join('')}</div><div class="calendar-legend"><span><i>●</i> рабочий день</span><span><i>—</i> выходной</span></div>`;
  }

  function selectedWorkDates(){return st.workMulti?(st.workSelected||[]):(st.date?[st.date]:[]);}

  function intervalDefaults(){
    for(const date of selectedWorkDates()){const h=intervalFor(date);if(h)return h;}
    return ['10:00','20:00'];
  }

  function workCalendar(){
    const dates=selectedWorkDates(),h=intervalDefaults(),multi=!!st.workMulti;
    return shell(`<div class="row"><div><h2>График работы</h2><div class="muted">Выберите даты и задайте рабочий интервал.</div></div></div>${workMonthCalendar()}<div class="card"><div class="row"><b>Рабочий интервал для выбранных дат</b><span class="small muted">${dates.length} ${dates.length===1?'дата':'дат'}</span></div><div class="form-row" style="margin-top:10px"><input type="time" data-work-start value="${h[0]}"><input type="time" data-work-end value="${h[1]}"></div><button class="primary full" data-apply-work style="margin-top:10px">Применить к выбранным датам</button><button class="secondary full" data-work-multi style="margin-top:8px">${multi?'Завершить множественный выбор':'Множественный выбор дат'}</button><button class="secondary full" data-work-off style="margin-top:8px">Сделать выбранные даты выходными</button></div>`,nav());
  }

  function workJournal(){
    const date=st.date,h=intervalFor(date);let timeline=[];
    if(h){
      for(let t=M(h[0]);t<M(h[1]);t+=db.master.step){
        const b=db.bookings.find(x=>x.date===date&&x.status!=='cancelled'&&M(x.start)<=t&&M(x.end)>t);
        const breakHere=db.breaks.some(x=>x.day===wd(date)&&t>=M(x.start)&&t<M(x.end));
        if(b&&M(b.start)!==t)continue;
        timeline.push(b?`<button class="journal-slot booked" data-booking="${b.id}"><b>${b.start}–${b.end}</b><span>${esc(b.name||'Клиент')} · ${esc(svc(b.serviceId)?.name||b.serviceName||'')}</span></button>`:breakHere?`<div class="journal-slot break"><b>${HM(t)}</b><span>Перерыв</span></div>`:`<button class="journal-slot free" data-free="${HM(t)}"><b>${HM(t)}</b><span>Свободно · нажмите, чтобы записать</span></button>`);
      }
    }
    return shell(`<div class="row"><div><h2>Журнал</h2><div class="muted">${fmt(date)}</div></div><button class="secondary" data-page="calendar">График работы</button></div><div class="day-switch"><button class="secondary" data-day="prev">‹</button><button class="secondary grow" data-page="calendar">${fmt(date)}</button><button class="secondary" data-day="next">›</button></div>${h?`<div class="notice">Свободный слот можно занять вручную. Запись сразу попадёт в календарь.</div><div class="journal">${timeline.join('')||'<div class="empty">Нет свободного времени</div>'}</div>`:'<div class="empty card">Этот день отмечен как выходной.</div>'}`,nav());
  }

  window.isWorking=workIsWorking;
  window.slots=workSlots;
  window.calendar=workCalendar;
  window.journal=workJournal;

  window.master=function(){
    if(st.page==='journal')return workJournal();
    if(st.page==='calendar'||st.page==='schedule'){
      st.page='calendar';
      return workCalendar();
    }
    if(st.page==='services')return services();
    let base=originalMaster();
    base=base.replace(/<button class="nav" data-page="schedule">◷<br>График<\/button>/g,'');
    base=base.replace(/<button class="service" data-page="schedule">[\s\S]*?<\/button>/g,'');
    return base;
  };

  window.bind=function(){
    originalBind();
    document.querySelectorAll('.bottom button[data-page="schedule"]').forEach(b=>b.remove());
    document.querySelectorAll('[data-work-date]').forEach(b=>b.onclick=function(){
      const date=b.dataset.workDate;
      if(st.workMulti){
        st.workSelected=st.workSelected||[];
        st.workSelected=st.workSelected.includes(date)?st.workSelected.filter(x=>x!==date):st.workSelected.concat(date);
      }else{
        st.date=date;
        st.month=date.slice(0,7);
        st.workSelected=[date];
      }
      render();
    });
    document.querySelector('[data-work-multi]')?.addEventListener('click',function(){
      if(!st.workMulti){
        st.workMulti=true;
        st.workSelected=st.workSelected&&st.workSelected.length?st.workSelected:[st.date];
      }else{
        st.workMulti=false;
        st.workSelected=[st.date];
      }
      render();
    });
    document.querySelector('[data-apply-work]')?.addEventListener('click',function(){
      const dates=selectedWorkDates(),start=document.querySelector('[data-work-start]')?.value,end=document.querySelector('[data-work-end]')?.value;
      if(!dates.length){alert('Сначала выберите даты.');return;}
      if(!start||!end||M(end)<=M(start)){alert('Укажите корректный рабочий интервал.');return;}
      db.workingDates=db.workingDates||{};
      dates.forEach(date=>{db.workingDates[date]={working:true,start,end};});
      save();
      st.workMulti=false;
      st.workSelected=[st.date];
      render();
    });
    document.querySelector('[data-work-off]')?.addEventListener('click',function(){
      const dates=selectedWorkDates();
      if(!dates.length){alert('Сначала выберите даты.');return;}
      db.workingDates=db.workingDates||{};
      dates.forEach(date=>{db.workingDates[date]=false;});
      save();
      st.workMulti=false;
      st.workSelected=[st.date];
      render();
    });
  };

  const style=document.createElement('style');
  style.textContent=`.month-day.selected{outline:2px solid #171717!important;outline-offset:-2px}.month-day.working span{font-weight:800;color:#111}`;
  document.head.appendChild(style);

  if(typeof st!=='undefined'){
    st.workMulti=!!st.workMulti;
    st.workSelected=st.workSelected&&st.workSelected.length?st.workSelected:[st.date];
  }
  render();
})();
