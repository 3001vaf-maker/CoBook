(() => {
  const fixPriceNavigation = () => {
    document.querySelectorAll('.content button[data-page="home"]').forEach(button => button.remove());
    document.querySelectorAll('.bottom button[data-page="services"]').forEach(button => button.remove());
  };

  fixPriceNavigation();
  new MutationObserver(fixPriceNavigation).observe(document.getElementById('app'), {
    childList: true,
    subtree: true
  });
})();
