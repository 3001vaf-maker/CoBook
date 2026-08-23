(() => {
  const app = document.getElementById('app');
  if (!app) return;

  const navHtml = () => `<nav class="bottom">
    <button class="nav" data-page="journal">▤<br>Журнал</button>
    <button class="nav" data-page="calendar">▦<br>График</button>
    <button class="nav" data-page="home">⌂<br>Управление</button>
    <button class="nav" data-page="chat">◌<br>Чат</button>
    <button class="nav" data-page="settings">⚙<br>Настройки</button>
  </nav>`;

  const replaceNav = () => {
    const old = app.querySelector('.bottom');
    if (!old) return;
    old.outerHTML = navHtml();
  };

  const screen = (title, text, items = []) => `
    <div class="shell">
      <header class="topbar"><div class="brand">CoBook</div><div class="subtitle">Кабинет мастера</div></header>
      <main class="content">
        <div class="hero"><h1>${title}</h1><p>${text}</p></div>
        ${items.map(x => `<div class="card"><b>${x.title}</b><div class="small muted">${x.text}</div></div>`).join('')}
      </main>
      ${navHtml()}
    </div>`;

  const openSpecialPage = page => {
    if (page === 'chat') {
      app.innerHTML = screen('Чат', 'Подключение к чат-боту для рассылок, уведомлений и коммуникации.', [
        {title:'Рассылки', text:'Подготовка и отправка уведомлений клиентам.'},
        {title:'Уведомления', text:'Системные и сервисные сообщения.'},
        {title:'Коммуникация', text:'Диалог с клиентами через чат-бот.'}
      ]);
      return true;
    }
    if (page === 'settings') {
      app.innerHTML = screen('Настройки', 'Рабочие настройки кабинета мастера.', [
        {title:'Профиль', text:'Данные мастера и кабинета.'},
        {title:'Рабочие параметры', text:'Параметры, используемые в работе кабинета.'},
        {title:'Уведомления', text:'Настройки уведомлений и коммуникаций.'}
      ]);
      return true;
    }
    return false;
  };

  app.addEventListener('click', event => {
    const button = event.target.closest('.bottom [data-page]');
    if (!button) return;
    const page = button.dataset.page;
    if (!openSpecialPage(page)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  const observer = new MutationObserver(() => {
    const bottom = app.querySelector('.bottom');
    if (bottom && bottom.innerHTML.trim() !== navHtml().match(/<nav class="bottom">([\s\S]*)<\/nav>/)?.[1]?.trim()) {
      replaceNav();
    }
  });
  observer.observe(app, { childList: true, subtree: true });

  replaceNav();
})();
