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
    .day-booking{position:absolute;left:4px;right:4px;top:3px;z-index:2;border:1px solid rgba(46,125,50,.28);border-radius:6px;background:rgba(76,175,80,.28);padding:5px 7px;text-align:left;overflow:hidden;min-height:24px}
    .day-booking b{display:block;font-size:12px;line-height:1.2}
    .day-booking span{display:block;font-size:11px;color:#245528;line-height:1.25;margin-top:2px}
    .day-booking.multi{background:rgba(64,150,191,.28);border-color:rgba(35,110,150,.3)}
    .day-booking.multi span{color:#20536b}
  `;
  document.head.appendChild(style);
  const originalJournal = window.journal;
  function journalTabs(active){
    return `<div class="journal-tabs" role="tablist">
      <button class="journal-tab ${active==='day'?'active':''}" data-journal-view="day">День</button>
      <button class="journal-tab ${active==='month'?'active':''}" data-journal-view="month">Месяц</button>
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
      const s=b&&svc(b.serviceId);
      return `<div class="day-sheet-row"><div class="day-time">${HM(t)}</div><div class="day-line">${b?`<button class="day-booking ${duration>60?'multi':''}" style="height:${span*30-6}px" data-booking="${b.id}"><b>${esc(b.name||'Клиент')} · ${b.start}–${b.end}</b><span>${esc(s?.name||b.serviceName||'Услуга')}</span></button>`:''}</div></div>`;
    }).join('')}</div>`;
  }
  function dayScreen(){
    const date=st.date;
    const body=originalJournal();
    const start=body.indexOf('<div class="row"><div><h2>Журнал</h2>');
    const end=body.indexOf('</div>',body.indexOf('data-day="next"'));
    const header=`${journalTabs('day')}<div class="row"><div><h2>Журнал</h2><div class="muted">${fmt(date)}</div></div></div>`;
    return body.slice(0,start)+header+`<div class="notice">1 полоска = 30 минут. Занятое время показано прозрачным цветом.</div>${isWorking(date)?buildDaySheet(date):'<div class="empty card">Этот день отмечен как выходной.</div>'}`+body.slice(end+6);
  }
  function simpleScreen(type){
    const title=type==='month'?'Месяц':'Список';
    return shell(journalTabs(type)+`<div class="hero"><h2>${title}</h2><p class="muted">Экран подготовлен. Содержимое добавим следующим этапом.</p></div>`, nav());
  }
  window.journal=function(){return dayScreen()};
  window.__cobookJournalTabs=function(){
    document.querySelectorAll('[data-journal-view]').forEach(btn=>btn.onclick=()=>{
      const view=btn.dataset.journalView;
      if(view==='day'){st.page='journal';window.render();return;}
      st.page=view==='month'?'journal-month':'journal-list';window.render();
    });
  };
  const oldRender=window.render;
  window.render=function(){
    oldRender();
    if(st.role==='master'&&(st.page==='journal'||st.page==='journal-month'||st.page==='journal-list')){
      if(st.page==='journal-month')document.getElementById('app').innerHTML=simpleScreen('month');
      if(st.page==='journal-list')document.getElementById('app').innerHTML=simpleScreen('list');
      window.__cobookJournalTabs();
    }
  };
})();