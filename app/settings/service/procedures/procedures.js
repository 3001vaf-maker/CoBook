(function(){
  window.CoBook=window.CoBook||{};
  CoBook.serviceViews=CoBook.serviceViews||{};
  CoBook.serviceViews.procedures={
    render(state){
      const esc=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;');
      const price=p=>{if(p.priceType==='range'&&p.priceFrom&&p.priceTo)return `${esc(p.priceFrom)}–${esc(p.priceTo)}`;if(p.priceType==='from'&&p.priceFrom)return `от ${esc(p.priceFrom)}`;return p.priceFrom?esc(p.priceFrom):'—'};
      if(!state.procedures.length)return `<div class="service-empty"><b>Процедур пока нет</b><span>Добавьте первую процедуру, чтобы она появилась в списке.</span></div>`;
      return `<section class="procedure-list">${state.procedures.map((p,i)=>`<article class="procedure-card"><button class="procedure-card-main" data-action="edit-procedure" data-index="${i}" type="button"><div class="procedure-card-name">${esc(p.name)}</div><div class="procedure-card-detail"><span>${esc(p.duration||60)} мин</span><span>${price(p)}</span></div></button><button class="procedure-delete" data-action="delete-procedure" data-index="${i}" type="button" aria-label="Удалить процедуру">🗑</button></article>`).join('')}</section><button class="primary full service-add" data-action="open-procedure" type="button">Добавить процедуру</button>`;
    }
  };
})();
