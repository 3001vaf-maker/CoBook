const PAGES = ['journal', 'timetable', 'management', 'chat', 'settings', 'dates', 'time', 'services'];
const state = { page: 'management', year: 2026, month: 7 };
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

function back(page, label = '← Назад') { return `<button class="secondary" data-page="${page}" type="button">${label}</button>`; }

function management() {
  return shell(`<section class="hero"><div class="eyebrow">КАБИНЕТ МАСТЕРА</div><h1>Управление</h1><p>Основной рабочий экран мастера.</p></section><section class="section-grid"><button class="menu-card" data-page="services" type="button"><span class="menu-icon">₽</span><b>Прайс</b><span>Услуги и стоимость</span></button></section>`);
}

function journal() {
  return shell(`<section class="page-head"><div class="eyebrow">РАБОТА С ЖУРНАЛОМ</div><h1>Журнал</h1><p>Экран журнала записей.</p></section><div class="tabs"><button class="tab active" type="button">День</button><button class="tab" type="button">Месяц</button><button class="tab" type="button">Список</button></div><section class="panel"><div class="panel-title">Сегодня</div><div class="empty">Записи будут отображаться здесь.</div></section><button class="primary" type="button">Новая запись</button>`);
}

function timetable() {
  const monthName = new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(new Date(state.year, state.month, 1));
  return shell(`<section class="page-head"><div class="eyebrow">ФОРМИРОВАНИЕ ГРАФИКА</div><h1>График</h1></section>
    <section class="calendar-panel">
      <div class="period-row year-row">
        <button class="period-arrow" data-year="prev" type="button">‹</button>
        <b>${state.year}</b>
        <button class="period-arrow" data-year="next" type="button">›</button>
      </div>
      <div class="period-row month-row">
        <button class="period-arrow" data-month="prev" type="button">‹</button>
        <b>${monthName.charAt(0).toUpperCase() + monthName.slice(1)}</b>
        <button class="period-arrow" data-month="next" type="button">›</button>
      </div>
      <div class="calendar-grid">
        ${calendarDays(state.year, state.month)}
      </div>
    </section>`);
}

function calendarDays(year, month) {
  const labels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysPrev = new Date(year, month, 0).getDate();
  const cells = [];

  labels.forEach(label => cells.push(`<div class="calendar-weekday">${label}</div>`));

  for (let i = offset - 1; i >= 0; i--) {
    const day = daysPrev - i;
    cells.push(`<button class="calendar-day outside" type="button">${day}</button>`);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(`<button class="calendar-day" type="button">${day}</button>`);
  }

  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push(`<button class="calendar-day outside" type="button">${nextDay++}</button>`);
  }

  return cells.join('');
}

function dates() {
  return shell(`<section class="page-head"><div class="eyebrow">ГРАФИК · ДАТЫ</div><h1>Даты</h1><p>Выбор рабочих дат.</p></section><section class="panel"><div class="empty">Интерфейс выбора дат будет добавлен после утверждения календаря.</div></section>${back('timetable')}`);
}

function time() {
  return shell(`<section class="page-head"><div class="eyebrow">ГРАФИК · ВРЕМЯ</div><h1>Время</h1><p>Рабочий интервал.</p></section><section class="panel"><div class="empty">Интерфейс времени будет добавлен после утверждения календаря.</div></section>${back('timetable')}`);
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
  app.innerHTML = (views[state.page] || management)();
}

app.addEventListener('click', event => {
  const pageTarget = event.target.closest('[data-page]');
  if (pageTarget) {
    const page = pageTarget.dataset.page;
    if (!PAGES.includes(page)) return;
    state.page = page;
    render();
    return;
  }

  const yearTarget = event.target.closest('[data-year]');
  if (yearTarget) {
    state.year += yearTarget.dataset.year === 'next' ? 1 : -1;
    render();
    return;
  }

  const monthTarget = event.target.closest('[data-month]');
  if (monthTarget) {
    state.month += monthTarget.dataset.month === 'next' ? 1 : -1;
    if (state.month < 0) { state.month = 11; state.year--; }
    if (state.month > 11) { state.month = 0; state.year++; }
    render();
  }
});

render();
