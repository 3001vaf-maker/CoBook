/* CoBook Loyalty navigation controller.
 * Owns only navigation between Loyalty screens and the parent Settings route.
 * It intentionally sits at the app boundary; Loyalty business actions remain in loyalty-ui.js.
 */
(function () {
  const app = document.getElementById('app');
  if (!app) return;

  app.addEventListener('click', function (event) {
    const button = event.target.closest('[data-loyalty]');
    if (!button || !app.contains(button)) return;

    // This controller is the single owner of Loyalty back navigation.
    event.stopImmediatePropagation();

    if (button.dataset.loyalty === 'home') {
      if (window.CoBookLoyalty && typeof window.CoBookLoyalty.render === 'function') {
        window.CoBookLoyalty.render(app, 'home');
      }
      return;
    }

    if (button.dataset.loyalty === 'settings') {
      if (typeof window.render === 'function') {
        window.render('settings');
      }
    }
  }, true);
})();
