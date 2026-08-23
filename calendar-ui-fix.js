(function(){
  function updateCalendarUI(){
    const app=document.getElementById('app');
    if(!app)return;

    const calendarTitle=Array.from(app.querySelectorAll('h2')).find(function(title){
      return title.textContent.trim()==='Календарь' || title.textContent.trim()==='График работы';
    });
    if(calendarTitle){
      calendarTitle.textContent='График работы';
      const row=calendarTitle.closest('.row');
      if(row){
        const journalButton=row.querySelector('button[data-page="journal"]');
        if(journalButton)journalButton.remove();
      }
    }

    const navButton=app.querySelector('nav.bottom button[data-page="calendar"]');
    if(navButton){
      const textNode=Array.from(navButton.childNodes).find(function(node){
        return node.nodeType===Node.TEXT_NODE && (node.textContent.trim()==='Календарь' || node.textContent.trim()==='График работы');
      });
      if(textNode)textNode.textContent='График работы';
    }
  }

  updateCalendarUI();
  const observer=new MutationObserver(updateCalendarUI);
  observer.observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
})();
