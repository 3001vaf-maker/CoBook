(function () {
  // Schedule calendar is the single owner of visible date generation and date selection.
  // The application state remains the source of truth: state.rules[date] and state.selectedDates.
  function scheduleCalendarDays(year, month) {
    const labels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const start = new Date(year, month, 1 - ((first.getDay() + 6) % 7));
    const end = new Date(last.getFullYear(), last.getMonth(), last.getDate() + (7 - ((last.getDay() + 6) % 7) - 1));
    const cells = labels.map(label => `<div class="calendar-weekday">${label}</div>`);

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const current = new Date(date);
      const key = dateKey(current.getFullYear(), current.getMonth(), current.getDate());
      const inMonth = current.getMonth() === month && current.getFullYear() === year;
      const working = !!state.rules[key];
      const selected = state.selectedDates.has(key);
      const weekend = current.getDay() === 0 || current.getDay() === 6;
      cells.push(
        `<button class="calendar-day${inMonth ? '' : ' outside'}${weekend ? ' weekend' : ''}${working ? ' work' : ''}${selected ? ' selected' : ''}" data-action="calendar-date" data-date="${key}" type="button"><span>${current.getDate()}</span></button>`
      );
    }

    return cells.join('');
  }

  function scheduleDispatchAction(action, element) {
    if (action !== 'calendar-date') {
      return scheduleBaseDispatchAction(action, element);
    }

    const key = element.dataset.date;
    if (!key) return;

    const selected = state.selectedDates;
    const first = selected.values().next().value;

    if (first !== undefined) {
      const firstWorking = !!state.rules[first];
      const clickedWorking = !!state.rules[key];
      if (clickedWorking !== firstWorking) return;
    }

    if (selected.has(key)) selected.delete(key);
    else selected.add(key);

    render();
  }

  const scheduleBaseDispatchAction = dispatchAction;
  calendarDays = scheduleCalendarDays;
  dispatchAction = scheduleDispatchAction;
})();
