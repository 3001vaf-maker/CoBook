// Documents navigation fix: keep Settings → Documents inside the Documents view.
// Capture the click before the legacy page dispatcher can fall back to Management.
document.addEventListener('click', function (event) {
  const target = event.target.closest('[data-action="navigate"][data-page="documents"]');
  if (!target) return;
  event.preventDefault();
  event.stopImmediatePropagation();

  const app = document.getElementById('app');
  if (app && typeof window.documents === 'function') {
    app.innerHTML = window.documents();
  }
}, true);
