(() => {
  const app = document.getElementById('app');
  if (!app) return;

  const navHtml = () => `<button class="nav" data-page="journal">▤<br>Журнал</button>
    <button class="nav" data-page="calendar">▦<br>График</button>
    <button class="nav" data-page="home">⌂<br>Управление</button>
    <button class="nav" data-page="chat">◌<br>Чат</button>
    <button class="nav" data-page="settings">⚙<br>Настройки</button>`;

  const syncNav = () => {
    const bottom = app.querySelector('.bottom');
    if (!bottom) return;
    const desired = navHtml();
    if (bottom.innerHTML.trim() !== desired.trim()) bottom.innerHTML = desired;
  };

  const openSpecialPage = page => {
    const content = app.querySelector('.content');
    if (!content) return false;
    if (page === 'chat') {
      content.innerHTML = `<div class="hero"><h1>Чат</h1><p>Подключение к чат-боту для рассылок, уведомлений и коммуникации.</p></div><div class="card"><b>Рассылки</b><div class="small muted">Подготовка и отправка уведомлений клиентам.</div></div><div class="card"><b>Уведомления</b><div class="small muted">Системные и сервисные сообщения.</div></div><div class="card"><b>Коммуникация</b><div class="small muted">Диалог с клиентами через чат-бот.</div></div>`;
      syncNav();
      return true;
    }
    if (page === 'settings') {
      content.innerHTML = `<div class="hero"><h1>Настройки</h1><p>Рабочие настройки кабинета мастера.</p></div><div class="card"><b>Профиль</b><div class="small muted">Данные мастера и кабинета.</div></div><div class="card"><b>Рабочие параметры</b><div class="small muted">Параметры, используемые в работе кабинета.</div></div><div class="card"><b>Уведомления</b><div class="small muted">Настройки уведомлений и коммуникации.</div></div>`;
      syncNav();
      return true;
    }
    return false;
  };

  app.addEventListener('click', event => {
    const button = event.target.closest('.bottom [data-page]');
    if (!button) return;
    if (!openSpecialPage(button.dataset.page)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  new MutationObserver(syncNav).observe(app, {childList:true, subtree:true});
  syncNav();
})();
