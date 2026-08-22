(function(){
  const style=document.createElement('style');
  style.textContent=`
    .journal-month{margin-top:8px}
    .journal-month-head{display:grid;grid-template-columns:44px 1fr 44px;align-items:center;gap:8px;margin:10px 0 14px;text-align:center}
    .journal-month-head b{text-transform:capitalize}
    .journal-month-strip{display:flex;gap:8px;overflow-x:auto;padding:4px 2px 12px;scroll-snap-type:x proximity;-webkit-overflow-scrolling:touch}
    .journal-month-day{flex:0 0 58px;border:1px solid #e1e1de;border-radius:10px;background:#fff;padding:7px 4px;scroll-snap-align:start;text-align:center}
    .journal-month-day .dow{display:block;font-size:10px;color:#777;font-weight:700}
    .journal-month-day .num{display:block;font-size:17px;font-weight:700;margin:3px 0}
    .journal-month-day .square{width:10px;height:10px;border-radius:2px;margin:0 auto;border:1px solid #d5d5d1;background:#f3f3f1}
    .journal-month-day.has-booking .square{background:#78c77d;border-color:#55a95a;box-shadow:inset 0 0 0 2px rgba(255,255,255,.45)}
    .journal-month-day.selected{outline:2px solid #171717;outline-offset:-2px}
    .journal-month-day.other{opacity:.35}
    .journal-month-note{font-size:12px;color:#777;margin:4px 0 14px}
  `;
  document.head.appendChild(style);

  function journalMonthDays(month){
    const [y,m]=month.split('-').map(Number);
    const last=new Date(y,m,0,12).getDate();
    const out=[];
    for(let d=1;d<=last;d++){
      const date=iso(new Date(y,m-1,d,12));
      out.push(date);
    }
    return out;
  }

  function journalMonthScreen(){
    const days=journalMonthDays(st.month);
    const names=['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
    return shell(`
      <div class="journal-tabs"><button class="journal-tab" data-journal-month-tab="day">День</button><button class="journal-tab active">Месяц</button><button class="journal-tab" data-journal-month-tab="list">Список</button></div>
      <div class="journal-month">
        <div class="journal-month-head"><button class="secondary" data-journal-month="prev">‹</button><b>${esc(monthName(st.month))}</b><button class="secondary" data-journal-month="next">›</button></div>
        <div class="journal-month-note">Выберите дату — откроется Журнал → День.</div>
        <div class="journal-month-strip">${days.map(date=>{
          const count=db.bookings.filter(b=>b.date===date&&b.status!=='cancelled').length;
          const selected=date===st.date;
          return `<button class="journal-month-day ${selected?'selected':''} ${count?'has-booking':''}" data-journal-month-date="${date}"><span class="dow">${names[wd(date)]}</span><span class="num">${D(date).getDate()}</span><span class="square" aria-hidden="true"></span></button>`;
        }).join('')}</div>
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
