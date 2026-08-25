const readStorage=(key,fallback)=>{try{const raw=localStorage.getItem(key);return raw===null?fallback:JSON.parse(raw)}catch(e){try{localStorage.removeItem(key)}catch(_){}return fallback}};
const today=new Date();
const dateKey=(y,m,d)=>`${y}-${m+1}-${d}`;
const savedRules=readStorage('cobook_work_rules',{});
const savedProcedures=readStorage('cobook_procedures',[{name:'Женская стрижка',duration:60,price:''},{name:'Мужская стрижка',duration:45,price:''},{name:'Детская стрижка',duration:45,price:''}]);
const savedProducts=readStorage('cobook_products',[{name:'Шампунь',price:''},{name:'Кондиционер',price:''},{name:'Краска для волос',price:''}]);
const savedClients=readStorage('cobook_clients',[]);
const state={page:'maine',year:2026,month:7,selectedDates:new Set(),startTime:'10:00',endTime:'20:00',rules:savedRules||{},journalDate:dateKey(today.getFullYear(),today.getMonth(),today.getDate()),journalMode:'day',serviceMode:'procedures',procedures:Array.isArray(savedProcedures)?savedProcedures:[],products:Array.isArray(savedProducts)?savedProducts:[],clients:Array.isArray(savedClients)?savedClients:[],clientView:'list',selectedClientId:null};
const app=document.getElementById('app');
const navItems=[['journal','▤','Журнал'],['timetable','▦','График'],['maine','⌂','Главная'],['chat','◌','Чат'],['settings','⚙','Настройки']];
function nav(){return `<nav class="bottom">${navItems.map(([p,i,l])=>`<button class="nav" data-action="navigate" data-page="${p}" type="button"><span class="nav-icon">${i}</span><span>${l}</span></button>`).join('')}</nav>`}
function shell(c,plain=false){return `<div class="shell">${plain?'':`<header class="topbar"><div class="brand">CoBook</div><div class="subtitle">Кабинет мастера</div></header>`}<main class="content">${c}</main>${nav()}</div>`}
function minutesValue(t){const [h,m]=t.split(':').map(Number);return h*60+m}
window.CoBook={state,app,shell,nav,dateKey,minutesValue};
