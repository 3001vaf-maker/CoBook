(function(){
  const baseDispatchAction=dispatchAction;
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
})();
