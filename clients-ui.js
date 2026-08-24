(() => {
  const KEY = 'cobook_client_profiles';
  const read = () => {
    try {
      const value = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(value) ? value : [];
    } catch (_) { return []; }
  };
  const save = value => localStorage.setItem(KEY, JSON.stringify(value));
  let profiles = read();
  let current = null;

  const esc = value => String(value ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const fullName = p => [p.displayName || p.firstName, p.surname].filter(Boolean).join(' ') || 'Новый профиль';
  const firstChar = p => (p.displayName || p.firstName || '?').charAt(0).toUpperCase();
  const newProfile = () => ({
    profileId: `p_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
    clientId: '',
    firstName: '', surname: '', displayName: '', gender: '', birthDate: '',
    source: '', discount: '',
    phones: [], telegrams: [], emails: [],
    visits: 0, total: 0, lastVisit: '',
    importantProgram: '', importantProgramBalance: '',
    consents: { personalData: false, mailings: false }
  });
  const normalizeContacts = p => {
    p.phones = Array.isArray(p.phones) ? p.phones.filter(Boolean) : [];
    p.telegrams = Array.isArray(p.telegrams) ? p.telegrams.filter(Boolean) : [];
    p.emails = Array.isArray(p.emails) ? p.emails.filter(Boolean) : [];
    return p;
  };
  const usedIds = () => new Set(profiles.map(p => p.clientId).filter(Boolean));

  function clientsScreen() {
    document.getElementById('app').innerHTML = `
      <div class="shell clients-screen">
        <main class="content">
          <button class="clients-back" data-client-action="back">‹ Главная</button>
          <section class="page-head">
            <div class="eyebrow">ГЛАВНАЯ · КЛИЕНТЫ</div>
            <h1>Клиенты</h1>
          </section>
          <div id="clientsContent"></div>
        </main>
      </div>`;
    renderList();
  }

  function renderList() {
    const root = document.getElementById('clientsContent');
    if (!root) return;
    if (!profiles.length) {
      root.innerHTML = `<div class="client-empty">База клиентов пока пуста.</div><button class="client-action clients-add" data-client-action="new">Добавить профиль</button>`;
      return;
    }
    root.innerHTML = `<div class="clients-list">${profiles.map(p => `
      <button class="client-list-row" data-client-action="open" data-profile-id="${esc(p.profileId)}">
        <span class="client-avatar">${esc(firstChar(p))}</span>
        <span class="client-list-main"><b>${esc(fullName(p))}</b><small>${p.clientId ? `Client ID · ${esc(p.clientId)}` : 'Профиль · Client ID не присвоен'}</small></span>
        <span>›</span>
      </button>`).join('')}</div><button class="client-action clients-add" data-client-action="new">Добавить профиль</button>`;
  }

  function renderCard(p) {
    current = p;
    normalizeContacts(p);
    document.getElementById('clientsContent').innerHTML = `
      <div class="client-card">
        <div class="client-card-head">
          <div class="client-avatar">${esc(firstChar(p))}</div>
          <div><div class="client-card-name">${esc(fullName(p))}</div><span class="client-card-status">${p.clientId ? `Клиент · ${esc(p.clientId)}` : 'Профиль · Client ID не присвоен'}</span></div>
        </div>
        ${p.clientId ? '' : `<div class="client-section"><div class="client-section-title">Client ID</div><div class="client-id-box"><div class="client-id-value">—</div><button class="client-action" data-client-action="id">Присвоить ID</button></div></div>`}
        <div class="client-section"><div class="client-section-title">Показатели</div><div class="client-stats">
          <div class="client-stat"><b>${Number(p.visits)||0}</b><span>Посещений</span></div>
          <div class="client-stat"><b>${p.total ? esc(Number(p.total).toLocaleString('ru-RU') + ' ₽') : '0 ₽'}</b><span>Сумма</span></div>
          <div class="client-stat"><b>${esc(p.lastVisit || '—')}</b><span>Последний визит</span></div>
        </div></div>
        <div class="client-section"><div class="client-section-title">Важная программа</div><button class="client-program" data-client-action="program"><span>${esc(p.importantProgram || 'Не назначена')}</span><span>›</span></button></div>
        <div class="client-section"><div class="client-section-title">Согласия</div><div class="client-consent"><span>Персональные данные</span><span class="client-consent-status">${p.consents.personalData ? 'Подписано' : 'Не подписано'}</span></div><div class="client-consent"><span>Рассылки</span><span class="client-consent-status">${p.consents.mailings ? 'Подписано' : 'Не подписано'}</span></div></div>
        <div class="client-section"><button class="client-action" data-client-action="edit">Редактировать данные</button></div>
      </div>`;
  }

  function contactEditor(label, type, values) {
    return `<div class="client-field"><label>${label}</label><div id="${type}Editor">${values.map((v,i)=>`<div class="client-repeat-row"><input data-repeat="${type}" data-index="${i}" value="${esc(v)}"><button class="client-repeat-remove" data-remove="${type}" data-index="${i}" type="button">×</button></div>`).join('')}</div><button class="client-repeat-add" data-add="${type}" type="button">+ Добавить</button></div>`;
  }

  function renderEdit() {
    const p = current;
    document.getElementById('clientsContent').innerHTML = `
      <div class="client-card">
        <div class="client-card-head"><div class="client-card-name">Редактирование профиля</div><span class="client-card-status">Client ID: ${p.clientId ? esc(p.clientId) : 'не присвоен'}</span></div>
        <div class="client-section"><div class="client-section-title">Личные данные</div><div class="client-grid">
          <div class="client-field"><label>Имя</label><input id="fName" value="${esc(p.firstName)}"></div>
          <div class="client-field"><label>Фамилия</label><input id="fSurname" value="${esc(p.surname)}"></div>
          <div class="client-field"><label>Как обращаться</label><input id="fDisplay" value="${esc(p.displayName)}"></div>
          <div class="client-field"><label>Пол</label><select id="fGender"><option value="">Не выбран</option><option ${p.gender==='Женский'?'selected':''}>Женский</option><option ${p.gender==='Мужской'?'selected':''}>Мужской</option></select></div>
          <div class="client-field"><label>День рождения</label><input id="fBirth" value="${esc(p.birthDate)}" placeholder="ДД.ММ.ГГГГ"></div>
        </div></div>
        <div class="client-section"><div class="client-section-title">Контактные данные</div><div class="client-grid">
          ${contactEditor('Телефоны','phones',p.phones)}
          ${contactEditor('Telegram','telegrams',p.telegrams)}
          ${contactEditor('Email','emails',p.emails)}
        </div></div>
        <div class="client-section"><div class="client-section-title">Дополнительные данные мастера</div><div class="client-grid">
          <div class="client-field"><label>Скидка, %</label><input id="fDiscount" type="number" min="0" step="0.01" value="${esc(p.discount)}"></div>
          <div class="client-field"><label>От кого узнал про мастера</label><input id="fSource" value="${esc(p.source)}"></div>
        </div><div class="client-section-title" style="margin-top:16px">Программы</div><button class="client-program" data-client-action="program"><span>${esc(p.importantProgram || 'Присвоить программу')}</span><span>›</span></button></div>
        <div class="client-edit-actions"><button class="client-btn secondary" data-client-action="cancel-edit">Отмена</button><button class="client-btn primary" data-client-action="save-edit">Сохранить</button></div>
      </div>`;
  }

  function collectEdit() {
    current.firstName = document.getElementById('fName').value.trim();
    current.surname = document.getElementById('fSurname').value.trim();
    current.displayName = document.getElementById('fDisplay').value.trim();
    current.gender = document.getElementById('fGender').value;
    current.birthDate = document.getElementById('fBirth').value.trim();
    current.discount = document.getElementById('fDiscount').value.trim();
    current.source = document.getElementById('fSource').value.trim();
    ['phones','telegrams','emails'].forEach(type => {
      current[type] = [...document.querySelectorAll(`[data-repeat="${type}"]`)].map(x => x.value.trim()).filter(Boolean);
    });
    save(profiles);
  }

  function openIdModal() {
    document.body.insertAdjacentHTML('beforeend', `<div class="client-modal" id="clientIdModal"><div class="client-modal-box"><h2 class="client-modal-title">Client ID</h2><div id="idChoice" class="client-mode-list"><button class="client-mode" data-id-mode="assign">Присвоить ID</button><button class="client-mode" data-id-mode="link">Привязать к ID</button></div><div id="idAssign" class="hidden"><input id="clientIdInput" class="client-modal-input" inputmode="numeric" maxlength="4" placeholder="1–9999"><div id="clientIdPreview" class="client-modal-preview">—</div><div id="clientIdError" class="client-modal-error hidden"></div><div class="client-modal-actions"><button class="client-modal-btn secondary" data-id-close>Отмена</button><button class="client-modal-btn primary" data-id-apply>Применить</button></div></div><div id="idLink" class="hidden"><input id="clientIdSearch" class="client-modal-input" inputmode="numeric" maxlength="4" placeholder="Поиск существующего ID"><div id="existingClients" class="client-existing"></div><div class="client-modal-actions"><button class="client-modal-btn secondary" data-id-close>Отмена</button></div></div></div></div>`);
  }

  function renderExisting(q='') {
    const root = document.getElementById('existingClients');
    if (!root) return;
    const rows = profiles.filter(p => p.clientId && (!q || p.clientId.includes(q)));
    root.innerHTML = rows.length ? rows.map(p => `<div class="client-existing-row"><span>${esc(p.clientId)} · ${esc(fullName(p))}</span><button data-link-id="${esc(p.clientId)}">Выбрать</button></div>`).join('') : '<div class="client-existing-row">Нет доступных Client ID</div>';
  }

  function handleIdClick(e) {
    const mode = e.target.closest('[data-id-mode]')?.dataset.idMode;
    if (mode === 'assign') { document.getElementById('idChoice').classList.add('hidden');document.getElementById('idAssign').classList.remove('hidden');document.getElementById('clientIdInput').focus();return; }
    if (mode === 'link') { document.getElementById('idChoice').classList.add('hidden');document.getElementById('idLink').classList.remove('hidden');renderExisting();document.getElementById('clientIdSearch').focus();return; }
    if (e.target.closest('[data-id-close]')) { document.getElementById('clientIdModal')?.remove();return; }
    if (e.target.closest('[data-id-apply]')) {
      const n = Number(document.getElementById('clientIdInput').value);
      const error = document.getElementById('clientIdError');
      if (!Number.isInteger(n) || n < 1 || n > 9999) { error.textContent='Введите число от 1 до 9999.';error.classList.remove('hidden');return; }
      const id = String(n).padStart(4,'0');
      if (usedIds().has(id)) { error.textContent='Этот Client ID уже занят.';error.classList.remove('hidden');return; }
      current.clientId=id;save(profiles);document.getElementById('clientIdModal').remove();renderCard(current);return;
    }
    const link = e.target.closest('[data-link-id]');
    if (link) { current.clientId=link.dataset.linkId;save(profiles);document.getElementById('clientIdModal').remove();renderCard(current); }
  }

  document.addEventListener('click', e => {
    const management = e.target.closest('.management-folder');
    if (management) {
      const title = management.querySelector('b')?.textContent.trim();
      if (title === 'Клиенты') { e.preventDefault();e.stopImmediatePropagation();clientsScreen();return; }
    }
    const a = e.target.closest('[data-client-action]')?.dataset.clientAction;
    if (a) {
      e.preventDefault();
      if (a==='back') { location.reload();return; }
      if (a==='new') { current=newProfile();profiles.push(current);save(profiles);renderEdit();return; }
      if (a==='open') { current=profiles.find(p=>p.profileId===e.target.closest('[data-profile-id]')?.dataset.profileId);if(current)renderCard(current);return; }
      if (a==='id') { openIdModal();return; }
      if (a==='edit') { renderEdit();return; }
      if (a==='save-edit') { collectEdit();renderCard(current);return; }
      if (a==='cancel-edit') { renderCard(current);return; }
      if (a==='program') { alert('Интерфейс программ будет подключён к отдельной сущности программ.');return; }
    }
    const add = e.target.closest('[data-add]');
    if (add) { const type=add.dataset.add;current[type].push('');renderEdit();return; }
    const remove = e.target.closest('[data-remove]');
    if (remove) { const type=remove.dataset.remove;const i=Number(remove.dataset.index);current[type].splice(i,1);renderEdit();return; }
    if (document.getElementById('clientIdModal')) handleIdClick(e);
  }, true);

  document.addEventListener('input', e => {
    if (e.target.id==='clientIdInput') { const n=e.target.value.replace(/\D/g,'');e.target.value=n;document.getElementById('clientIdPreview').textContent=n?String(Number(n)).padStart(4,'0'):'—';document.getElementById('clientIdError').classList.add('hidden'); }
    if (e.target.id==='clientIdSearch') { e.target.value=e.target.value.replace(/\D/g,'');renderExisting(e.target.value); }
  });

  window.clients = clientsScreen;
})();