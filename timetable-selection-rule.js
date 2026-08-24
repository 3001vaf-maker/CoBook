(function(){
  const baseDispatchAction=dispatchAction;

  function syncVisibleSelection(){
    document.querySelectorAll('.calendar-day[data-date]').forEach(function(day){
      const key=day.dataset.date;
      const selected=state.selectedDates.has(key);
      const working=!!state.rules[key];
      day.classList.toggle('selected',selected);
      day.classList.toggle('work',working);
    });
  }

  dispatchAction=function(action,element){
    if(action==='calendar-date'){
      const key=element.dataset.date;
      const first=[...state.selectedDates][0];
      if(first){
        const firstIsWorking=!!state.rules[first];
        const clickedIsWorking=!!state.rules[key];
        if(clickedIsWorking!==firstIsWorking)return;
      }
      if(state.selectedDates.has(key)) state.selectedDates.delete(key);
      else state.selectedDates.add(key);
      return render();
    }
    return baseDispatchAction(action,element);
  };

  const app=document.getElementById('app');
  if(app)new MutationObserver(syncVisibleSelection).observe(app,{childList:true,subtree:true});
  syncVisibleSelection();
})();
