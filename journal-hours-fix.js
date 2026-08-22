(function(){
  const previousRender=window.render;
  window.render=function(){
    const date=st.date;
    const day=wd(date);
    const custom=db.dateHours&&db.dateHours[date];
    const old=db.hours[day];
    if(st.role==='master'&&st.page==='journal'&&custom) db.hours[day]=custom;
    try{previousRender();}finally{if(custom) db.hours[day]=old;}
  };
})();
