(function(){
  const STORAGE={profile:'cobook_master_profile',master:'cobook_master',procedures:'cobook_procedures',products:'cobook_products',bookings:'cobook_bookings'};
  const read=(key,fallback)=>{try{const raw=localStorage.getItem(key);return raw===null?fallback:JSON.parse(raw)}catch(_){return fallback}};
  const write=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
  const id=(prefix)=>`${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
  function ensureProfile(){const profile=read(STORAGE.profile,null)||{};if(!profile.profile_id)profile.profile_id=id('profile');if(!Array.isArray(profile.contacts))profile.contacts=[];if(!Array.isArray(profile.identities))profile.identities=[];if(profile.data_source!=='api')profile.data_source='manual';write(STORAGE.profile,profile);return profile;}
  function ensureMaster(profile){const master=read(STORAGE.master,null)||{};if(!master.master_id)master.master_id=id('master');master.profile_id=profile.profile_id;write(STORAGE.master,master);return master;}
  function migrateCollection(key,prefix,normalize){const items=read(key,[]);if(!Array.isArray(items))return [];let changed=false;const normalized=items.map(item=>{const next=normalize({...item});if(!next[`${prefix}_id`]){next[`${prefix}_id`]=id(prefix);changed=true;}return next;});if(changed)write(key,normalized);return normalized;}
  const profile=ensureProfile();
  const master=ensureMaster(profile);
  const procedures=migrateCollection(STORAGE.procedures,'procedure',p=>{if(!['from','range','exact'].includes(p.priceType))p.priceType=p.priceTo?'range':(p.priceFrom||p.price?'exact':'exact');if(p.priceFrom==null&&p.price)p.priceFrom=p.price;if(p.priceTo==null)p.priceTo='';return p;});
  const products=migrateCollection(STORAGE.products,'product',p=>p);
  const bookings=migrateCollection(STORAGE.bookings,'booking',b=>b);
  window.CoBookDomain={storage:STORAGE,profile,master,procedures,products,bookings,ids:{profile:'profile_id',master:'master_id',procedure:'procedure_id',product:'product_id',booking:'booking_id'},identity:{findProfileIdByPhone(phone){const value=String(phone||'').replace(/\D/g,'');return profile.contacts.find(c=>String(c.value||'').replace(/\D/g,'')===value)?.profile_id||profile.profile_id;},findProfileIdByTelegram(telegramUserId){return profile.identities.find(i=>String(i.provider)==='telegram'&&String(i.external_user_id)===String(telegramUserId))?.profile_id||profile.profile_id;}}};
})();
