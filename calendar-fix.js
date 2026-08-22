(() => {
  const style = document.createElement('style');
  style.textContent = `
    .month-grid{display:grid!important;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px;width:100%;align-items:stretch}
    .weekday{min-width:0;text-align:center;font-size:12px;font-weight:700;color:#777;padding:7px 2px}
    .month-day{min-width:0!important;width:100%;aspect-ratio:1/1;border:1px solid #e5e5e2!important;border-radius:12px!important;background:#fff!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:2px!important;padding:4px!important;position:relative}
    .month-day span{font-size:16px;line-height:1;font-weight:400;color:#777}
    .month-day i{display:none!important}
    .month-day em{position:absolute;right:5px;top:4px;font-size:9px;font-style:normal;color:#777}
    .month-day.other{opacity:.42}
    .month-day.client-available span{color:#111;font-weight:800}
    .month-day.client-unavailable{background:#f5f5f3!important;border-color:#ededeb!important;cursor:default!important}
    .month-day.client-unavailable span{color:#aaa!important;font-weight:400!important}
    .month-day.selected{outline:2px solid #171717!important;outline-offset:-2px}
    .month-head{display:grid!important;grid-template-columns:42px 1fr 42px;align-items:center;text-align:center;gap:8px;margin:12px 0}
    .calendar-legend{display:flex;gap:14px;flex-wrap:wrap;font-size:12px;color:#777;margin:10px 0 4px}
  `;
  document.head.appendChild(style);

  function refreshClientCalendar(){
    try {
      if (typeof st === 'undefined' || typeof db === 'undefined') return;
      if (st.role !== 'client' || !st.service || typeof svc !== 'function' || typeof slots !== 'function' || typeof isWorking !== 'function') return;
      const service = svc(st.service);
      if (!service) return;
      document.querySelectorAll('.month-day').forEach(btn => {
        const date = btn.dataset.date;
        if (!date) return;
        const available = date.slice(0,7) === st.month && isWorking(date) && slots(date, service).length > 0;
        btn.classList.toggle('client-available', available);
        btn.classList.toggle('client-unavailable', !available);
        btn.disabled = !available;
        btn.setAttribute('aria-disabled', String(!available));
      });
    } catch(e) {}
  }

  const observer = new MutationObserver(() => refreshClientCalendar());
  observer.observe(document.getElementById('app'), {childList:true,subtree:true});
  setTimeout(refreshClientCalendar, 0);
  setTimeout(refreshClientCalendar, 100);
  setTimeout(refreshClientCalendar, 300);
})();
