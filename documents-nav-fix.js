// Documents navigation and settings integration.
function ensureDocumentsEntry(){
  const content=document.querySelector('#app .content');
  if(!content || content.querySelector('[data-page="documents"]')) return;
  const card=document.createElement('button');
  card.className='management-folder document-settings-entry';
  card.type='button';
  card.dataset.action='navigate';
  card.dataset.page='documents';
  card.innerHTML='<span class="management-folder-icon">▤</span><span><b>Документы</b><small>Согласия, политика и версии PDF</small></span><span class="management-chevron">›</span>';
  content.appendChild(card);
}

document.addEventListener('click',function(event){
  const target=event.target.closest('[data-action="navigate"]');
  if(!target) return;
  const page=target.dataset.page;
  if(page==='documents'){
    event.preventDefault();
    event.stopImmediatePropagation();
    if(typeof window.renderDocuments==='function') window.renderDocuments();
    return;
  }
  if(page==='settings') setTimeout(ensureDocumentsEntry,0);
},true);

window.ensureDocumentsEntry=ensureDocumentsEntry;
