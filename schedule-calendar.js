(function () {
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
      cells.push(`<button class="calendar-day${inMonth ? '' : ' outside'}${weekend ? ' weekend' : ''}${working ? ' work' : ''}${selected ? ' selected' : ''}" data-action="calendar-date" data-date="${key}" type="button"><span>${current.getDate()}</span>${hours ? `<small class="calendar-hours">${hours}</small>` : ''}</button>`);
    }
    return cells.join('');
  }

  function scheduleWorkingMinutes(rule) {
    if (Array.isArray(rule?.intervals) && rule.intervals.length) {
      return rule.intervals.reduce((total, interval) => {
        if (!interval?.start || !interval?.end) return total;
        return total + Math.max(0, minutesValue(interval.end) - minutesValue(interval.start));
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

  function scheduleMonthSummary(year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let workingDays = 0;
    let workingMinutes = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const rule = state.rules[dateKey(year, month, day)];
      if (!rule) continue;
      workingDays++;
      workingMinutes += scheduleWorkingMinutes(rule);
    }
    const hours = Math.floor(workingMinutes / 60);
    const minutes = workingMinutes % 60;
    return `${workingDays} д. • ${hours}:${String(minutes).padStart(2, '0')}`;
  }

  function scheduleTimetable() {
    const month = new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(new Date(state.year, state.month, 1));
    const first = [...state.selectedDates][0];
    const off = first && state.rules[first];
    const summary = scheduleMonthSummary(state.year, state.month);
    return shell(`<section class="page-head"><div class="eyebrow">ФОРМИРОВАНИЕ ГРАФИКА</div><div class="schedule-heading"><h1>График</h1><div class="schedule-summary"><div class="schedule-summary-title">Рабочее время</div><div class="schedule-month-summary">${summary}</div></div></div></section><section class="calendar-panel"><div class="period-row"><button class="period-arrow" data-action="year" data-direction="-1" type="button">‹</button><b>${state.year}</b><button class="period-arrow" data-action="year" data-direction="1" type="button">›</button></div><div class="period-row"><button class="period-arrow" data-action="month" data-direction="-1" type="button">‹</button><b>${month[0].toUpperCase() + month.slice(1)}</b><button class="period-arrow" data-action="month" data-direction="1" type="button">›</button></div><div class="calendar-grid">${scheduleCalendarDays(state.year, state.month)}</div><section class="panel work-interval"><div class="panel-title">Рабочий интервал</div><div class="time-row">${timeField('start', 'Начало', state.startTime)}${timeField('end', 'Окончание', state.endTime)}</div><button class="primary full action-button${off ? ' schedule-action-off' : ''}" data-action="apply-schedule" type="button">${off ? 'Применить: Выходной день' : 'Применить: Рабочий день'}</button></section></section>`);
  }

  function scheduleDispatchAction(action, element) {
    if (action !== 'calendar-date') return scheduleBaseDispatchAction(action, element);
    const key = element.dataset.date;
    if (!key) return;
    const selected = state.selectedDates;
    const first = selected.values().next().value;
    if (first !== undefined && !!state.rules[first] !== !!state.rules[key]) return;
    selected.has(key) ? selected.delete(key) : selected.add(key);
    render();
  }

  const scheduleBaseDispatchAction = dispatchAction;
  calendarDays = scheduleCalendarDays;
  dispatchAction = scheduleDispatchAction;
  timetable = scheduleTimetable;
})();