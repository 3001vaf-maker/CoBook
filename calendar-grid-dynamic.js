(function(){
  function trimCalendarGrid(){
    document.querySelectorAll('.calendar-grid').forEach(function(grid){
      const days=Array.from(grid.querySelectorAll('.calendar-day'));
      let lastCurrent=-1;
      days.forEach(function(day,index){
        if(!day.classList.contains('outside')) lastCurrent=index;
      });
      if(lastCurrent<0)return;

      // Keep the leading days from the previous month and the trailing days
      // of the next month only through Sunday, so the visible grid is dynamic.
      let lastVisible=lastCurrent;
      for(let i=lastCurrent+1;i<days.length;i++){
        if(i%7===6){
          lastVisible=i;
          break;
        }
      }
      days.slice(lastVisible+1).forEach(function(day){day.remove()});
    });
  }

  const app=document.getElementById('app');
  if(!app)return;
  new MutationObserver(trimCalendarGrid).observe(app,{childList:true,subtree:true});
  trimCalendarGrid();
})();
