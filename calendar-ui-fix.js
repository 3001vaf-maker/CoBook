(function(){
  function removeCalendarJournalButton(){
    const app=document.getElementById('app');
    if(!app)return;
    app.querySelectorAll('h2').forEach(function(title){
      if(title.textContent.trim()!=='Календарь')return;
      const row=title.closest('.row');
      if(!row)return;
      const button=row.querySelector('button[data-page="journal"]');
      if(button)button.remove();
    });
  }

  removeCalendarJournalButton();
  const observer=new MutationObserver(removeCalendarJournalButton);
  observer.observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
})();
