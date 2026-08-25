/* CoBook entry point: startup only. All screen logic belongs to app/ MODULEs. */
(function(){
  if(!window.CoBook||!window.CoBook.modules)throw new Error('CoBook core is not loaded');
  window.CoBook.start=window.CoBook.start||function(){window.state.page='maine';window.render()};
  window.CoBook.start();
})();
