(function(){
  const baseDispatchAction=dispatchAction;

  function applyDayState(day){
    const key=day.dataset.date;
    if(!key)return;
    day.classList.toggle('selected',state.selectedDates.has(key));
    day.classList.toggle('work',!!state.rules[key]);
  }

  function syncVisibleSelection(){
    document.querySelectorAll('.calendar-grid .calendar-day[data-date]').forEach(applyDayState);
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
      if(state.selectedDates.has(key))state.selectedDates.delete(key);
      else state.selectedDates.add(key);
      syncVisibleSelection();
      return render();
    }
    return baseDispatchAction(action,element);
  };

  const app=document.getElementById('app');
  if(app)new MutationObserver(function(){requestAnimationFrame(syncVisibleSelection)}).observe(app,{childList:true,subtree:true});
  syncVisibleSelection();
  requestAnimationFrame(syncVisibleSelection);
})();
