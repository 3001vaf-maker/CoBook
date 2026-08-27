(function(){
  window.CoBook=window.CoBook||{};
  CoBook.serviceViews=CoBook.serviceViews||{};
  CoBook.serviceViews.products={
    render(state){
      const esc=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;');
      if(!state.products.length)return `<div class="service-empty"><b>Товаров пока нет</b><span>Добавьте первый товар, чтобы он появился в списке.</span></div>`;
      return `<section class="service-list product-list">${state.products.map((p,i)=>{const image=p.image?`<img src="${p.image}" alt="">`:`<span class="product-image-placeholder">▱</span>`;return `<article class="service-row product-card"><button class="service-row-main product-card-main" data-action="edit-product" data-index="${i}" type="button"><span class="product-image">${image}</span><span class="product-card-info"><b>${esc(p.name)}</b><small>${p.price?esc(p.price):'Цена не указана'}</small></span></button><button class="procedure-delete product-delete" data-action="delete-product" data-index="${i}" type="button" aria-label="Удалить товар">🗑</button></article>`}).join('')}</section><button class="primary full service-add" data-action="open-product" type="button">Добавить товар</button>`;
    }
  };
  CoBook.modules.products=CoBook.modules.service;
})();
