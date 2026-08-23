(function(){
  function updateCalendarUI(){
    const app=document.getElementById('app');
    if(!app)return;

    const calendarTitle=Array.from(app.querySelectorAll('h2')).find(function(title){
      return title.textContent.trim()==='Календарь' || title.textContent.trim()==='График работы';
    });
    if(calendarTitle){
      if(calendarTitle.textContent.trim()!=='График работы'){
        calendarTitle.textContent='График работы';
      }
      const row=calendarTitle.closest('.row');
      if(row){
        const journalButton=row.querySelector('button[data-page="journal"]');
        if(journalButton)journalButton.remove();
      }
    }
  }

  updateCalendarUI();
  const app=document.getElementById('app');
  if(!app)return;
  const observer=new MutationObserver(updateCalendarUI);
  observer.observe(app,{childList:true,subtree:true});
})();
