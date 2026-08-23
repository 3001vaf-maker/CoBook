(function(){
  function updateCalendarUI(){
    const app=document.getElementById('app');
    if(!app)return;

    app.querySelectorAll('h2').forEach(function(title){
      if(title.textContent.trim()!=='Календарь')return;
      title.textContent='График работы';

      const row=title.closest('.row');
      if(!row)return;
      const button=row.querySelector('button[data-page="journal"]');
      if(button)button.remove();
    });

    const navButton=app.querySelector('nav.bottom button[data-page="calendar"]');
    if(navButton){
      const textNode=Array.from(navButton.childNodes).find(function(node){
        return node.nodeType===Node.TEXT_NODE && node.textContent.trim()==='Календарь';
      });
      if(textNode)textNode.textContent='График работы';
    }
  }

  updateCalendarUI();
  const observer=new MutationObserver(updateCalendarUI);
  observer.observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
})();
