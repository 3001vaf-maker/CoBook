/* Functional bridge: routes Loyalty UI actions to loyalty-ui.js. */
(function () {
  document.addEventListener('click', function (event) {
    const button = event.target.closest('button');
    if (!button) return;
    const action = button.dataset.action;
    const page = button.dataset.page;
    if (action === 'loyalty-create') {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (typeof window.loyaltyCreateProgram === 'function') window.loyaltyCreateProgram();
      return;
    }
    if (action === 'navigate' && page === 'loyalty') {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (typeof window.loyalty === 'function') window.loyalty();
    }
  }, true);
})();
