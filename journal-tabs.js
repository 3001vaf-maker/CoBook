(function(){
  const style=document.createElement('style');
  style.textContent=`
    .journal-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:0 0 16px}
    .journal-tab{border:1px solid #d8d8d4;background:#fff;border-radius:10px;padding:10px 6px;font:inherit;font-weight:600;cursor:pointer}
    .journal-tab.active{background:#111;color:#fff;border-color:#111}
    .day-sheet{position:relative;border:1px solid #e2e2df;border-radius:8px;background:#fff;overflow:hidden;box-shadow:0 1px 2px rgba(0,0,0,.03)}
    .day-sheet-row{position:relative;display:grid;grid-template-columns:58px 1fr;min-height:30px;border-bottom:1px solid #dfe5df}
    .day-sheet-row:last-child{border-bottom:0}
    .day-time{font-size:11px;color:#777;text-align:right;padding:7px 8px 0 0;background:#fafaf8;border-right:1px solid #e1e1de}
    .day-line{position:relative;min-height:30px;background:repeating-linear-gradient(to bottom,#fff 0,#fff 29px,#dfe5df 29px,#dfe5df 30px)}
    .day-booking{position:absolute;left:4px;right:4px;top:3px;z-index:2;border:1px solid rgba(46,125,50,.28);border-radius:6px;background:rgba(76,175,80,.28);padding:5px 7px;text-align:left;overflow:hidden;min-height:24px;cursor:pointer}
    .day-booking b{display:block;font-size:12px;line-height:1.2}
    .day-booking span{display:block;font-size:11px;color:#245528;line-height:1.25;margin-top:2px}
    .day-booking.multi{background:rgba(64,150,191,.28);border-color:rgba(35,110,150,.3)}
    .day-booking.multi span{color:#20536b}
    .day-free{width:100%;height:30px;border:0;background:transparent;cursor:pointer;padding:0;margin:0;text-align:left}
    .day-free:hover{background:rgba(76,175,80,.08)}
    .journal-date-switch{display:grid;grid-template-columns:44px 1fr 44px;gap:8px;align-items:center;margin:0 0 14px}
    .journal-date-switch .date-label{text-align:center;font-weight:600}
    .booking-modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.38);z-index:1000;display:flex;align-items:flex-end;justify-content:center;padding:12px}
    .booking-modal{width:min(520px,100%);max-height:92vh;overflow:auto;background:#fff;border-radius:18px;padding:18px;box-shadow:0 12px 40px rgba(0,0,0,.22)}
    .booking-modal h3{margin:0 0 14px}
    .booking-modal .modal-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:16px}
    .booking-modal .modal-actions.one{grid-template-columns:1fr}
    .booking-modal .form-row{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .booking-modal input[type=time],.booking-modal input[type=text],.booking-modal input[type=number]{width:100%;box-sizing:border-box;padding:11px;border:1px solid #d8d8d4;border-radius:10px;font:inherit}
    .booking-service{display:grid;grid-template-columns:28px 1fr 92px;gap:8px;align-items:center;padding:11px 0;border-bottom:1px solid #eee}
    .booking-service input[type=number]{padding:8px;text-align:center}
    .booking-service-name b{display:block}.booking-service-name span{font-size:12px;color:#777}
    .booking-summary{background:#f7f7f4;border-radius:12px;padding:12px;margin-top:10px}
    .booking-summary .row{display:flex;justify-content:space-between;gap:10px;margin:5px 0}
  `;
  document.head.appendChild(style);

  let modal=null;

  function journalTabs(active){
    return `<div class="journal-tabs" role="tablist">
      <button class="journal-tab ${active==='day'?'active':''}" data-journal-view="day">День</button>
      <button class="journal-tab ${active==='calendar'?'active':''}" data-journal-view="calendar">Календарь</button>
      <button class="journal-tab ${active==='list'?'active':''}" data-journal-view="list">Список</button>
    </div>`;
  }

  function buildDaySheet(date){
    const h=db.hours[wd(date)]||['10:00','20:00'];
    const start=M(h[0]), end=M(h[1]);
    const rows=[];
    for(let t=start;t<end;t+=30) rows.push(t);
    const bookings=db.bookings.filter(b=>b.date===date&&b.status!=='cancelled');
    return `<div class="day-sheet">${rows.map(t=>{
      const b=bookings.find(x=>M(x.start)===t);
      const duration=b?M(b.end)-M(b.start):0;
      const span=Math.max(1,Math.ceil(duration/30));
      const names=b?(b.services||[]).map(x=>x.name).join(' + ')||svc(b.serviceId)?.name||b.serviceName||'Услуга':'';
      return `<div class="day-sheet-row"><div class="day-time">${HM(t)}</div><div class="day-line">${b?`<button class="day-booking ${duration>60?'multi':''}" style="height:${span*30-6}px" data-booking="${b.id}"><b>${esc(b.name||'Клиент')} · ${b.start}–${b.end}</b><span>${esc(names)}</span></button>`:`<button class="day-free" data-free-slot="${HM(t)}" aria-label="Записать на ${HM(t)}"></button>`}</div></div>`;
    }).join('')}</div>`;
  }

  function dayScreen(){
    const date=st.date;
    return shell(`${journalTabs('day')}
      <div class="journal-date-switch">
        <button class="secondary" data-journal-day="prev">‹</button>
        <div class="date-label">${fmt(date)}</div>
        <button class="secondary" data-journal-day="next">›</button>
      </div>
      ${isWorking(date)?buildDaySheet(date):'<div class="empty card">Этот день отмечен как выходной.</div>'}`,nav());
  }

  function simpleScreen(type){
    const title=type==='calendar'?'Календарь':'Список';
    return shell(journalTabs(type)+`<div class="hero"><h2>${title}</h2><p class="muted">Экран подготовлен. Содержимое добавим следующим этапом.</p></div>`, nav());
  }

  function selectedTotal(){
    return modal.services.filter(s=>s.checked).reduce((sum,s)=>sum+Number(s.duration||0),0);
  }

  function renderModal(){
    if(!modal)return;
    const root=document.getElementById('cobook-booking-modal');
    if(!root)return;
    const total=selectedTotal();
    const start=M(modal.start);
    if(modal.step===1){
      root.innerHTML=`<div class="booking-modal-backdrop"><section class="booking-modal">
        <h3>1. Уточнить время</h3>
        <div class="muted small" style="margin-bottom:12px">Вы нажали на ${esc(modal.original)}. Проверьте или измените время.</div>
        <div class="form-row"><label>Начало<input id="book-start" type="time" value="${modal.start}"></label><label>Окончание<input id="book-end" type="time" value="${modal.end}"></label></div>
        <div class="modal-actions"><button class="secondary" id="book-cancel">Отмена</button><button class="primary" id="book-next-time">Далее</button></div>
      </section></div>`;
      document.getElementById('book-cancel').onclick=closeModal;
      document.getElementById('book-next-time').onclick=()=>{modal.start=document.getElementById('book-start').value;modal.end=document.getElementById('book-end').value;if(!modal.start||!modal.end||M(modal.end)<=M(modal.start)){alert('Укажите корректный интервал времени.');return}modal.step=2;renderModal()};
      return;
    }
    if(modal.step===2){
      root.innerHTML=`<div class="booking-modal-backdrop"><section class="booking-modal">
        <h3>2. Выберите услуги</h3>
        <div class="small muted" style="margin-bottom:8px">Можно выбрать несколько услуг. Длительность каждой можно изменить.</div>
        ${modal.services.map((s,i)=>`<label class="booking-service"><input type="checkbox" data-service-check="${i}" ${s.checked?'checked':''}><div class="booking-service-name"><b>${esc(s.name)}</b><span>По прайсу: ${s.baseDuration} мин · ${money(s.price)}</span></div><input type="number" min="15" step="15" data-service-duration="${i}" value="${s.duration}" aria-label="Длительность"></label>`).join('')}
        <div class="booking-summary"><div class="row"><span>Выбрано</span><b>${modal.services.filter(s=>s.checked).length}</b></div><div class="row"><span>Общая длительность</span><b>${total} мин (${HM(total)})</b></div></div>
        <div class="modal-actions"><button class="secondary" id="book-back-time">Назад</button><button class="primary" id="book-next-services">Далее</button></div>
      </section></div>`;
      document.querySelectorAll('[data-service-check]').forEach(el=>el.onchange=()=>{modal.services[Number(el.dataset.serviceCheck)].checked=el.checked;renderModal()});
      document.querySelectorAll('[data-service-duration]').forEach(el=>el.onchange=()=>{const i=Number(el.dataset.serviceDuration);modal.services[i].duration=Math.max(15,Number(el.value)||15);renderModal()});
      document.getElementById('book-back-time').onclick=()=>{modal.step=1;renderModal()};
      document.getElementById('book-next-services').onclick=()=>{if(!selectedTotal()){alert('Выберите хотя бы одну услугу.');return}modal.step=3;renderModal()};
      return;
    }
    const services=modal.services.filter(s=>s.checked);
    const end=start+total;
    const h=db.hours[wd(st.date)]||['10:00','20:00'];
    const within=end<=M(h[1]);
    const hasBreak=db.breaks.some(x=>x.day===wd(st.date)&&overlap(start,end,M(x.start),M(x.end)));
    const busy=db.bookings.some(x=>x.date===st.date&&x.status!=='cancelled'&&overlap(start,end,M(x.start),M(x.end)));
    const price=services.reduce((sum,s)=>sum+Number(s.price||0),0);
    root.innerHTML=`<div class="booking-modal-backdrop"><section class="booking-modal">
      <h3>3. Подтвердить запись</h3>
      <div class="booking-summary"><div class="row"><span>Дата</span><b>${fmt(st.date)}</b></div><div class="row"><span>Время</span><b>${modal.start}–${HM(end)}</b></div><div class="row"><span>Длительность</span><b>${HM(total)}</b></div><div class="row"><span>Стоимость</span><b>${money(price)}</b></div></div>
      <h4>Услуги</h4>${services.map(s=>`<div class="row"><span>${esc(s.name)} · ${s.duration} мин</span><span>${money(s.price)}</span></div>`).join('')}
      <label style="display:block;margin-top:12px">Клиент (необязательно)<input id="book-name" type="text" placeholder="Без клиента"></label>
      ${!within?'<div class="notice" style="margin-top:10px">Услуги не помещаются до конца рабочего дня.</div>':''}
      ${hasBreak?'<div class="notice" style="margin-top:10px">Выбранное время пересекает перерыв.</div>':''}
      ${busy?'<div class="notice" style="margin-top:10px">Выбранное время уже занято.</div>':''}
      <div class="modal-actions"><button class="secondary" id="book-back-services">Назад</button><button class="primary" id="book-confirm" ${(!within||hasBreak||busy)?'disabled':''}>Подтвердить</button></div>
    </section></div>`;
    document.getElementById('book-back-services').onclick=()=>{modal.step=2;renderModal()};
    document.getElementById('book-confirm').onclick=()=>{
      const name=(document.getElementById('book-name').value||'').trim()||'Без клиента';
      db.bookings.push({id:'b'+Date.now(),date:st.date,start:modal.start,end:HM(end),serviceId:services[0].id,serviceName:services.map(s=>s.name).join(' + '),services:services.map(s=>({id:s.id,name:s.name,duration:s.duration,price:s.price})),price,duration:total,name,status:'confirmed'});
      save();closeModal();window.render();
    };
  }

  function openModal(original){
    const h=db.hours[wd(st.date)]||['10:00','20:00'];
    const start=M(original);
    modal={step:1,original,start:HM(start),end:HM(Math.min(start+60,M(h[1]))),services:db.services.filter(s=>s.active).map(s=>({id:s.id,name:s.name,baseDuration:s.duration,duration:s.duration,price:s.price,checked:false}))};
    if(!document.getElementById('cobook-booking-modal')){const el=document.createElement('div');el.id='cobook-booking-modal';document.body.appendChild(el)}
    renderModal();
  }

  function closeModal(){modal=null;const el=document.getElementById('cobook-booking-modal');if(el)el.innerHTML=''}

  window.__cobookJournalTabs=function(){
    document.querySelectorAll('[data-journal-view]').forEach(btn=>btn.onclick=()=>{
      const view=btn.dataset.journalView;
      if(view==='day'){st.page='journal';window.render();return}
      if(view==='calendar'){st.page='calendar';window.render();return}
      st.page='journal-list';window.render();
    });
    document.querySelectorAll('[data-journal-day]').forEach(btn=>btn.onclick=()=>{st.date=addDays(st.date,btn.dataset.journalDay==='next'?1:-1);window.render()});
    document.querySelectorAll('[data-free-slot]').forEach(btn=>btn.onclick=()=>openModal(btn.dataset.freeSlot));
    document.querySelectorAll('[data-free]').forEach(btn=>btn.onclick=()=>openModal(btn.dataset.free));
    const notice=document.querySelector('.journal')?.previousElementSibling;
    if(notice&&notice.classList.contains('notice'))notice.remove();
  };

  const oldRender=window.render;
  window.render=function(){
    if(modal)closeModal();
    oldRender();
    if(st.role==='master'&&(st.page==='journal'||st.page==='journal-list')){
      if(st.page==='journal-list')document.getElementById('app').innerHTML=simpleScreen('list');
      window.__cobookJournalTabs();
    }
  };
})();