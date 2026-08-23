// Fix Journal screen navigation without changing the Journal UI.
// journal-ui-fix.js replaces #app after navigation, which removes the
// original button handlers. Restore only the bottom navigation behavior.
(function(){
  const addBottomItems=()=>{
    const bottom=document.querySelector('.bottom');
    if(!bottom) return;
    if(!bottom.querySelector('[data-bottom-extra="management"]')){
      const button=document.createElement('button');
      button.className='nav';
      button.dataset.bottomExtra='management';
      button.type='button';
      button.innerHTML='⚙<br>Управления';
      bottom.appendChild(button);
    }
    if(!bottom.querySelector('[data-bottom-extra="chat"]')){
      const button=document.createElement('button');
      button.className='nav';
      button.dataset.bottomExtra='chat';
      button.type='button';
      button.innerHTML='💬<br>Чат';
      bottom.appendChild(button);
    }
  };

  document.addEventListener('click', function(e){
    const button=e.target.closest('.bottom [data-page]');
    if(!button) return;
    if(st.page!=='journal' && st.page!=='journal-month' && st.page!=='journal-list') return;
    e.preventDefault();
    e.stopImmediatePropagation();
    st.page=button.dataset.page;
    window.render();
  }, true);

  const observer=new MutationObserver(addBottomItems);
  observer.observe(document.body,{childList:true,subtree:true});
  addBottomItems();
})();
