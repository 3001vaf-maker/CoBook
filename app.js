const PAGES = ['journal', 'timetable', 'management', 'chat', 'settings', 'dates', 'time', 'services'];
const state = { page: 'management' };
const app = document.getElementById('app');

const navItems = [
  ['journal', '▤', 'Журнал'],
  ['timetable', '▦', 'График'],
  ['management', '⌂', 'Управление'],
  ['chat', '◌', 'Чат'],
  ['settings', '⚙', 'Настройки']
];

function nav() {
  const active = ['dates', 'time'].includes(state.page) ? 'timetable' : state.page === 'services' ? 'management' : state.page;
  return `<nav class="bottom" aria-label="Основная навигация">${navItems.map(([page, icon, label]) => `<button class="nav ${active === page ? 'active' : ''}" data-page="${page}" type="button"><span class="nav-icon">${icon}</span><span>${label}</span></button>`).join('')}</nav>`;
}

function shell(content) {
  return `<div class="shell"><header class="topbar"><div class="brand">CoBook</div><div class="subtitle">Кабинет мастера</div></header><main class="content">${content}</main>${nav()}</div>`;
}

function back(page, label = '← Назад') {
  return `<button class="secondary" data-page="${page}" type="button">${label}</button>`;
}

// Управление — самостоятельный экран.
// На нём нет переходов или ссылок на Журнал, График, Чат или Сегодня.
function management() {
  return shell(`
    <section class="hero">
      <div class="eyebrow">КАБИНЕТ МАСТЕРА</div>
      <h1>Управление</h1>
      <p>Основной рабочий экран мастера.</p>
    </section>
    <section class="section-grid">
      <button class="menu-card" data-page="services" type="button">
        <span class="menu-icon">₽</span>
        <b>Прайс</b>
        <span>Услуги и стоимость</span>
      </button>
    </section>
  `);
}

function journal() {
  return shell(`<section class="page-head"><div class="eyebrow">РАБОТА С ЖУРНАЛОМ</div><h1>Журнал</h1><p>Экран журнала записей.</p></section><div class="tabs"><button class="tab active" type="button">День</button><button class="tab" type="button">Месяц</button><button class="tab" type="button">Список</button></div><section class="panel"><div class="panel-title">Сегодня</div><div class="empty">Записи будут отображаться здесь.</div></section><button class="primary" type="button">Новая запись</button>`);
}

function timetable() {
  return shell(`<section class="page-head"><div class="eyebrow">ФОРМИРОВАНИЕ ГРАФИКА</div><h1>График</h1><p>Сначала выбираются даты, затем для них задаётся рабочее время.</p></section><section class="section-grid one-column"><button class="menu-card" data-page="dates" type="button"><span class="menu-icon">▦</span><b>Даты</b><span>Выбор рабочих дат.</span></button><button class="menu-card" data-page="time" type="button"><span class="menu-icon">◷</span><b>Время</b><span>Рабочий интервал для выбранных дат.</span></button></section>`);
}

function dates() {
  return shell(`<section class="page-head"><div class="eyebrow">ГРАФИК · ДАТЫ</div><h1>Даты</h1><p>Здесь будет интерфейс выбора рабочих дат.</p></section><section class="panel"><div class="month-placeholder"><b>Август 2026</b><span>Календарь выбора дат</span></div><button class="primary" type="button">Множественный выбор дат</button></section>${back('timetable')}`);
}

function time() {
  return shell(`<section class="page-head"><div class="eyebrow">ГРАФИК · ВРЕМЯ</div><h1>Время</h1><p>Здесь будет интерфейс задания рабочего времени для выбранных дат.</p></section><section class="panel"><div class="panel-title">Рабочий интервал</div><div class="time-row"><div><span>Начало</span><b>10:00</b></div><div><span>Окончание</span><b>20:00</b></div></div></section>${back('timetable')}`);
}

function services() {
  return shell(`<section class="page-head"><div class="eyebrow">УПРАВЛЕНИЕ · ПРАЙС</div><h1>Прайс</h1><p>Услуги и стоимость.</p></section><section class="panel"><div class="empty">Список услуг будет добавлен после утверждения интерфейса.</div></section>${back('management')}`);
}

function chat() {
  return shell(`<section class="page-head"><div class="eyebrow">КОММУНИКАЦИЯ</div><h1>Чат</h1><p>Подключение к чат-боту для рассылок, уведомлений и общения.</p></section><section class="section-grid one-column"><div class="menu-card static"><span class="menu-icon">↗</span><b>Рассылки</b><span>Сообщения клиентам.</span></div><div class="menu-card static"><span class="menu-icon">◌</span><b>Уведомления</b><span>Сервисные уведомления.</span></div><div class="menu-card static"><span class="menu-icon">•••</span><b>Коммуникация</b><span>Диалог через чат-бот.</span></div></section>`);
}

function settings() {
  return shell(`<section class="page-head"><div class="eyebrow">РАБОЧИЕ НАСТРОЙКИ</div><h1>Настройки</h1><p>Рабочие настройки кабинета мастера.</p></section><section class="section-grid one-column"><button class="menu-card" type="button"><span class="menu-icon">●</span><b>Профиль</b><span>Данные кабинета.</span></button><button class="menu-card" type="button"><span class="menu-icon">◷</span><b>Рабочие параметры</b><span>Параметры рабочего процесса.</span></button><button class="menu-card" type="button"><span class="menu-icon">◌</span><b>Уведомления</b><span>Настройки уведомлений.</span></button></section>`);
}

function render() {
  const views = { journal, timetable, management, chat, settings, dates, time, services };
  const view = views[state.page] || management;
  app.innerHTML = view();
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
