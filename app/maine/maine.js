(function(){
  function main(){
    const content = `
      <section class="hero">
        <div class="eyebrow">ГЛАВНОЕ</div>
        <h1>Главная</h1>
      </section>
      <section class="panel">
        <button class="management-folder" data-action="account-open" type="button">
          <span class="management-folder-icon">◉</span>
          <span><b>Аккаунты</b><small>Список аккаунтов</small></span>
          <span class="management-chevron">›</span>
        </button>
        <button class="management-folder" data-action="home-test" type="button">
          <span class="management-folder-icon">⌂</span>
          <span><b>Дом</b><small>Тестовая кнопка</small></span>
          <span class="management-chevron">›</span>
        </button>
      </section>`;
    return window.shell(content);
  }

  CoBook.modules.maine = {
    render: main,
    handle: function(action){
      if(action === 'home-test') return;
    }
  };
})();
