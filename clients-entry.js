(() => {
  const CLIENT_ENTRY = 'cobook_clients_main_v1';

  const inject = () => {
    const content = document.querySelector('.content');
    if (!content) return;

    const service = content.querySelector('.management-folder:not([data-client-entry]):not(.management-service-folder)');
    if (service) service.classList.replace('management-folder', 'management-service-folder');

    const clientButtons = [...content.querySelectorAll('.management-folder')].filter(button => {
      const title = button.querySelector('b');
      return title && title.textContent.trim() === 'Клиенты';
    });

    const ours = content.querySelector('[data-client-entry="1"]');
    clientButtons.forEach(button => {
      if (button !== ours) button.remove();
    });

    if (ours) return;

    const serviceCard = content.querySelector('.management-service-folder');
    if (!serviceCard) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'management-folder';
    button.dataset.clientEntry = '1';
    button.dataset.clientEntryVersion = CLIENT_ENTRY;
    button.innerHTML = '<span class="management-folder-icon">♙</span><span><b>Клиенты</b><small>Профили и клиентская база</small></span><span class="management-chevron">›</span>';
    serviceCard.insertAdjacentElement('afterend', button);
  };

  const app = document.getElementById('app');
  if (app) new MutationObserver(inject).observe(app, { childList: true, subtree: true });
  inject();
})();