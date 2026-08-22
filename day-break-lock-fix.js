(function(){
  // Перерывы принадлежат только конкретной календарной дате.
  const migrate=()=>{
    if(!Array.isArray(db.breaks)) db.breaks=[];
    const clean=db.breaks.filter(x=>x&&x.date&&x.start&&x.end);
    if(clean.length!==db.breaks.length){db.breaks=clean;save();}
  };
  const breaksFor=date=>db.breaks.filter(x=>x.date===date&&x.start&&x.end);
  const inBreak=(date,start,end)=>breaksFor(date).some(x=>overlap(M(start),M(end),M(x.start),M(x.end)));
  const slotTime=el=>el?.dataset?.free||el?.dataset?.slot||'';
  const paint=()=>{
    migrate();
    if(st.role==='master'&&st.page==='journal'){
      const date=st.date;
      document.querySelectorAll('.journal-slot.break').forEach(x=>x.remove());
      document.querySelectorAll('.journal-slot.free').forEach(el=>{
        const t=slotTime(el); if(!t)return;
        if(breaksFor(date).some(x=>M(t)>=M(x.start)&&M(t)<M(x.end))){
          const d=document.createElement('div');d.className='journal-slot break';d.innerHTML='<b>'+t+'</b><span>Перерыв · запись недоступна</span>';el.replaceWith(d);
        }
      });
    }
    if(st.role==='client'){
      document.querySelectorAll('[data-slot]').forEach(el=>{
        const t=slotTime(el); if(!t)return;
        if(breaksFor(st.date).some(x=>M(t)>=M(x.start)&&M(t)<M(x.end))){
          el.disabled=true;el.classList.add('break-locked');el.textContent=t+' · Перерыв';
        }
      });
    }
  };
  const oldRender=window.render;
  window.render=function(){oldRender();paint()};
  document.addEventListener('click',e=>{
    if(st.role==='master'&&st.page==='journal'){
      const b=e.target.closest('[data-free]');
      if(b&&inBreak(st.date,b.dataset.free,b.dataset.free)){e.preventDefault();e.stopImmediatePropagation();return}
    }
    if(st.role==='client'){
      const b=e.target.closest('[data-slot]');
      if(b&&b.disabled){e.preventDefault();e.stopImmediatePropagation();return}
    }
  },true);
  migrate();
})();