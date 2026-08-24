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
      const rule = state.rules[key];
      const working = !!rule;
      const selected = state.selectedDates.has(key);
      const weekend = current.getDay() === 0 || current.getDay() === 6;
      const hours = working ? scheduleWorkingHours(rule) : '';
      cells.push(
        `<button class="calendar-day${inMonth ? '' : ' outside'}${weekend ? ' weekend' : ''}${working ? ' work' : ''}${selected ? ' selected' : ''}" data-action="calendar-date" data-date="${key}" type="button"><span>${current.getDate()}</span>${hours ? `<small class="calendar-hours">${hours}</small>` : ''}</button>`
      );
    }

    return cells.join('');
  }

  function scheduleWorkingMinutes(rule) {
    if (Array.isArray(rule?.intervals) && rule.intervals.length) {
      return rule.intervals.reduce((total, interval) => {
        if (!interval?.start || !interval?.end) return total;
        const duration = minutesValue(interval.end) - minutesValue(interval.start);
        return total + Math.max(0, duration);
      }, 0);
    }

    if (!rule?.start || !rule?.end) return 0;
    return Math.max(0, minutesValue(rule.end) - minutesValue(rule.start));
  }

  function scheduleWorkingHours(rule) {
    const minutes = scheduleWorkingMinutes(rule);
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    if (!rest) return `${hours} ч`;
    if (!hours) return `${rest} мин`;
    return `${hours} ч ${rest} мин`;
  }

  function scheduleWorkingDaysCount(year, month) {
    const days = new Date(year, month + 1, 0).getDate();
    let count = 0;
    for (let day = 1; day <= days; day++) {
      const key = dateKey(year, month, day);
      if (state.rules[key]) count++;
    }
    return count;
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
  const scheduleBaseTimetable = timetable;

  calendarDays = scheduleCalendarDays;
  dispatchAction = scheduleDispatchAction;

  timetable = function () {
    const count = scheduleWorkingDaysCount(state.year, state.month);
    return scheduleBaseTimetable().replace(
      '<h1>График</h1>',
      `<div class="schedule-heading"><h1>График</h1><span class="schedule-working-count">Рабочих дней: ${count}</span></div>`
    );
  };
})();