(function(){
  const style=document.createElement('style');
  style.textContent='.journal-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:0 0 16px}.journal-tab{border:1px solid #d8d8d4;background:#fff;border-radius:10px;padding:10px 6px;font:inherit;font-weight:600;cursor:pointer}.journal-tab.active{background:#111;color:#fff;border-color:#111}';
  document.head.appendChild(style);
  const originalJournal = window.journal;
  function journalTabs(active){
    return `<div class="journal-tabs" role="tablist">
      <button class="journal-tab ${active==='day'?'active':''}" data-journal-view="day">День</button>
      <button class="journal-tab ${active==='month'?'active':''}" data-journal-view="month">Месяц</button>
      <button class="journal-tab ${active==='list'?'active':''}" data-journal-view="list">Список</button>
    </div>`;
  }
  function dayScreen(){
    return originalJournal().replace('<div class="row"><div><h2>Журнал</h2>', journalTabs('day')+'<div class="row"><div><h2>Журнал</h2>');
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