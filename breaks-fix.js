(function(){
  // Breaks are date-specific. Legacy weekday defaults are removed so a break
  // created for one date cannot appear on any other date.
  if(Array.isArray(db.breaks)){
    const cleaned=db.breaks.filter(x=>x && x.date);
    if(cleaned.length!==db.breaks.length){db.breaks=cleaned;save();}
  }

  const originalSlots=window.slots;
  window.slots=function(date,s){
    const result=originalSlots(date,s);
    return result;
  };

  const originalRender=window.render;
  window.render=function(){
    const date=st.date;
    // app.js expects breaks to have a weekday field. For rendering only,
    // expose only the selected date's explicit breaks.
    const original=db.breaks;
    db.breaks=original.filter(x=>x.date===date).map(x=>({date:x.date,day:wd(date),start:x.start,end:x.end}));
    try{originalRender();}finally{db.breaks=original;}
  };

  // Keep manual booking from ever using a break interval, including after
  // the break is added from the work-time correction dialog.
  document.addEventListener('click',function(e){
    const free=e.target.closest('[data-free]');
    if(!free||st.role!=='master')return;
    const date=st.date,time=free.dataset.free;
    const blocked=db.breaks.filter(x=>x.date===date).some(x=>M(time)<M(x.end)&&M(x.start)<M(time)+db.master.step);
    if(blocked){e.preventDefault();e.stopImmediatePropagation();window.render();}
  },true);
})();
