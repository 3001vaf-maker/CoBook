(() => {
  const app = document.getElementById('app');
  if (!app) return;

  const sync = () => {
    const timetable = app.querySelector('.calendar-panel');
    if (!timetable) return;

    const selected = app.querySelector('.calendar-day.selected');
    const action = app.querySelector('[data-action="apply-schedule"]');
    if (!action) return;

    const isWorking = !!selected?.classList.contains('work');
    action.textContent = isWorking
      ? 'Применить: Выходной день'
      : 'Применить: Рабочий день';
    action.classList.toggle('schedule-action-off', isWorking);
  };

  new MutationObserver(sync).observe(app, { childList: true, subtree: true });
  sync();
})();
