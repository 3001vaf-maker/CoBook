(function(){
  function trimCalendarGrid(){
    document.querySelectorAll('.calendar-grid').forEach(function(grid){
      const days=Array.from(grid.querySelectorAll('.calendar-day'));
      let lastCurrent=-1;
      days.forEach(function(day,index){
        if(!day.classList.contains('outside')) lastCurrent=index;
      });
      if(lastCurrent<0)return;
      days.slice(lastCurrent+1).forEach(function(day){day.remove()});
    });
  }

  const app=document.getElementById('app');
  if(!app)return;
  new MutationObserver(trimCalendarGrid).observe(app,{childList:true,subtree:true});
  trimCalendarGrid();
})();
