(() => {
  const marker = 'cobook_clients_main_v1_initialized';
  if (!localStorage.getItem(marker)) {
    localStorage.removeItem('cobook_client_profiles');
    localStorage.setItem(marker, '1');
  }
  const inject = () => {
    const content = document.querySelector('.content');
    if (!content) return;
    const service = content.querySelector('.management-folder:not([data-client-entry])');
    if (service) service.classList.replace('management-folder', 'management-service-folder');
    if (!content.querySelector('[data-client-entry]')) {
      const serviceCard = content.querySelector('.management-service-folder');
      if (!serviceCard) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'management-folder';
      button.dataset.clientEntry = '1';
      button.innerHTML = '<span class="management-folder-icon">♙</span><span><b>Клиенты</b><small>Профили и клиентская база</small></span><span class="management-chevron">›</span>';
      serviceCard.insertAdjacentElement('afterend', button);
    }
  };
  const app = document.getElementById('app');
  if (app) new MutationObserver(inject).observe(app, {childList:true,subtree:true});
  inject();
})();