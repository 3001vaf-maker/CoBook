// Fix Journal screen navigation without changing the Journal UI.
// journal-ui-fix.js replaces #app after navigation, which removes the
// original button handlers. Restore only the bottom navigation behavior.
(function(){
  document.addEventListener('click', function(e){
    const button=e.target.closest('.bottom [data-page]');
    if(!button) return;
    if(st.page!=='journal' && st.page!=='journal-month' && st.page!=='journal-list') return;
    e.preventDefault();
    e.stopImmediatePropagation();
    st.page=button.dataset.page;
    window.render();
  }, true);
})();
