(() => {
  const removeInternalHomeLink = () => {
    document.querySelectorAll('.content button[data-page="home"]').forEach(button => button.remove());
  };

  removeInternalHomeLink();
  new MutationObserver(removeInternalHomeLink).observe(document.getElementById('app'), {
    childList: true,
    subtree: true
  });
})();
