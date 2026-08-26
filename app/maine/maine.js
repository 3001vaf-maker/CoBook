/* MAINE owns the Main screen. Child folders are intentionally empty until their entities are rebuilt. */
(function(){
  function render(){
    return shell(`<section class="hero"><div class="eyebrow">КАБИНЕТ МАСТЕРА</div><h1>Главная</h1></section>`);
  }
  function handle(){}
  CoBook.modules.maine={render,handle};
})();
