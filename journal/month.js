(function(){
  const style=document.createElement('style');
  style.textContent=`
    .journal-month-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px;width:100%;align-items:stretch}
    .journal-month-weekday{min-width:0;text-align:center;font-size:12px;font-weight:700;color:#777;padding:7px 2px}
    .journal-month-weekday.weekend{color:#c33}
    .journal-month-cell{min-width:0!important;width:100%;aspect-ratio:1/1;border:1px solid #e5e5e2;border-radius:12px;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;padding:4px;position:relative;cursor:pointer}
    .journal-month-cell .num{font-size:16px;line-height:1;font-weight:400;color:#777}
    .journal-month-cell .indicator{width:10px;height:10px;border-radius:2px;border:1px solid #d5d5d1;background:#f3f3f1}
    .journal-month-cell.working .num{color:#111;font-weight:800}
    .journal-month-cell.working .indicator{background:#78c77d;border-color:#55a95a}
    .journal-month-cell.has-booking .indicator{background:#43a047;border-color:#2e7d32;box-shadow:inset 0 0 0 2px rgba(255,255,255,.4)}
    .journal-month-cell.weekend .num{color:#c33}
    .journal-month-cell.weekend.working .num{font-weight:800}
    .journal-month-cell.other{opacity:.42}
    .journal-month-cell.selected{outline:2px solid #171717;outline-offset:-2px}
    .journal-month-head{display:grid;grid-template-columns:42px 1fr 42px;align-items:center;text-align:center;gap:8px;margin:12px 0}
    .journal-month-head b{text-transform:capitalize}
  `;
  document.head.appendChild(style);

  function journalMonthScreen(){
    const [y,m]=st.month.split('-').map(Number);
    const first=new Date(y,m-1,1,12);
    const last=new Date(y,m,0,12).getDate();
    const offset=(first.getDay()+6)%7;
    const cells=[];
    for(let i=0;i<offset;i++) cells.push('<div></div>');
    for(let d=1;d<=last;d++){
      const date=iso(new Date(y,m-1,d,12));
      const working=typeof isWorking==='function'&&isWorking(date);
      const hasBooking=db.bookings.some(b=>b.date===date&&b.status!=='cancelled');
      const dow=new Date(y,m-1,d,12).getDay();
      cells.push(`<button class="journal-month-cell ${working?'working':''} ${hasBooking?'has-booking':''} ${dow===0||dow===6?'weekend':''} ${date===st.date?'selected':''}" data-journal-month-date="${date}"><span class="num">${d}</span><span class="indicator" aria-hidden="true"></span></button>`);
    }
    return shell(`
      <div class="journal-tabs"><button class="journal-tab" data-journal-month-tab="day">День</button><button class="journal-tab active">Месяц</button><button class="journal-tab" data-journal-month-tab="list">Список</button></div>
      <div class="journal-month">
        <div class="journal-month-head"><button class="secondary" data-journal-month="prev">‹</button><b>${esc(monthName(st.month))}</b><button class="secondary" data-journal-month="next">›</button></div>
        <div class="journal-month-grid">
          ${['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map((n,i)=>`<div class="journal-month-weekday ${i>4?'weekend':''}">${n}</div>`).join('')}
          ${cells.join('')}
        </div>
      </div>`,nav());
  }

  function bindJournalMonth(){
    document.querySelectorAll('[data-journal-month]').forEach(b=>b.onclick=()=>{
      const d=D(st.month+'-01');
      d.setMonth(d.getMonth()+(b.dataset.journalMonth==='next'?1:-1));
      st.month=iso(d).slice(0,7);window.render();
    });
    document.querySelectorAll('[data-journal-month-date]').forEach(b=>b.onclick=()=>{
      st.date=b.dataset.journalMonthDate;st.month=st.date.slice(0,7);st.page='journal';window.render();
    });
    document.querySelectorAll('[data-journal-month-tab]').forEach(b=>b.onclick=()=>{
      st.page=b.dataset.journalMonthTab==='day'?'journal':'journal-list';window.render();
    });
  }

  document.addEventListener('click',function(e){
    const tab=e.target.closest('[data-jv="calendar"]');
    if(!tab||st.role!=='master'||st.page!=='journal')return;
    e.preventDefault();e.stopImmediatePropagation();
    st.page='journal-month';window.render();
  },true);

  const baseRender=window.render;
  window.render=function(){
    baseRender();
    if(st.role!=='master')return;
    const monthTab=document.querySelector('[data-jv="calendar"]');
    if(monthTab)monthTab.textContent='Месяц';
    if(st.page==='journal-month'){
      document.getElementById('app').innerHTML=journalMonthScreen();
      bindJournalMonth();
    }
  };
})();
