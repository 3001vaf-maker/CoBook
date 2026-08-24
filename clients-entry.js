(() => {
  const inject = () => {
    const content = document.querySelector('.content');
    if (!content) return;
    const service = content.querySelector('.management-folder');
    if (!service || content.querySelector('[data-client-entry]')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'management-folder';
    button.dataset.clientEntry = '1';
    button.innerHTML = '<span class="management-folder-icon">♙</span><span><b>Клиенты</b><small>Профили и клиентская база</small></span><span class="management-chevron">›</span>';
    service.insertAdjacentElement('afterend', button);
  };
  new MutationObserver(inject).observe(document.getElementById('app'), {childList:true,subtree:true});
  inject();
})();