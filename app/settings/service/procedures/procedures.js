(function(){
  window.CoBook=window.CoBook||{};
  CoBook.serviceViews=CoBook.serviceViews||{};
  CoBook.serviceViews.procedures={
    render(state){
      const esc=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;');
      const workplaces=(()=>{try{const p=JSON.parse(localStorage.getItem('cobook_profile')||'{}');return Array.isArray(p.workplaces)?p.workplaces.map((w,i)=>({...w,id:w.id||`workplace-${i}`,name:w.name||`Место работы ${i+1}`})):[]}catch(e){return []}})();
      const workplaceName=id=>workplaces.find(w=>w.id===id)?.name||'';
      const price=p=>{if(p.priceType==='range'&&p.priceFrom&&p.priceTo)return `${esc(p.priceFrom)}–${esc(p.priceTo)}`;if(p.priceType==='from'&&p.priceFrom)return `от ${esc(p.priceFrom)}`;return p.priceFrom?esc(p.priceFrom):'—'};
      const variants=p=>Array.isArray(p.prices)&&p.prices.length?p.prices:[{workplaceId:p.workplaceId||'',priceType:p.priceType||'exact',priceFrom:p.priceFrom??p.price??'',priceTo:p.priceTo??''}];
      const summary=p=>variants(p).map(v=>`<span class="procedure-location-price"><span class="procedure-location">${esc(workplaceName(v.workplaceId)||'Без места')}</span><b>${price(v)}</b></span>`).join('');
      if(!state.procedures.length)return `<div class="service-empty"><b>Процедур пока нет</b><span>Добавьте первую процедуру, чтобы она появилась в списке.</span></div>`;
      return `<section class="service-list">${state.procedures.map((p,i)=>`<div class="service-row" data-action="edit-procedure" data-index="${i}" role="button" tabindex="0"><div><div class="service-name">${esc(p.name)}</div><div class="service-meta">${esc(p.duration||60)} мин</div></div><div class="service-price">${summary(p)}</div><button class="procedure-delete" data-action="delete-procedure" data-index="${i}" type="button" aria-label="Удалить процедуру">🗑</button></div>`).join('')}</section><button class="primary full service-add" data-action="open-procedure" type="button">Добавить процедуру</button>`;
    }
  };
})();
