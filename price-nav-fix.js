(() => {
  const fixPriceNavigation = () => {
    document.querySelectorAll('.content button[data-page="home"]').forEach(button => button.remove());
    document.querySelectorAll('.bottom button[data-page="services"]').forEach(button => button.remove());
    document.querySelectorAll('.bottom button[data-page="home"]').forEach(button => {
      const br = button.querySelector('br');
      if (br) br.nextSibling.textContent = 'Настройки';
    });
  };

  fixPriceNavigation();
  new MutationObserver(fixPriceNavigation).observe(document.getElementById('app'), {
    childList: true,
    subtree: true
  });
})();
