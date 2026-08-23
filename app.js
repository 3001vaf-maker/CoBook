const PAGES = ['journal', 'schedule', 'management', 'chat', 'settings'];
const state = { page: 'management' };

const app = document.getElementById('app');

const navItems = [
  ['journal', '▤', 'Журнал'],
  ['schedule', '▦', 'График'],
  ['management', '⌂', 'Управление'],
  ['chat', '◌', 'Чат'],
  ['settings', '⚙', 'Настройки']
];

const pageTitles = {
  journal: 'Журнал',
  schedule: 'График',
  management: 'Управление',
  chat: 'Чат',
  settings: 'Настройки'
};

function nav() {
  return `<nav class="bottom" aria-label="Основная навигация">
    ${navItems.map(([page, icon, label]) => `
      <button class="nav ${state.page === page ? 'active' : ''}" data-page="${page}" type="button">
        <span class="nav-icon">${icon}</span>
        <span>${label}</span>
      </button>`).join('')}
  </nav>`;
}

function shell(content) {
  return `<div class="shell">
    <header class="topbar">
      <div class="brand">CoBook</div>
      <div class="subtitle">Кабинет мастера</div>
    </header>
    <main class="content">${content}</main>
    ${nav()}
  </div>`;
}

function management() {
  return shell(`
    <section class="hero">
      <div class="eyebrow">КАБИНЕТ МАСТЕРА</div>
      <h1>Управление</h1>
      <p>Основной рабочий экран мастера.</p>
    </section>

    <section class="section-grid">
      <button class="menu-card" data-page="journal" type="button">
        <span class="menu-icon">▤</span>
        <b>Журнал</b>
        <span>Работа с записями</span>
      </button>
      <button class="menu-card" data-page="schedule" type="button">
        <span class="menu-icon">▦</span>
        <b>График</b>
        <span>Формирование рабочего графика</span>
      </button>
      <button class="menu-card" data-page="chat" type="button">
        <span class="menu-icon">◌</span>
        <b>Чат</b>
        <span>Рассылки и коммуникация</span>
      </button>
      <button class="menu-card" data-page="settings" type="button">
        <span class="menu-icon">⚙</span>
        <b>Настройки</b>
        <span>Рабочие настройки</span>
      </button>
    </section>

    <section class="panel">
      <div class="panel-title">Сегодня</div>
      <div class="empty">Рабочая информация появится после подключения функционала.</div>
    </section>
  `);
}

function journal() {
  return shell(`
    <section class="page-head">
      <div class="eyebrow">РАБОТА С ЖУРНАЛОМ</div>
      <h1>Журнал</h1>
      <p>День, месяц и список записей.</p>
    </section>

    <div class="tabs">
      <button class="tab active" type="button">День</button>
      <button class="tab" type="button">Месяц</button>
      <button class="tab" type="button">Список</button>
    </div>

    <section class="panel">
      <div class="panel-title">Сегодня</div>
      <div class="empty">Записи будут отображаться здесь.</div>
    </section>

    <button class="primary" type="button">Новая запись</button>
  `);
}

function schedule() {
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  return shell(`
    <section class="page-head">
      <div class="eyebrow">ФОРМИРОВАНИЕ ГРАФИКА</div>
      <h1>График</h1>
      <p>Шаблон рабочего графика и отдельные даты.</p>
    </section>

    <section class="panel">
      <div class="row"><div class="panel-title">Базовый график</div><span class="muted">Шаблон</span></div>
      <div class="week-list">
        ${days.map(day => `<div class="week-row"><b>${day}</b><span>Работаю</span><span class="status-dot"></span></div>`).join('')}
      </div>
    </section>

    <section class="panel">
      <div class="panel-title">Рабочий интервал</div>
      <div class="time-row"><div><span>Начало</span><b>10:00</b></div><div><span>Окончание</span><b>20:00</b></div></div>
      <button class="secondary full" type="button">Рабочий интервал для выбранных дат</button>
    </section>

    <section class="panel">
      <div class="panel-title">Отдельные даты</div>
      <div class="month-placeholder"><b>Август 2026</b><span>Календарь выбора дат</span></div>
      <button class="primary" type="button">Множественный выбор дат</button>
    </section>
  `);
}

function chat() {
  return shell(`
    <section class="page-head">
      <div class="eyebrow">КОММУНИКАЦИЯ</div>
      <h1>Чат</h1>
      <p>Подключение к чат-боту для рассылок, уведомлений и общения.</p>
    </section>
    <section class="section-grid one-column">
      <div class="menu-card static"><span class="menu-icon">↗</span><b>Рассылки</b><span>Сообщения клиентам.</span></div>
      <div class="menu-card static"><span class="menu-icon">◌</span><b>Уведомления</b><span>Сервисные уведомления.</span></div>
      <div class="menu-card static"><span class="menu-icon">•••</span><b>Коммуникация</b><span>Диалог через чат-бот.</span></div>
    </section>
  `);
}

function settings() {
  return shell(`
    <section class="page-head">
      <div class="eyebrow">РАБОЧИЕ НАСТРОЙКИ</div>
      <h1>Настройки</h1>
      <p>Параметры кабинета мастера.</p>
    </section>
    <section class="section-grid one-column">
      <button class="menu-card" type="button"><span class="menu-icon">●</span><b>Профиль</b><span>Имя, специальность и данные кабинета.</span></button>
      <button class="menu-card" type="button"><span class="menu-icon">◷</span><b>Рабочие параметры</b><span>Параметры рабочего процесса.</span></button>
      <button class="menu-card" type="button"><span class="menu-icon">◌</span><b>Уведомления</b><span>Настройки уведомлений.</span></button>
    </section>
  `);
}

function render() {
  const views = { journal, schedule, management, chat, settings };
  app.innerHTML = views[state.page]();
}

app.addEventListener('click', event => {
  const target = event.target.closest('[data-page]');
  if (!target) return;
  const page = target.dataset.page;
  if (!PAGES.includes(page)) return;
  state.page = page;
  render();
});

render();
