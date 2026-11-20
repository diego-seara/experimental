
(()=>{
const root=document.getElementById('demo');
const params=new URLSearchParams(window.location.search);
const researcherEnabled=params.get('research')==='1';
const validScenarios=['ok','warning','fraud'];
const initialScenario=validScenarios.includes(params.get('scenario'))?params.get('scenario'):'ok';
let showPanel=researcherEnabled;
let lastScreen=null;
let bootTimer=null,bootExitTimer=null;
const prefersReducedMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const SVG={mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',trend:'<path d="M3 18V6M3 18h18M7 14l4-4 3 3 5-7"/>',shopping:'<path d="M5 9h14l-1 12H6L5 9zM9 9V6a3 3 0 0 1 6 0v3"/>',piggy:'<path d="M5 9c-1-1-2-1-3-1v6h2c1 3 3 5 7 5h6l2 2v-4c2-2 3-4 3-6 0-5-4-8-10-8-4 0-7 2-8 5"/><circle cx="17" cy="8" r="1"/>',bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',check:'<path d="m5 12 4 4L19 6"/>',checkcircle:'<circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/>',send:'<path d="m5 12 7-7 7 7"/><path d="M12 5v14"/>',plus:'<path d="M12 5v14M5 12h14"/>',mic:'<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/>',wallet:'<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18"/><path d="M16 15h2"/>',card:'<rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 10h20"/>',chevron:'<path d="m9 18 6-6-6-6"/>',back:'<path d="m15 18-6-6 6-6"/>',right:'<path d="M5 12h14m-6-6 6 6-6 6"/>',swap:'<path d="M4 8h16m-5-5 5 5-5 5"/><path d="M20 16H4m5-5-5 5 5 5"/>',receipt:'<path d="M4 3h16v18l-4-2-4 2-4-2-4 2z"/><path d="M8 9h8M8 13h8"/>',home:'<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>',grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',list:'<path d="M9 6h12M9 12h12M9 18h12"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',eyeoff:'<path d="M3 3l18 18"/><path d="M10 5c5-1 10 4 12 7a16 16 0 0 1-4 4M7 7C4 9 2 12 2 12s4 7 10 7c1 0 2-.2 3-.5"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7h.01"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',sparkle:'<path d="m12 2 2.1 7.9L22 12l-7.9 2.1L12 22l-2.1-7.9L2 12l7.9-2.1z"/>',shield:'<path d="M12 2 4 6v6c0 6 4 9 8 10 4-1 8-4 8-10V6z"/><path d="m8 12 3 3 5-6"/>',building:'<path d="M3 10h18M5 10v9M10 10v9M14 10v9M19 10v9M3 20h18M12 3 3 8h18z"/>',phone:'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 1 1 5 2c-1 1-2 1.5-2 3M12 17h.01"/>',arrowup:'<path d="m7 14 5-5 5 5"/>',coffee:'<path d="M4 8h13v7a6 6 0 0 1-13 0z"/><path d="M17 9h2a3 3 0 0 1 0 6h-2M3 21h16"/>',unlock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0"/>'};
function topIcon(name){if(name==='eye')return `<svg class="top-icon" viewBox="0 0 32 32" fill="none" aria-hidden="true" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 19c3.2-5.1 7.5-7.7 13-7.7S25.8 13.9 29 19c-3.2 5.1-7.5 7.7-13 7.7S6.2 24.1 3 19z"/><circle cx="16" cy="19" r="4.1"/><path d="M16 3v5M5.3 6.8l3.3 3.5M26.7 6.8l-3.3 3.5"/></svg>`;if(name==='eyeoff')return `<svg class="top-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 19c3.2-5.1 7.5-7.7 13-7.7S25.8 13.9 29 19c-3.2 5.1-7.5 7.7-13 7.7S6.2 24.1 3 19z"/><circle cx="16" cy="19" r="4.1"/><path d="M16 3v5M5.3 6.8l3.3 3.5M26.7 6.8l-3.3 3.5M3 3l26 26"/></svg>`;if(name==='bell')return `<svg class="top-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 23h18c-2-2.3-2.3-4.9-2.3-10.3 0-4.3-2.8-7-6.7-7s-6.7 2.7-6.7 7C9.3 18.1 9 20.7 7 23zM13 27c.3 2.7 5.8 2.7 6 0"/></svg>`;if(name==='help')return `<svg class="top-icon help-solid" viewBox="0 0 32 32" aria-hidden="true"><path fill="#0069f7" d="M16 2C8.3 2 2 8.2 2 16c0 3.8 1.4 6.8 3.7 9.1L3.5 30l6.4-2.3a14 14 0 1 0 6.1-25.7z"/><path fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" d="M11.9 12a4.5 4.5 0 0 1 8.2 0c.5 2.4-1.8 3.3-3.8 4.9-.6.5-.8 1.2-.8 2"/><circle cx="15.7" cy="24" r="1.4" fill="#fff"/></svg>`;return icon(name,28)}
const BANK_PATHS={"pbcaae00": "M10.7295 3.11035C12.3194 3.25303 13.8192 3.85683 15.2227 4.82031L17.3516 2.25L18.5166 3.24121L16.4336 5.75781C16.6115 5.9119 16.7885 6.07098 16.9629 6.23633C17.6945 6.93018 18.3499 7.68136 18.9248 8.44629C19.0309 8.58748 19.1297 8.72334 19.2207 8.85156L19.4717 9.21484C19.5095 9.27138 19.5451 9.32641 19.5791 9.37891L19.7607 9.66895L20 10.0713L19.7793 10.4502L19.665 10.6387L19.5107 10.8779L19.3164 11.1631L19.084 11.4893C18.5281 12.252 17.8835 13.0146 17.1553 13.7285C15.0322 15.8096 12.6343 17.0752 9.99902 17.0752C7.36375 17.0752 4.96588 15.8096 2.84277 13.7285C2.11451 13.0146 1.46992 12.252 0.914062 11.4893C0.872235 11.4319 0.831625 11.3755 0.792969 11.3213L0.580078 11.0146L0.405273 10.752L0.270508 10.5381L0 10.0752L0.21875 9.7002L0.333008 9.51172L0.487305 9.27246L0.681641 8.9873L0.914062 8.66113C1.46991 7.89835 2.11451 7.13577 2.84277 6.42188C3.08357 6.18584 3.32836 5.96049 3.57617 5.74609L1.5 3.2373L2.66504 2.24609L4.78711 4.80957C6.16487 3.86599 7.63824 3.2693 9.2002 3.11621V0H10.7295V3.11035ZM9.99902 4.60938C7.86543 4.60938 5.83436 5.68173 3.9834 7.49609C3.32119 8.14527 2.73102 8.8434 2.22266 9.54102C2.13396 9.66274 2.05057 9.78066 1.97363 9.89258L1.85059 10.0742L1.97363 10.2578L2.09375 10.4297L2.22266 10.6094C2.73103 11.307 3.32119 12.0051 3.9834 12.6543C5.83431 14.4686 7.8655 15.541 9.99902 15.541C12.1325 15.541 14.1638 14.4685 16.0146 12.6543C16.6768 12.0051 17.267 11.307 17.7754 10.6094C17.8641 10.4877 17.9475 10.3697 18.0244 10.2578L18.1475 10.0732L18.0156 9.87988C17.9409 9.7716 17.8588 9.65533 17.7695 9.5332L17.6299 9.34473C17.104 8.64495 16.5048 7.95781 15.8408 7.32812C14.0317 5.6125 12.0621 4.60941 9.99902 4.60938ZM9.99902 6.14355C12.2592 6.14362 14.0917 7.90397 14.0918 10.0752C14.0916 12.2463 12.2592 14.0068 9.99902 14.0068C7.73883 14.0068 5.90644 12.2463 5.90625 10.0752C5.90631 7.90393 7.73875 6.14355 9.99902 6.14355ZM9.99902 7.67773C8.62082 7.67773 7.50299 8.75127 7.50293 10.0752C7.50312 11.399 8.6209 12.4727 9.99902 12.4727C11.3771 12.4726 12.4939 11.399 12.4941 10.0752C12.4941 8.75132 11.3772 7.6778 9.99902 7.67773Z", "p905a500": "M6 9C7.29116 9 8.66364 9.23408 10.0254 9.61914C11.1927 9.9486 12 11.0496 12 12.3047V14H0V12.3047C0 11.0495 0.807432 9.94841 1.97461 9.61914C3.33664 9.23399 4.70884 9 6 9ZM6 10C4.8066 10 3.51527 10.2194 2.22949 10.583C1.48442 10.7932 0.967773 11.4988 0.967773 12.3047V13H11.0322V12.3047C11.0322 11.5493 10.578 10.8827 9.90723 10.6289L9.76953 10.583C8.48421 10.2196 7.19324 10 6 10ZM6 0C7.8702 0.000237448 9.3877 1.5674 9.3877 3.5V4.09961C9.3877 6.03221 7.8702 7.59937 6 7.59961C4.12978 7.5994 2.61328 6.03222 2.61328 4.09961V3.5C2.61328 1.56739 4.12978 0.000211215 6 0ZM6 1C4.66428 1.00025 3.58105 2.11969 3.58105 3.5V4.09961C3.58105 5.47992 4.66428 6.59936 6 6.59961C7.33573 6.59937 8.41992 5.47992 8.41992 4.09961V3.5C8.41992 2.11969 7.33573 1.00024 6 1Z", "p354bb680": "M17.2002 0C18.7464 0.000105133 19.9999 1.25356 20 2.7998V13.2002C19.9999 14.7464 18.7464 15.9999 17.2002 16H2.7998C1.25356 15.9999 0.000105648 14.7464 0 13.2002V2.7998C0.000105519 1.25356 1.25356 0.000105519 2.7998 0H17.2002ZM1.6123 2.63086C1.6045 2.6861 1.59962 2.74242 1.59961 2.7998V13.2002C1.59971 13.8628 2.13722 14.4003 2.7998 14.4004H17.2002C17.8628 14.4003 18.4003 13.8628 18.4004 13.2002V2.7998C18.4004 2.74271 18.3944 2.68681 18.3867 2.63184L10 10.2725L1.6123 2.63086ZM10 8.1084L17.1445 1.59961H2.85645L10 8.1084Z", "p114f6400": "M10.516 18.9681C15.7539 18.9681 20 14.7219 20 9.48403C20 4.24615 15.7539 0 10.516 0C5.27808 0 1.03193 4.24615 1.03193 9.48403C1.03193 11.1441 1.45844 12.7045 2.20784 14.0617L0 19.1552L5.86866 17.7533C7.24202 18.5268 8.82746 18.9681 10.516 18.9681Z", "p3bc94c80": "M13.3142 4.90884C14.1468 6.25457 13.6607 7.83864 12.254 9.02927L11.8804 9.35362C11.2113 9.95337 10.9958 10.2769 10.9666 10.639L10.963 10.7305V11.4079H9.60812V10.7305C9.60812 9.75176 10.0641 9.10778 11.3787 7.9951C12.3226 7.19621 12.5923 6.31715 12.162 5.62163C11.7795 5.00337 10.4297 4.84254 9.18141 5.30725L8.94881 5.40175L8.32907 5.67532L7.78194 4.43584L8.40168 4.16228C10.2545 3.3444 12.4752 3.55263 13.3142 4.90884Z", "p73a3300": "M9.24825 14.4548C9.24825 13.8936 9.7032 13.4386 10.2644 13.4386C10.8256 13.4386 11.2805 13.8936 11.2805 14.4548C11.2805 15.016 10.8256 15.4709 10.2644 15.4709C9.7032 15.4709 9.24825 15.016 9.24825 14.4548Z", "p2826f300": "M20 7.80273L18.9316 9.03711L17.7832 8.14062V20H10.9463L10.9453 14.0098H9.05273L9.05371 20H2.2168V8.14062L1.06836 9.03711L0 7.80273L10 0L20 7.80273Z", "p16c2c640": "M10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0ZM10 1.59961C5.36081 1.59961 1.59961 5.36081 1.59961 10C1.59961 14.6392 5.36081 18.4004 10 18.4004C14.6392 18.4004 18.4004 14.6392 18.4004 10C18.4004 5.36081 14.6392 1.59961 10 1.59961ZM10.7998 9.2002H15.7998V10.7998H10.7998V15.7998H9.2002V10.7998H4.2002V9.2002H9.2002V4.2002H10.7998V9.2002Z"};
function bankGlyph(name,active=false){
  const blue='#006DFF', ink=active?'#000000':'#646464';
  if(name==='user')return `<svg viewBox="0 0 12 14" width="13" height="15" aria-hidden="true"><path fill="#646464" d="${BANK_PATHS.p905a500}"/></svg>`;
  if(name==='eye'||name==='eyeoff')return `<svg viewBox="0 0 20 17.0752" width="24" height="22" aria-hidden="true"><path fill="${blue}" d="${BANK_PATHS.pbcaae00}"/>${name==='eyeoff'?'<path d="M2 2L18 15" stroke="white" stroke-width="3"/><path d="M2 2L18 15" stroke="#006DFF" stroke-width="1.7"/>':''}</svg>`;
  if(name==='mail')return `<svg viewBox="0 0 20 16" width="24" height="22" aria-hidden="true"><path fill="${blue}" d="${BANK_PATHS.p354bb680}"/></svg>`;
  if(name==='help')return `<svg viewBox="0 0 20 19.1552" width="24" height="24" aria-hidden="true"><path fill="${blue}" d="${BANK_PATHS.p114f6400}"/><path fill="white" d="${BANK_PATHS.p3bc94c80}"/><path fill="white" d="${BANK_PATHS.p73a3300}"/></svg>`;
  if(name==='home')return `<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path fill="${ink}" d="${BANK_PATHS.p2826f300}"/></svg>`;
  if(name==='contract')return `<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path fill="${ink}" d="${BANK_PATHS.p16c2c640}"/></svg>`;
  return '';
}
function profileButton(){return `<button class="profile-entry" data-action="profile" aria-label="Abrir el perfil de Laura" title="Perfil de Laura"><span class="profile-ring">${bankGlyph('user')}</span><span class="profile-pink" aria-hidden="true"></span></button>`}
function icon(name,size=20){return `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${SVG[name]||SVG.info}</svg>`}
function esc(x){return String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
const fmt=n=>new Intl.NumberFormat('de-DE',{minimumFractionDigits:2,maximumFractionDigits:2}).format(n)+' €';
const state={screen:'home',topic:'',text:'',query:'',chatText:'',balanceVisible:true,stage:'form',form:{recipient:'',iban:'',amount:'',concept:''},formError:'',toast:'',detail:'cuenta',contract:'cuenta',priorScreen:'home',insight:initialScenario,coverDone:false,blockDone:false,mailRead:false,mailOpen:false};
const bal=state.balanceVisible?fmt(4285.50):'•••• €';
const movements=[['Mercadona','Hoy · Alimentación',-47.85,'wallet'],['Gasolinera','17 nov · Transporte',-43.40,'wallet'],['Suscripción','15 nov · Entretenimiento',-13.99,'card'],['Nómina','28 oct · Ingresos',1850.00,'building']];
// V7.2 · Una sola fuente de cifras. En «warning» la Cuenta Online no cubre la luz (64 € frente a 87 €: faltan 23 €);
// tras el traspaso pasan 23 € de Ahorro a la Cuenta Online. La previsión (1.850 € de nómina el 28 y 1.240 € de recibos)
// es la misma en todas las pantallas.
function money(){
 const warn=state.scenario==='warning', covered=warn&&(state.insight==='covered'||state.coverDone);
 const online=warn?(covered?87:64):3420.5, ahorro=covered?842:865;
 const onl=Math.round((online+(state.loan?state.loan.A:0))*100)/100;
 return {online:onl,ahorro,total:Math.round((onl+ahorro)*100)/100,card:326.8,luz:87,fibra:55.5,week:142.5,income:1850,bills:1240,warn,covered};
}
function status(){return `<div class="statusbar" aria-hidden="true"><span>9:41</span><span class="status-icons"><span class="signal"><i></i><i></i><i></i><i></i></span><span class="wifi"></span><span class="battery"></span></span></div>`}
function auraAvatar(size='normal'){return `<span class="aura-avatar ${size==='small'?'aura-small':''}" aria-hidden="true"><svg viewBox="0 0 40 40" fill="none"><path d="M9.5 21.8c3.1-7.2 8.6-12.5 17.3-12.1" stroke="white" stroke-width="3.6" stroke-linecap="round" opacity=".95"/><path d="M12.3 29.2c6.1 1.8 12.8-1.6 17.4-9.2" stroke="white" stroke-width="4" stroke-linecap="round" opacity=".94"/><circle cx="21" cy="20" r="3.6" fill="white" opacity=".85"/></svg></span>`}
function brand(){return `<header class="brandbar">${profileButton()}<div class="header-tools"><button class="iconbtn" data-action="privacy" aria-label="${state.balanceVisible?'Ocultar':'Mostrar'} importes" title="${state.balanceVisible?'Ocultar':'Mostrar'} importes">${bankGlyph(state.balanceVisible?'eye':'eyeoff')}</button><button class="iconbtn" data-action="alerts" aria-label="Buzón" title="Buzón">${bankGlyph('mail')}${!state.mailRead?'<span class="notification-pink" aria-hidden="true"></span>':''}</button><button class="iconbtn" data-action="help" aria-label="Ayuda" title="Centro de ayuda">${bankGlyph('help')}</button></div></header>`}
const TAB_OF={home:'home',forecast:'home',money:'money',products:'products',detail:'products',mortgage:'products',loan:'products',contract:'contract','contract-detail':'contract'};
function nav(){const cur=TAB_OF[state.screen];let items=[['home','Inicio','home'],['money','Mi dinero','trend'],['products','Productos','grid'],['contract','Contratar','contract']];return `<nav class="bottomnav" aria-label="Navegación principal">${items.map(([id,t,i])=>`<button class="nav-item" data-action="nav-${id}" ${cur===id?'aria-current="page"':''}><span class="nav-active-line"></span><span class="nav-icon">${i==='home'||i==='contract'?bankGlyph(i,cur===id):icon(i,20)}</span><span>${t}</span></button>`).join('')}</nav>`}
function backOnly(){return `<header class="backbar backbar-slim"><button class="iconbtn" data-action="back" aria-label="Volver">${icon('back')}</button></header>`}
const ASK_PLACEHOLDER={money:'Pregunta sobre tu dinero…',products:'Pregunta sobre tus productos…',contract:'Pregunta antes de contratar…',forecast:'Pregunta sobre tu previsión…','contract-detail':'Pregunta sobre este producto…',mortgage:'Pregunta sobre tu hipoteca…'};
function askDock(){const ph=state.screen==='detail'?(state.detail==='card'?'Pregunta sobre esta tarjeta…':'Pregunta sobre esta cuenta…'):(ASK_PLACEHOLDER[state.screen]||'Pregúntanos o pídenos algo…');return `<div class="ask-dock"><div class="ask-box"><label class="visually-hidden" for="dock-prompt">Escribe lo que necesitas</label><input id="dock-prompt" name="query" type="text" enterkeyhint="send" autocomplete="off" placeholder="${ph}" value="${esc(state.query)}" /><button class="prompt-round" data-action="mic" aria-label="Dictado de voz">${icon('mic',19)}</button><button class="send" data-action="send-home" aria-label="Enviar mensaje">${icon('send',19)}</button></div></div>`}
function chatHeader(){return `<header class="backbar chatbar"><button class="iconbtn" data-action="back" aria-label="Volver">${icon('back')}</button><div class="chat-identity">${assistantDisc()}<span class="chat-identity-text"><strong>Asistente digital</strong><small>En línea</small></span></div><span class="bar-spacer" aria-hidden="true"></span></header>`}
// V7.5 · Avatar del Asistente digital como en el proto de Make: disco azul de marca con destello de cuatro puntas.
function assistantDisc(){return `<span class="assistant-disc" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 1C12.5 8 16 11.5 23 12 16 12.5 12.5 16 12 23 11.5 16 8 12.5 1 12 8 11.5 11.5 8 12 1Z" fill="currentColor"/><path d="M19.4 3.2c.1 1.4.6 1.9 2 2-1.4.1-1.9.6-2 2-.1-1.4-.6-1.9-2-2 1.4-.1 1.9-.6 2-2Z" fill="currentColor" opacity=".9"/></svg></span>`}
function headerBack(title,subtitle=''){return `<header class="backbar"><button class="iconbtn" data-action="back" aria-label="Volver">${icon('back')}</button><div class="heading">${title}${subtitle?`<small>${subtitle}</small>`:''}</div><span class="bar-spacer" aria-hidden="true"></span></header>`}
const PILLS_DIRECT=params.get('pills')==='directo';
const PILL_TEXT={bizum:'Quiero enviar un Bizum a ',transfer:'Quiero hacer una transferencia a ',balance:'¿Cuánto dinero tengo?',payments:'¿Qué pagos tengo próximamente?'};
function pill(label,topic,i){return `<button class="pill" data-action="${PILLS_DIRECT?'journey-':'fill-'}${topic}">${icon(i,15)}${label}</button>`}
function insightBlock(){const v=state.insight;if(v==='warning')return `<div class="hero-insight warn" aria-live="polite"><p><span class="insight-indicator"></span>El jueves te pasan la luz (87&nbsp;€) y te faltan 23&nbsp;€.</p><div class="insight-action-row"><button class="insight-text-link" data-action="cover">Cubrirlo desde Ahorro ${icon('right',17)}</button></div></div>`;if(v==='fraud')return `<div class="hero-insight danger" aria-live="polite"><p><span class="insight-indicator"></span>Hemos retenido un pago de 349 € en tienda-online.xyz. ¿Lo has hecho tú?</p><div class="insight-action-row"><button class="insight-danger-primary" data-action="fraud-block">No, bloquear tarjeta</button><button class="insight-danger-secondary" data-action="fraud-legit">Sí, he sido yo</button></div></div>`;if(v==='covered')return `<div class="hero-insight" aria-live="polite"><p><span class="insight-indicator"></span>El recibo de la luz ya está cubierto.</p><div class="insight-action-row"><button class="insight-text-link" data-action="nav-money">Ver mis cuentas ${icon('right',17)}</button></div></div>`;if(v==='blocked')return `<div class="hero-insight" aria-live="polite"><p><span class="insight-indicator"></span>Tu tarjeta está bloqueada por seguridad.</p><div class="insight-action-row"><button class="insight-text-link" data-action="nav-products">Ver tarjeta ${icon('right',17)}</button></div></div>`;if(v==='verified')return `<div class="hero-insight" aria-live="polite"><p><span class="insight-indicator"></span>Has confirmado que reconoces el pago.</p></div>`;return `<div class="hero-insight" aria-live="polite"><p>Todo en orden. Hasta el día 30 entran 1.850 € y salen 1.240 € en recibos.</p><button class="insight-disclaimer" data-action="forecast">Es una previsión</button></div>`}
function home(){return `${brand()}<main class="main home-main" id="scroller"><section class="context-panel"><h1 class="hello">Hola, Laura</h1>${insightBlock()}</section><section class="conversation-panel"><div class="prompt-block"><h2 class="prompt-title">¿Cómo te podemos ayudar?</h2><div class="prompt"><label class="visually-hidden" for="home-prompt">Escribe lo que necesitas</label><textarea id="home-prompt" name="query" placeholder="Pregúntanos o pídenos algo…" rows="2">${esc(state.query)}</textarea><div class="prompt-actions"><div class="prompt-left"><button class="prompt-round" data-action="more-ideas" aria-label="Ver opciones">${icon('plus',19)}</button><button class="prompt-round" data-action="mic" aria-label="Dictado de voz">${icon('mic',19)}</button></div><button class="send" data-action="send-home" aria-label="Enviar mensaje">${icon('send',19)}</button></div></div><div class="actions-label">También puedes empezar por aquí</div><div class="quick-pills">${pill('Enviar un Bizum','bizum','phone')}${pill('Hacer transferencia','transfer','swap')}${pill('Consultar mi saldo','balance','wallet')}${pill('Próximos pagos','payments','calendar')}</div></div></section><section class="products-panel"><div class="section-head"><h2>Tus productos</h2><button class="textlink" data-action="nav-products">Ver todos ${icon('chevron',15)}</button></div><div class="products-home"><button class="product-tile" data-action="detail-account"><div class="tile-meta"><span class="tile-account-icon">${icon('wallet',20)}</span>${icon('chevron',15)}</div><div><div class="tile-title"><span class="account-dot"></span>Cuentas</div><div class="tile-money ${!state.balanceVisible?'hidden-money':''}">${state.balanceVisible?fmt(money().total):'•••• €'}</div></div><div class="tile-meta">2 cuentas</div></button><button class="product-tile" data-action="detail-card"><div class="tile-meta"><span class="tile-account-icon">${icon('card',20)}</span>${icon('chevron',15)}</div><div><div class="tile-title"><span class="account-dot"></span>Tarjetas</div><div class="tile-money ${!state.balanceVisible?'hidden-money':''}">${state.balanceVisible?fmt(money().card):'•••• €'}</div></div><div class="tile-meta">Gastado este mes</div></button></div></section></main>${nav()}`}
function balancePanel(){const m=money();return `<div class="answer-panel"><div class="answer-eyebrow">Saldo total de tus cuentas</div><div class="answer-total">${state.balanceVisible?fmt(m.total):'•••• €'}</div><div class="mini-row"><span>Cuenta Online <span class="mini-sub">Terminada en 1048</span></span><strong>${state.balanceVisible?fmt(m.online):'•••• €'}</strong></div><div class="mini-row"><span>Cuenta ahorro <span class="mini-sub">Terminada en 3291</span></span><strong>${state.balanceVisible?fmt(m.ahorro):'•••• €'}</strong></div></div><div class="inline-actions"><button class="inline-button" data-action="detail-account">Ver cuentas</button><button class="inline-button" data-action="journey-payments">Próximos pagos</button></div>`}
function paymentPanel(){const m=money();return `<div class="answer-panel"><div class="answer-eyebrow">Próximos 7 días</div><div class="answer-total">${fmt(m.week)}</div><div class="mini-row"><span>Fibra y móvil<span class="mini-sub">24 de noviembre</span></span><strong>${fmt(m.fibra)}</strong></div><div class="mini-row"><span>Recibo de la luz<span class="mini-sub">Jueves, 26 de noviembre${m.warn&&!m.covered?' · te faltan 23 €':''}</span></span><strong>${fmt(m.luz)}</strong></div></div><div class="inline-actions">${m.warn&&!m.covered?'<button class="inline-button" data-action="cover">Cubrir la luz desde Ahorro</button>':''}<button class="inline-button" data-action="journey-spending">¿Me puedo permitir un gasto?</button><button class="inline-button" data-action="journey-balance">Ver saldos</button></div>`}
function spendingPanel(){const m=money(),rest=Math.round((m.total-m.week-500)*100)/100,onlineRest=Math.round((m.online-m.week-500)*100)/100;const note=onlineRest>=0?'Con los movimientos previstos, este gasto no dejaría tus cuentas en negativo. No incluye gastos que no estén registrados.':rest>=0?'Contando tu ahorro te llegaría, pero tu Cuenta Online se quedaría en negativo: tendrías que traspasar dinero desde Ahorro antes. No incluye gastos que no estén registrados.':'Con los movimientos previstos, este gasto dejaría tus cuentas en negativo. No incluye gastos que no estén registrados.';return `<div class="answer-panel"><div class="answer-eyebrow">Estimación orientativa</div><div class="mini-row"><span>Saldo en tus cuentas</span><strong>${fmt(m.total)}</strong></div><div class="mini-row"><span>Recibos previstos (7 días)</span><strong>−${fmt(m.week)}</strong></div><div class="mini-row"><span>Si gastas 500 €</span><strong>−500,00 €</strong></div><div class="mini-row"><span><strong>Saldo restante estimado</strong></span><strong>${rest<0?'−':''}${fmt(Math.abs(rest))}</strong></div></div><div class="cash-note" style="margin-top:11px">${note}</div><div class="inline-actions"><button class="inline-button" data-action="journey-payments">Ver próximos recibos</button><button class="inline-button" data-action="journey-transfer">Transferir dinero</button></div>`}
function cardsPanel(){return `<div class="answer-panel"><div class="answer-eyebrow">Tarjeta de débito ···· 4821</div><div class="answer-total">326,80 €</div><div style="font-size:12px;color:#667688">Gastado este mes</div><div class="mini-row"><span>Último movimiento<span class="mini-sub">Mercadona · hoy</span></span><strong>47,85 €</strong></div></div><div class="inline-actions"><button class="inline-button" data-action="detail-card">Ver tarjeta</button><button class="inline-button" data-action="nav-movements">Ver movimientos</button></div>`}
function flowForm(){let transfer=state.topic==='transfer';return `<div class="form-card"><h3 class="form-title">${transfer?'Preparar transferencia':'Preparar Bizum'}</h3><p class="form-desc">${transfer?'Completa los datos de destino y el importe.':'Dime a quién quieres enviar el dinero y cuánto.'}</p><div class="field"><label for="recipient">${transfer?'Beneficiario':'Nombre o teléfono'}</label><input id="recipient" name="recipient" placeholder="${transfer?'Nombre del beneficiario':'Ej. Paula o 600 000 000'}" value="${esc(state.form.recipient)}" autocomplete="off" /></div>${transfer?`<div class="field"><label for="iban">IBAN de destino</label><input id="iban" name="iban" placeholder="ES00 0000 0000 0000 0000 0000" value="${esc(state.form.iban)}" autocomplete="off" /></div>`:''}<div class="field"><label for="amount">Importe</label><div class="input-prefix"><input id="amount" name="amount" inputmode="decimal" placeholder="0,00" value="${esc(state.form.amount)}" autocomplete="off" /></div></div><div class="field"><label for="concept">Concepto <span style="font-weight:400;color:#8490a0">(opcional)</span></label><input id="concept" name="concept" placeholder="¿Para qué es?" value="${esc(state.form.concept)}" autocomplete="off" /></div>${state.formError?`<div class="form-error" role="alert">${esc(state.formError)}</div>`:''}<button class="button-primary" data-action="review">Continuar</button></div>`}
function flowReview(){const t=state.topic==='transfer', amount=parseAmount(state.form.amount);return `<div class="form-card"><h3 class="form-title">Revisa la operación</h3><div class="review-amount">${fmt(amount)}</div><div class="review-details"><div class="mini-row"><span>${t?'Beneficiario':'Destinatario'}</span><strong>${esc(state.form.recipient)}</strong></div>${t?`<div class="mini-row"><span>Cuenta de destino</span><strong>${esc(state.form.iban)}</strong></div>`:''}<div class="mini-row"><span>Origen</span><strong>Cuenta Online ····1048</strong></div>${state.form.concept?`<div class="mini-row"><span>Concepto</span><strong>${esc(state.form.concept)}</strong></div>`:''}</div><button class="button-primary" data-action="confirm">Confirmar operación</button><button class="button-secondary" data-action="edit">Editar datos</button></div>`}
function flowSuccess(){return `<div class="form-card"><div class="success-symbol">${icon('check',29)}</div><h3 class="success-title">${state.topic==='bizum'?'Bizum enviado':'Transferencia realizada'}</h3><p class="success-desc">Importe: ${fmt(parseAmount(state.form.amount))} · Destinatario: ${esc(state.form.recipient)}.</p><button class="button-primary" data-action="nav-home">Volver al inicio</button><button class="button-secondary" data-action="new-operation">Hacer otra operación</button></div>`}
const texts={mortgage:['¿Cómo va mi hipoteca?',''],loan:['Necesito un préstamo',''],preapproved:['¿Por qué tengo un préstamo preaprobado?',''],security:['No reconozco un pago',''],cover:['Quiero cubrir el recibo de la luz',''],month:['¿Me llega a fin de mes?',''],human:['Quiero hablar con una persona',''],balance:['¿Cuánto dinero tengo?','Ahora mismo tienes <strong>4.285,50 €</strong> entre tus dos cuentas. Aquí tienes el detalle.'],payments:['¿Qué pagos tengo próximamente?','Tienes <strong>2 cargos previstos</strong> durante los próximos siete días, por un total de <strong>185,40 €</strong>.'],spending:['¿Puedo gastar 500 € este fin de semana?','Podemos hacer una estimación con tu saldo y los pagos que tenemos previstos.'],cards:['Quiero ver mis tarjetas','Tienes una tarjeta activa. Te muestro su gasto de este mes.'],bizum:['Quiero enviar un Bizum','Perfecto. Podemos prepararlo aquí sin tener que buscar la opción en el menú.'],transfer:['Quiero hacer una transferencia','Te ayudo a prepararla. Solo necesito algunos datos.'],other:['Necesito ayuda con mi dinero','Eso todavía no sé hacerlo en esta versión. Puedo consultar tus saldos y próximos pagos, preparar un Bizum o una transferencia, revisar tu tarjeta o pasarte con una persona.']};
// V7.2 · Respuestas que dependen del escenario y de los datos
function topicText(topic){
 if(topic==='mortgage')return 'Repasamos tu hipoteca.';
 if(topic==='loan')return 'Vimos tu préstamo preaprobado.';
 if(topic==='preapproved')return 'Te expliqué por qué tienes un préstamo preaprobado.';
 const m=money(),ins=state.insight;
 if(topic==='balance')return `Ahora mismo tienes <strong>${fmt(m.total)}</strong> entre tus dos cuentas. Aquí tienes el detalle.`;
 if(topic==='payments')return `Tienes <strong>2 cargos previstos</strong> durante los próximos siete días, por un total de <strong>${fmt(m.week)}</strong>.`+(m.warn&&!m.covered?' Con lo que tienes en tu Cuenta Online no llegas a cubrir la luz.':'');
 if(topic==='security'){
  if(ins==='fraud')return 'Tienes un pago <strong>retenido de 349,00 €</strong> en tienda-online.xyz con tu tarjeta ···· 4821. Si no lo reconoces, puedes bloquear la tarjeta ahora. El bloqueo es temporal.';
  if(ins==='blocked')return 'Tu tarjeta ···· 4821 ya está <strong>bloqueada por seguridad</strong>.';
  return 'Tu tarjeta ···· 4821 está activa y no vemos pagos retenidos. Si la has perdido o no reconoces un cargo, te pasamos con una persona del equipo de seguridad.';
 }
 if(topic==='cover'){
  if(m.covered)return 'El recibo de la luz <strong>ya está cubierto</strong>.';
  if(m.warn)return 'El jueves te pasan el recibo de la luz (<strong>87 €</strong>) y en tu Cuenta Online tienes 64 €: te faltan <strong>23 €</strong>.';
  return 'Tu Cuenta Online cubre los recibos previstos de los próximos siete días.';
 }
 if(topic==='month'){
  if(m.warn&&!m.covered)return 'Contando la nómina del día 28, el mes cierra en positivo. Pero ojo: el jueves te pasan la luz y en tu Cuenta Online te faltan 23 €.';
  return 'Si se cumple lo previsto, sí: hasta el día 30 entran <strong>1.850 €</strong> y salen <strong>1.240 €</strong> en recibos.';
 }
 if(topic==='human')return 'Te paso con una persona del equipo. Le llegará lo que has escrito para que no tengas que repetirlo.';
 return (texts[topic]||texts.other)[1];
}
function securityPanel(){const ins=state.insight;
 if(ins==='fraud')return `<div class="answer-panel"><div class="mini-row" style="border:0"><span>Comercio</span><strong>tienda-online.xyz</strong></div><div class="mini-row"><span>Importe</span><strong>349,00 €</strong></div><div class="mini-row"><span>Estado</span><strong style="color:#af281d">Retenido</strong></div></div><div class="insight-action-row"><button class="insight-danger-primary" data-action="fraud-block">No lo reconozco, bloquear</button><button class="insight-danger-secondary" data-action="fraud-legit">Sí, he sido yo</button></div><div class="inline-actions"><button class="inline-button" data-action="journey-human">Hablar con una persona</button></div>`;
 return `<div class="inline-actions">${ins==='blocked'?'':'<button class="inline-button" data-action="journey-human">Hablar con una persona</button>'}<button class="inline-button" data-action="detail-card">Ver tarjeta</button></div>`;
}
function coverPanel(){const m=money();
 if(m.warn&&!m.covered)return `<div class="answer-panel"><div class="mini-row" style="border:0"><span>Desde</span><strong>Cuenta ahorro ···· 3291</strong></div><div class="mini-row"><span>Hasta</span><strong>Cuenta Online ···· 1048</strong></div><div class="mini-row"><span>Importe</span><strong>23,00 €</strong></div></div><div class="inline-actions"><button class="inline-button" data-action="cover">Revisar el traspaso</button><button class="inline-button" data-action="journey-payments">Ver próximos pagos</button></div>`;
 return `<div class="inline-actions"><button class="inline-button" data-action="journey-payments">Ver próximos pagos</button><button class="inline-button" data-action="journey-balance">Ver saldos</button></div>`;
}
function monthPanel(){return `<div class="answer-panel"><div class="answer-eyebrow">Previsión hasta el día 30</div><div class="mini-row"><span>Ingresos previstos<span class="mini-sub">Nómina · 28 de noviembre</span></span><strong>+1.850,00 €</strong></div><div class="mini-row"><span>Recibos previstos</span><strong>−1.240,00 €</strong></div><div class="mini-row"><span>Diferencia prevista</span><strong style="color:#16835f">+610,00 €</strong></div></div><div class="cash-note" style="margin-top:11px">Es una previsión: puede cambiar si aparecen nuevos movimientos.</div><div class="inline-actions">${money().warn&&!money().covered?'<button class="inline-button" data-action="cover">Cubrir la luz desde Ahorro</button>':''}<button class="inline-button" data-action="journey-payments">Ver próximos pagos</button></div>`}
function humanPanel(){return `<div class="answer-panel"><div class="answer-eyebrow">Atención personal</div><p style="margin:8px 0 0;font-size:13px;line-height:1.5;color:#344054">Esta parte no está disponible en la prueba. Hemos registrado que querías hablar con una persona: gracias, nos ayuda mucho.</p></div><div class="inline-actions"><button class="inline-button" data-action="nav-home">Volver al inicio</button></div>`}
// ═══ V7.6 · Hipoteca, préstamo preaprobado y guiones del chat ═══
// Una sola fuente de cifras: todo lo que se ve (productos, páginas, simuladores y chat) sale de estas funciones.
const r2=x=>Math.round(x*100)/100;
const pct=(x,d=2)=>Number(x).toFixed(d).replace('.',',')+' %';
const MONTHS_ES=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
function monthFrom(offset){const t=2026*12+11+offset;return `${MONTHS_ES[t%12]} de ${Math.floor(t/12)}`}
function yearsMonths(n){const y=Math.floor(n/12),m=n%12;return [y?`${y} ${y===1?'año':'años'}`:'',m?`${m} ${m===1?'mes':'meses'}`:''].filter(Boolean).join(' y ')||'menos de un mes'}
function annuity(P,annual,n){const r=annual/1200;return P*r/(1-Math.pow(1+r,-n))}
function monthsFor(P,annual,c){const r=annual/1200;return Math.ceil(-Math.log(1-P*r/c)/Math.log(1+r))}
function normq(q){return String(q||'').toLocaleLowerCase('es').normalize('NFD').replace(/[̀-ͯ]/g,'')}

// Hipoteca: 180.000 € a 30 años al 2,45 % fijo, firmada en agosto de 2018; lleva 104 cuotas pagadas (quedan 256, la próxima el 1 de diciembre).
const MORTGAGE_BASE={name:'Hipoteca Vivienda Fija',digits:'7720',tin:2.45,inicial:180000,total:360,paid:104,feeRate:0.02};
function mortgage(){
 const m=MORTGAGE_BASE,r=m.tin/1200,cuota=r2(annuity(m.inicial,m.tin,m.total)),g=Math.pow(1+r,m.paid);
 const pendiente=r2(m.inicial*g-cuota*(g-1)/r),n=m.total-m.paid,devuelto=r2(m.inicial-pendiente);
 return {...m,cuota,pendiente,n,devuelto,paidPct:devuelto/m.inicial*100,end:monthFrom(n-1),interestLeft:r2(cuota*n-pendiente)};
}
function amortSim(A,mode){
 const m=mortgage(),P2=r2(m.pendiente-A),fee=r2(A*m.feeRate);
 if(mode==='plazo'){const n2=monthsFor(P2,m.tin,m.cuota),saved=r2(m.interestLeft-(m.cuota*n2-P2));return {mode,A,fee,P2,cuota:m.cuota,n:n2,less:m.n-n2,end:monthFrom(n2-1),saved}}
 const c2=r2(annuity(P2,m.tin,m.n)),saved=r2(m.interestLeft-(c2*m.n-P2));
 return {mode:'cuota',A,fee,P2,cuota:c2,diff:r2(m.cuota-c2),n:m.n,end:m.end,saved};
}
// Préstamo preaprobado: hasta 12.000 €, 6,95 % TIN, sin comisiones (TAE calculada), válido hasta el 31 de diciembre.
const LOAN={max:12000,min:1000,tin:6.95,validUntil:'31 de diciembre',plazos:[24,36,48,60,72,84],digits:'5512',firstDue:'5 de enero de 2027'};
const loanTae=()=>(Math.pow(1+LOAN.tin/1200,12)-1)*100;
function loanSim(A,n){const c=r2(annuity(A,LOAN.tin,n)),total=r2(c*n);return {A,n,cuota:c,total,interest:r2(total-A),share:c/money().income*100}}
function parseEuros(t){
 const s=normq(t).replace(/\s+/g,' ');let m=s.match(/(\d+(?:[.,]\d+)?)\s*(mil\b|k\b)/);
 if(m)return Math.round(parseFloat(m[1].replace(',','.'))*1000);
 m=s.match(/(\d{1,3}(?:\.\d{3})+|\d+)(?:,\d{1,2})?(?!\s*(meses|mes|anos|ano|%))/);
 return m?Number(m[1].replace(/\./g,'')):null;
}
function monthsIn(t){const m=normq(t).match(/(\d{1,3})\s*meses|(\d{1,2})\s*anos?/);if(!m)return null;return m[1]?Number(m[1]):Number(m[2])*12}
function purposeOf(t){const s=normq(t);if(/coche|moto|vehiculo/.test(s))return 'coche';if(/reforma|obra|cocina|bano/.test(s))return 'reforma';if(/imprevist|urgenc|averia|dentista|medic|arreglo/.test(s))return 'imprevisto';if(/viaje|vacacion/.test(s))return 'viaje';if(/estudi|master|curso/.test(s))return 'estudios';return null}
const PURPOSE_LABEL={coche:'un coche',reforma:'una reforma',imprevisto:'un imprevisto',viaje:'un viaje',estudios:'tus estudios',otro:'lo que necesitas'};
function movesNow(){return state.loan?[['Préstamo personal','Hoy · Ingreso',state.loan.A,'building'],...movements]:movements}
const hide=x=>state.balanceVisible?fmt(x):'•••• €';
function progressBar(p,label){return `<div class="progress" role="img" aria-label="${label}"><span style="width:${Math.min(100,Math.max(0,p)).toFixed(1)}%"></span></div>`}

// ── Páginas: hipoteca ──
function mortgagePage(){const m=mortgage(),ad=state.amortDone;return `${headerBack('Tu hipoteca','Terminada en '+m.digits)}<main class="main" id="scroller"><div class="page-content">
<div class="account-hero"><small>Capital pendiente</small><strong>${hide(m.pendiente)}</strong><span>de ${fmt(m.inicial)} · llevas devuelto el ${pct(m.paidPct,1)}</span>${progressBar(m.paidPct,'Devuelto el '+pct(m.paidPct,1))}</div>
${ad?`<div class="cash-note" style="margin-top:12px">Amortización programada para el 1 de diciembre: ${fmt(ad.A)}. ${ad.mode==='plazo'?`Terminarías en ${ad.end}.`:`Tu nueva cuota será de ${fmt(ad.cuota)}.`}</div>`:''}
<div class="review-details" style="margin-top:16px"><div class="mini-row"><span>Cuota mensual</span><strong>${fmt(m.cuota)}</strong></div><div class="mini-row"><span>Próxima cuota<span class="mini-sub">Se carga en tu Cuenta Online</span></span><strong>1 de diciembre</strong></div><div class="mini-row"><span>Tipo de interés</span><strong>${pct(m.tin)} TIN fijo</strong></div><div class="mini-row"><span>Plazo restante<span class="mini-sub">${m.n} cuotas</span></span><strong>${yearsMonths(m.n)}</strong></div><div class="mini-row"><span>Última cuota</span><strong>${m.end}</strong></div></div>
<div class="action-grid" style="margin-top:16px"><button class="action-card" data-action="amort-start">${icon('trend',21)}Simular amortización</button><button class="action-card" data-action="journey-mortgage">${icon('sparkle',21)}Preguntar al asistente</button></div>
<h2 class="page-heading-small">Últimas cuotas</h2>${['1 nov','1 oct','1 sep'].map(d=>`<div class="movement"><div class="movement-icon">${icon('building',17)}</div><div class="movement-name">Cuota hipoteca<small>${d} · Cuenta Online</small></div><div class="movement-value">−${hide(m.cuota)}</div></div>`).join('')}
</div></main>${nav()}`}
function amortResult(){
 const s=state.sim,m=mortgage(),A=parseAmount(s.amort),online=money().online;
 if(!Number.isFinite(A)||A<1000)return `<div class="notice-strip" style="margin-top:16px">Escribe un importe de al menos 1.000 €.</div>`;
 if(A>online)return `<div class="form-error" style="margin-top:16px">En tu Cuenta Online tienes ${fmt(online)}. Elige un importe menor o traspasa antes desde otra cuenta.</div>`;
 if(A>m.pendiente-1000)return `<div class="form-error" style="margin-top:16px">Ese importe supera lo que te queda por pagar.</div>`;
 const r=amortSim(A,s.mode),o=amortSim(A,s.mode==='plazo'?'cuota':'plazo'),left=r2(online-A-r.fee);
 return `<div class="answer-panel"><div class="answer-eyebrow">${r.mode==='plazo'?'Acabarías antes':'Pagarías menos cada mes'}</div><div class="answer-total">${r.mode==='plazo'?`${yearsMonths(r.less)} antes`:`${fmt(r.cuota)} al mes`}</div>${r.mode==='plazo'?`<div class="mini-row"><span>Última cuota</span><strong>${r.end}</strong></div><div class="mini-row"><span>Cuota</span><strong>${fmt(r.cuota)} (la misma)</strong></div>`:`<div class="mini-row"><span>Cuota actual → nueva</span><strong>${fmt(m.cuota)} → ${fmt(r.cuota)}</strong></div><div class="mini-row"><span>Pagas menos al mes</span><strong>${fmt(r.diff)}</strong></div>`}<div class="mini-row"><span>Intereses que te ahorras<span class="mini-sub">Estimación con tu tipo fijo</span></span><strong style="color:#16835f">${fmt(r.saved)}</strong></div><div class="mini-row"><span>Compensación por amortizar<span class="mini-sub">2 % del importe: máximo legal en los 10 primeros años</span></span><strong>${fmt(r.fee)}</strong></div></div>
 <p class="sim-compare">${r.mode==='plazo'?`Si prefieres reducir cuota, pagarías ${fmt(o.cuota)} al mes y te ahorrarías ${fmt(o.saved)} en intereses.`:`Si prefieres reducir plazo, terminarías ${yearsMonths(o.less)} antes y te ahorrarías ${fmt(o.saved)} en intereses.`}</p>
 ${left<money().bills?`<div class="notice-strip" style="margin-top:12px">Ojo: te quedarían ${fmt(Math.max(left,0))} en tu Cuenta Online, menos de lo que suman tus recibos de un mes (${fmt(money().bills)}).</div>`:''}
 <p class="insight-disclaimer" style="margin-top:8px">Es una simulación. La cifra definitiva aparece antes de confirmar.</p>`;
}
function amortPage(){const s=state.sim;return `${headerBack('Amortizar hipoteca','Simulación')}<main class="main" id="scroller"><div class="page-content"><div class="flow-kicker">Simulación sin compromiso</div><h1 class="simulation-title">¿Cuánto quieres adelantar?</h1><p class="simulation-subtitle">Saldría de tu Cuenta Online (${hide(money().online)}) y se aplicaría con la cuota del 1 de diciembre.</p>
<div class="field"><label for="sim-amort">Importe a amortizar</label><div class="input-prefix"><input id="sim-amort" name="simAmort" inputmode="decimal" autocomplete="off" value="${esc(s.amort)}"/></div></div>
<div class="choice-chips" style="margin-top:12px">${[1000,2000,3000].map(v=>`<button class="choice-chip" aria-pressed="${parseAmount(s.amort)===v}" data-action="amort-amt-${v}">${fmt(v).replace(',00','')}</button>`).join('')}</div>
<div class="seg" role="radiogroup" aria-label="Qué quieres reducir"><button class="seg-btn" role="radio" aria-checked="${s.mode!=='plazo'}" data-action="mode-cuota">Reducir cuota</button><button class="seg-btn" role="radio" aria-checked="${s.mode==='plazo'}" data-action="mode-plazo">Reducir plazo</button></div>
<div id="sim-result" aria-live="polite">${amortResult()}</div>
<button class="button-primary" data-action="amort-review">Revisar solicitud</button><button class="button-secondary" data-action="journey-mortgage">Tengo dudas</button></div></main>`}
function amortReview(){const s=state.sim,A=parseAmount(s.amort),r=amortSim(A,s.mode);return `${headerBack('Revisar amortización','Hipoteca ···· '+MORTGAGE_BASE.digits)}<main class="main" id="scroller"><div class="page-content"><div class="flow-kicker">Antes de confirmar</div><h1 class="simulation-title">Vas a adelantar ${fmt(A)} de tu hipoteca</h1><div class="simulation-summary" style="margin-top:16px"><div class="mini-row"><span>Modalidad</span><strong>${r.mode==='plazo'?'Reducir plazo':'Reducir cuota'}</strong></div><div class="mini-row"><span>${r.mode==='plazo'?'Nueva última cuota':'Nueva cuota'}</span><strong>${r.mode==='plazo'?r.end:fmt(r.cuota)}</strong></div><div class="mini-row"><span>Compensación</span><strong>${fmt(r.fee)}</strong></div><div class="mini-row"><span>Se carga en</span><strong>Cuenta Online ···· 1048</strong></div><div class="mini-row"><span>Se aplica</span><strong>1 de diciembre</strong></div><div class="mini-row"><span>Total que se carga</span><strong>${fmt(r2(A+r.fee))}</strong></div></div><p class="insight-disclaimer" style="margin-top:12px">Puedes cancelar la amortización hasta el día anterior a su aplicación.</p><button class="button-primary" data-action="amort-confirm">Confirmar amortización</button><button class="button-secondary" data-action="amort-edit">Cambiar importe</button></div></main>`}
function amortDonePage(){const r=state.amortDone||amortSim(2000,'cuota');return `${headerBack('Amortización programada','Hipoteca')}<main class="main" id="scroller"><div class="page-content"><div style="margin:50px 0 18px;color:#15946d">${icon('checkcircle',45)}</div><h1 class="simulation-title">Amortización programada</h1><p class="simulation-subtitle">El 1 de diciembre adelantamos ${fmt(r.A)} de tu hipoteca. ${r.mode==='plazo'?`Terminarás de pagarla en ${r.end}.`:`Desde enero tu cuota será de ${fmt(r.cuota)}.`} Te avisaremos cuando esté aplicada.</p><button class="button-primary" data-action="mortgage-open">Ver mi hipoteca</button><button class="button-secondary" data-action="nav-home">Volver al inicio</button></div></main>`}

// ── Páginas: préstamo ──
function loanResult(){
 const s=state.sim,A=parseAmount(s.loanAmount),n=Number(s.loanMonths)||60;
 if(!Number.isFinite(A)||A<LOAN.min)return `<div class="notice-strip" style="margin-top:16px">Elige un importe a partir de ${fmt(LOAN.min)}.</div>`;
 if(A>LOAN.max)return `<div class="form-error" style="margin-top:16px">Tu preaprobado llega hasta ${fmt(LOAN.max)}. Para más importe, un gestor tiene que estudiarlo.</div>`;
 const r=loanSim(A,n),months=Math.ceil(A/r.cuota);
 return `<div class="answer-panel"><div class="answer-eyebrow">Cuota mensual</div><div class="answer-total">${fmt(r.cuota)}</div><div class="mini-row"><span>Intereses</span><strong>${fmt(r.interest)}</strong></div><div class="mini-row"><span>Total a devolver</span><strong>${fmt(r.total)}</strong></div><div class="mini-row"><span>TIN · TAE</span><strong>${pct(LOAN.tin)} · ${pct(loanTae())}</strong></div><div class="mini-row"><span>Comisiones</span><strong>0,00 €</strong></div><div class="mini-row"><span>Primera cuota</span><strong>${LOAN.firstDue}</strong></div></div>
 ${r.share>35?`<div class="notice-strip" style="margin-top:12px">La cuota sería el ${pct(r.share,0)} de tu nómina. Es mucho: prueba con más plazo o menos importe.</div>`:`<p class="sim-compare">La cuota supone el ${pct(r.share,0)} de tu nómina.</p>`}
 <div class="alt-block"><h3>Antes de decidir</h3><p>${icon('piggy',18)}<span>En tu cuenta de ahorro tienes ${hide(money().ahorro)}: usarlo no te cuesta intereses.</span></p><p>${icon('calendar',18)}<span>Si puedes esperar, ahorrando ${fmt(r.cuota)} al mes juntarías ${fmt(A)} en ${yearsMonths(months)}, sin pagar ${fmt(r.interest)} de intereses.</span></p></div>`;
}
function loanOffer(){const s=state.sim;return `${headerBack('Préstamo preaprobado','Oferta para ti')}<main class="main" id="scroller"><div class="page-content"><div class="flow-kicker">Preaprobado para ti · hasta el ${LOAN.validUntil}</div><h1 class="simulation-title">Hasta ${fmt(LOAN.max).replace(',00','')} sin papeleo</h1><p class="simulation-subtitle">${pct(LOAN.tin)} TIN · ${pct(loanTae())} TAE · sin comisiones. El dinero llega a tu Cuenta Online al momento.</p>
<div class="field"><label for="sim-loan">¿Cuánto necesitas?</label><div class="input-prefix"><input id="sim-loan" name="simLoan" inputmode="decimal" autocomplete="off" value="${esc(s.loanAmount)}"/></div></div>
<div class="choice-chips" style="margin-top:12px">${[3000,6000,12000].map(v=>`<button class="choice-chip" aria-pressed="${parseAmount(s.loanAmount)===v}" data-action="loan-amt-${v}">${fmt(v).replace(',00','')}</button>`).join('')}</div>
<div class="field-label">Plazo</div><div class="choice-chips">${LOAN.plazos.map(n=>`<button class="choice-chip" aria-pressed="${Number(s.loanMonths)===n}" data-action="loan-m-${n}">${n} meses</button>`).join('')}</div>
<div id="sim-result" aria-live="polite">${loanResult()}</div>
<p class="insight-disclaimer" style="margin-top:12px">Simular no te compromete ni avisa a ningún gestor.</p>
<button class="button-primary" data-action="loan-review">Revisar y contratar</button><button class="button-secondary" data-action="loan-ask">Tengo dudas</button><button class="link-quiet" data-action="loan-dismiss">No me interesa, ocultar oferta</button></div></main>`}
function loanHave(){const l=state.loan;return `${headerBack('Tu préstamo','Terminado en '+LOAN.digits)}<main class="main" id="scroller"><div class="page-content"><div class="account-hero"><small>Capital pendiente</small><strong>${hide(l.A)}</strong><span>${l.n} cuotas de ${fmt(l.cuota)}</span>${progressBar(0,'Devuelto el 0 %')}</div><div class="review-details" style="margin-top:16px"><div class="mini-row"><span>Primera cuota</span><strong>${LOAN.firstDue}</strong></div><div class="mini-row"><span>Cuota mensual</span><strong>${fmt(l.cuota)}</strong></div><div class="mini-row"><span>TIN · TAE</span><strong>${pct(LOAN.tin)} · ${pct(loanTae())}</strong></div><div class="mini-row"><span>Total a devolver</span><strong>${fmt(l.total)}</strong></div><div class="mini-row"><span>Ingresado en</span><strong>Cuenta Online ···· 1048</strong></div></div><div class="action-grid" style="margin-top:16px"><button class="action-card" data-action="journey-loan">${icon('sparkle',21)}Preguntar al asistente</button><button class="action-card" data-action="detail-account">${icon('wallet',21)}Ver mi cuenta</button></div></div></main>${nav()}`}
function loanPage(){return state.loan?loanHave():loanOffer()}
function loanReview(){const s=state.sim,A=parseAmount(s.loanAmount),r=loanSim(A,Number(s.loanMonths)||60);return `${headerBack('Revisar préstamo','Préstamo preaprobado')}<main class="main" id="scroller"><div class="page-content"><div class="flow-kicker">Antes de firmar</div><h1 class="simulation-title">${fmt(A)} a ${r.n} meses</h1><p class="simulation-subtitle">${fmt(r.cuota)} al mes. Pagarás ${fmt(r.interest)} de intereses.</p><div class="simulation-summary" style="margin-top:16px"><div class="mini-row"><span>Importe</span><strong>${fmt(A)}</strong></div><div class="mini-row"><span>Plazo</span><strong>${r.n} meses</strong></div><div class="mini-row"><span>Cuota</span><strong>${fmt(r.cuota)}</strong></div><div class="mini-row"><span>TIN · TAE</span><strong>${pct(LOAN.tin)} · ${pct(loanTae())}</strong></div><div class="mini-row"><span>Total a devolver</span><strong>${fmt(r.total)}</strong></div><div class="mini-row"><span>Finalidad</span><strong>${s.purpose&&s.purpose!=='otro'?PURPOSE_LABEL[s.purpose].replace(/^(un|una|tus) /,'').replace(/^./,c=>c.toUpperCase()):'Sin indicar'}</strong></div><div class="mini-row"><span>Dinero en</span><strong>Cuenta Online ···· 1048</strong></div></div>
<label class="check-row"><input type="checkbox" name="secci" ${s.secci?'checked':''}/><span>He leído la información precontractual (INE) y las condiciones del préstamo.</span></label>${state.formError?`<div class="form-error">${esc(state.formError)}</div>`:''}
<p class="insight-disclaimer">Tienes 14 días para desistir sin dar explicaciones.</p><button class="button-primary" data-action="loan-confirm">Firmar y recibir el dinero</button><button class="button-secondary" data-action="loan-edit">Cambiar importe o plazo</button></div></main>`}
function loanDonePage(){const l=state.loan||loanSim(6000,60);return `${headerBack('Préstamo contratado','Préstamo personal')}<main class="main" id="scroller"><div class="page-content"><div style="margin:50px 0 18px;color:#15946d">${icon('checkcircle',45)}</div><h1 class="simulation-title">Ya tienes ${fmt(l.A)} en tu Cuenta Online</h1><p class="simulation-subtitle">La primera cuota, de ${fmt(l.cuota)}, se cargará el ${LOAN.firstDue}. Te hemos enviado el contrato a tu buzón.</p><button class="button-primary" data-action="loan-open">Ver mi préstamo</button><button class="button-secondary" data-action="nav-home">Volver al inicio</button></div></main>`}
const CREDIT_SCREENS={mortgage:mortgagePage,amort:amortPage,'amort-review':amortReview,'amort-done':amortDonePage,loan:loanPage,'loan-review':loanReview,'loan-done':loanDonePage};

// ── Guiones del chat ──
// Cada guion es una pequeña máquina de estados: cada paso dice algo (con datos reales), puede enseñar una tarjeta
// y ofrece respuestas. Si la persona escribe, se intenta entender (importe, plazo, palabra clave de una respuesta);
// si es otra cosa, se sale del guion hacia la intención que toque. Cada paso queda en la URL como ?paso=.
const SCRIPT_TOPICS=['mortgage','loan','preapproved','bizum'];
const chip=(label,o)=>({label,...o});
function mortgageCompare(A){const c=amortSim(A,'cuota'),p=amortSim(A,'plazo');return `<div class="answer-panel"><div class="answer-eyebrow">Si adelantas ${fmt(A)}</div><div class="mini-row"><span>Reducir cuota<span class="mini-sub">${fmt(mortgage().cuota)} → ${fmt(c.cuota)} al mes</span></span><strong>−${fmt(c.saved)}<span class="mini-sub">en intereses</span></strong></div><div class="mini-row"><span>Reducir plazo<span class="mini-sub">Acabas ${yearsMonths(p.less)} antes</span></span><strong style="color:#16835f">−${fmt(p.saved)}<span class="mini-sub">en intereses</span></strong></div><div class="mini-row"><span>Compensación</span><strong>${fmt(c.fee)}</strong></div></div>`}
function loanCompare(A){return `<div class="answer-panel"><div class="answer-eyebrow">${fmt(A)} según el plazo</div>${[36,60,84].map(n=>{const r=loanSim(A,n);return `<div class="mini-row"><span>${n} meses<span class="mini-sub">Intereses: ${fmt(r.interest)}</span></span><strong>${fmt(r.cuota)}<span class="mini-sub">al mes</span></strong></div>`}).join('')}<div class="mini-row"><span>TIN · TAE</span><strong>${pct(LOAN.tin)} · ${pct(loanTae())}</strong></div></div>`}
const SCRIPTS={
 mortgage:{start:v=>v.intent||'overview',steps:{
  overview:{say:()=>{const m=mortgage();return `Tu hipoteca va bien: te quedan <strong>${fmt(m.pendiente)}</strong> por pagar, con una cuota fija de <strong>${fmt(m.cuota)}</strong> hasta ${m.end}.`},panel:()=>{const m=mortgage();return `<div class="answer-panel"><div class="answer-eyebrow">Llevas devuelto el ${pct(m.paidPct,1)}</div>${progressBar(m.paidPct,'Devuelto')}<div class="mini-row" style="margin-top:8px"><span>Tipo</span><strong>${pct(m.tin)} TIN fijo</strong></div><div class="mini-row"><span>Próxima cuota</span><strong>1 de diciembre</strong></div></div>`},
   chips:()=>[chip('¿Me conviene amortizar?',{go:'amort',keys:['amortiz','adelant']}),chip('¿Me afecta el Euríbor?',{go:'euribor',keys:['euribor']}),chip('¿Puedo pagar menos cuota?',{go:'lower',keys:['menos','bajar']}),chip('¿Cuánto llevo pagado?',{go:'paid',keys:['pagado','llevo','devuelto']})]},
  amort:{say:v=>`Te lo cuento con <strong>${fmt(v.amount||2000)}</strong> de ejemplo. Tu hipoteca es fija al ${pct(mortgage().tin)}: cada euro que adelantas te «rinde» ese ${pct(mortgage().tin)}, sin riesgo. Reducir plazo ahorra más intereses; reducir cuota te da aire cada mes.`,panel:v=>{const m=money(),colchon=3*m.bills,free=r2(m.total-colchon);return mortgageCompare(v.amount||2000)+`<p class="sim-compare">${free<1000?`Con lo que tienes hoy (${hide(m.total)} entre tus cuentas), amortizar te dejaría sin colchón: lo prudente es guardar al menos tres meses de recibos (${fmt(colchon)}). Puedes simularlo igualmente para cuando ahorres más.`:`Podrías adelantar hasta ${fmt(free)} sin tocar un colchón de tres meses de recibos (${fmt(colchon)}).`}</p>`},
   chips:v=>[chip('Prefiero bajar la cuota',{go:'pick',set:{mode:'cuota'},keys:['cuota','bajar']}),chip('Prefiero acabar antes',{go:'pick',set:{mode:'plazo'},keys:['plazo','antes','acabar']}),chip('¿Y si mejor invierto el dinero?',{go:'invest',keys:['invert','invier','deposito','fondo']}),chip('Probar otro importe',{go:'ask-amount',keys:['otro','importe','cantidad']})]},
  'ask-amount':{say:()=>'¿Cuánto te gustaría adelantar? Escríbelo, por ejemplo «2.500».',expect:'amount',next:'amort',chips:()=>[1000,2000,3000].map(a=>chip(fmt(a).replace(',00',''),{go:'amort',set:{amount:a}}))},
  pick:{say:v=>{const r=amortSim(v.amount||2000,v.mode);return v.mode==='plazo'?`Buena opción si lo que quieres es pagar menos en total: con ${fmt(r.A)} terminarías en <strong>${r.end}</strong>, ${yearsMonths(r.less)} antes, y te ahorrarías unos <strong>${fmt(r.saved)}</strong> en intereses.`:`Buena opción si quieres aire cada mes: con ${fmt(r.A)} tu cuota bajaría a <strong>${fmt(r.cuota)}</strong> (${fmt(r.diff)} menos) y te ahorrarías unos <strong>${fmt(r.saved)}</strong> en intereses.`},
   chips:v=>[chip(`Simular con ${fmt(v.amount||2000).replace(',00','')}`,{act:'goto-amort',primary:true,keys:['simular','vale','si']}),chip('Cambiar de opción',{go:'amort',keys:['cambiar','otra']}),chip('Hablar con un gestor',{act:'human',keys:['gestor','persona']})]},
  invest:{say:()=>`Depende de lo que te dé la alternativa. Amortizar te da un ${pct(mortgage().tin)} seguro. Una inversión solo compensa si, después de impuestos y con su riesgo, te da más que eso. No te voy a recomendar un producto concreto por aquí: si quieres compararlo, te lo mira un gestor con tu perfil.`,
   chips:()=>[chip('Entonces amortizo',{go:'amort',keys:['amortiz']}),chip('Hablar con un gestor',{act:'human',keys:['gestor','persona']})]},
  euribor:{say:()=>{const m=mortgage();return `No. Tu hipoteca es a tipo fijo (${pct(m.tin)} TIN) durante toda su vida: el Euríbor no cambia tu cuota. Pagarás <strong>${fmt(m.cuota)}</strong> hasta ${m.end}.`},
   chips:()=>[chip('¿Me conviene amortizar?',{go:'amort',keys:['amortiz']}),chip('¿Cuánto llevo pagado?',{go:'paid',keys:['pagado','llevo']})]},
  lower:{say:()=>'Hay dos caminos. <strong>Amortizar una parte</strong> y elegir reducir cuota, o <strong>ampliar el plazo</strong> (una novación). Ampliar baja la cuota pero pagas más intereses en total y tiene gastos de notaría y registro, así que si tienes ahorro suele salir mejor amortizar.',
   chips:()=>[chip('Simular bajar la cuota',{go:'pick',set:{mode:'cuota'},keys:['simular','bajar']}),chip('Quiero ampliar el plazo',{go:'extend',keys:['ampliar','novacion']}),chip('Hablar con un gestor',{act:'human',keys:['gestor','persona']})]},
  extend:{say:()=>'Ampliar el plazo lo estudia un gestor: depende de tu edad, tus ingresos y la tasación de la vivienda. Te paso con una persona con este contexto para que no tengas que repetir nada.',
   chips:()=>[chip('Hablar con un gestor',{act:'human',primary:true,keys:['gestor','persona','vale']}),chip('Mejor simulo amortizar',{go:'amort',keys:['amortiz','simul']})]},
  paid:{say:()=>{const m=mortgage();return `Llevas <strong>${m.paid} cuotas</strong> pagadas y has devuelto <strong>${fmt(m.devuelto)}</strong> de capital, el ${pct(m.paidPct,1)}. Te quedan ${m.n} cuotas: ${yearsMonths(m.n)}.`},panel:()=>{const m=mortgage();return `<div class="answer-panel"><div class="answer-eyebrow">De ${fmt(m.inicial)}</div>${progressBar(m.paidPct,'Devuelto')}<div class="mini-row" style="margin-top:8px"><span>Devuelto</span><strong>${fmt(m.devuelto)}</strong></div><div class="mini-row"><span>Pendiente</span><strong>${fmt(m.pendiente)}</strong></div></div>`},
   chips:()=>[chip('¿Me conviene amortizar?',{go:'amort',keys:['amortiz']}),chip('Ver mi hipoteca',{act:'goto-mortgage',keys:['ver','hipoteca']})]}
 }},
 loan:{start:v=>state.loan?'have':v.amount>LOAN.max?'too-much':v.purpose==='imprevisto'?'emergency':v.amount&&v.purpose?(v.months?'chosen':'compare'):v.amount?'ask-purpose':v.purpose?'ask-amount':'intro',steps:{
  intro:{say:()=>`Tienes un <strong>préstamo preaprobado de hasta ${fmt(LOAN.max).replace(',00','')}</strong> al ${pct(LOAN.tin)} TIN (${pct(loanTae())} TAE), sin comisiones. Antes de ver números: ¿para qué lo necesitas? Así te ayudo a elegir bien.`,
   chips:()=>[chip('Un coche',{go:'ask-amount',set:{purpose:'coche'},keys:['coche','moto']}),chip('Una reforma',{go:'ask-amount',set:{purpose:'reforma'},keys:['reforma','obra']}),chip('Un imprevisto',{go:'emergency',set:{purpose:'imprevisto'},keys:['imprevist','urgen','averia']}),chip('Otra cosa',{go:'ask-amount',set:{purpose:'otro'},keys:['otra','otro','viaje','estudi']})]},
  'ask-purpose':{say:v=>`Vale, ${fmt(v.amount)}. ¿Para qué es? Me ayuda a darte el plazo que mejor encaje.`,
   chips:()=>[chip('Un coche',{go:'compare',set:{purpose:'coche'},keys:['coche']}),chip('Una reforma',{go:'compare',set:{purpose:'reforma'},keys:['reforma','obra']}),chip('Un imprevisto',{go:'emergency',set:{purpose:'imprevisto'},keys:['imprevist','urgen']}),chip('Prefiero no decirlo',{go:'compare',set:{purpose:'otro'},keys:['no','otro','otra']})]},
  emergency:{say:()=>`Para un imprevisto, mira primero tu colchón: en tu cuenta de ahorro tienes <strong>${hide(money().ahorro)}</strong> y usarlo no te cuesta intereses. Si no te llega, el préstamo cubre la diferencia.`,
   chips:v=>[chip(v.amount?`Ver el préstamo con ${fmt(v.amount).replace(',00','')}`:'¿Cuánto necesitaría?',{go:v.amount?'compare':'ask-amount',keys:['prestamo','cuanto','necesit']}),chip('Usar mi ahorro',{act:'goto-savings',keys:['ahorro']}),chip('Hablar con una persona',{act:'human',keys:['persona','gestor']})]},
  'ask-amount':{say:v=>`${v.purpose==='coche'?'Para el coche, ':v.purpose==='reforma'?'Para la reforma, ':''}¿cuánto necesitas, más o menos? Puedes escribirlo.`,expect:'amount',next:'compare',
   chips:()=>[3000,6000,9000,12000].map(a=>chip(fmt(a).replace(',00',''),{go:'compare',set:{amount:a}}))},
  'too-much':{say:v=>`Tu preaprobado llega hasta ${fmt(LOAN.max).replace(',00','')}. Para ${fmt(v.amount).replace(',00','')} tiene que estudiarlo un gestor, que puede pedirte algún documento.`,
   chips:()=>[chip(`Ver con ${fmt(LOAN.max).replace(',00','')}`,{go:'compare',set:{amount:LOAN.max},keys:['ver','12']}),chip('Hablar con un gestor',{act:'human',keys:['gestor','persona']})]},
  compare:{say:v=>`Con ${fmt(v.amount)} para ${PURPOSE_LABEL[v.purpose||'otro']}, así quedaría. A más plazo, la cuota baja pero pagas más intereses.${v.purpose==='coche'?' Si el concesionario te ofrece financiación, compara su TAE con este '+pct(loanTae())+'.':''}`,panel:v=>loanCompare(v.amount),
   chips:()=>[36,60,84].map(n=>chip(`${n} meses`,{go:'chosen',set:{months:n},keys:[String(n)]}))},
  chosen:{say:v=>{const r=loanSim(v.amount,v.months||60);return `${fmt(r.A)} a ${r.n} meses son <strong>${fmt(r.cuota)} al mes</strong>. Pagarías ${fmt(r.interest)} de intereses, ${fmt(r.total)} en total. La cuota es el ${pct(r.share,0)} de tu nómina${r.share>35?': es mucho, piensa en más plazo o menos importe.':', un nivel cómodo.'}`},
   chips:()=>[chip('Revisar y contratar',{act:'goto-loan-review',primary:true,keys:['contrat','revis','vale']}),chip('Cambiar el plazo',{go:'compare',keys:['plazo','cambiar']}),chip('Prefiero pensarlo',{go:'think',keys:['pensar','pensarlo','luego','despues']})]},
  think:{say:()=>`Sin problema. La oferta sigue disponible hasta el ${LOAN.validUntil}, y mirarla no avisa a ningún gestor ni te compromete. La tienes en Productos cuando quieras.`,
   chips:()=>[chip('Ver la oferta',{act:'goto-loan',keys:['oferta','ver']}),chip('Volver al inicio',{act:'home',keys:['inicio']})]},
  have:{say:()=>`Ya tienes un préstamo de <strong>${fmt(state.loan.A)}</strong> a ${state.loan.n} meses, con una cuota de ${fmt(state.loan.cuota)}. La primera se carga el ${LOAN.firstDue}.`,
   chips:()=>[chip('¿Puedo devolverlo antes?',{go:'early',keys:['antes','amortiz','devolver']}),chip('Ver mi préstamo',{act:'goto-loan',keys:['ver']})]},
  early:{say:()=>'Sí, puedes adelantar dinero cuando quieras, total o parcialmente. La compensación es como mucho del 1 % de lo que adelantes (0,5 % si queda menos de un año). Lo verás todo antes de confirmar.',
   chips:()=>[chip('Ver mi préstamo',{act:'goto-loan',keys:['ver']}),chip('Hablar con una persona',{act:'human',keys:['persona','gestor']})]}
 }},
 preapproved:{start:()=>state.loan?'already':'why',steps:{
  why:{say:()=>'Te lo mostramos porque tus ingresos y tus movimientos de los últimos meses encajan con estas condiciones. Para calcularlo no hemos hecho ninguna consulta nueva: usamos lo que ya vemos en tus cuentas. Si decides pedirlo, haremos las comprobaciones habituales antes de darte el dinero.',
   chips:()=>[chip('¿Me compromete en algo?',{go:'commit',keys:['compromet','obliga','afecta']}),chip('Ver la oferta',{act:'goto-loan',keys:['ver','oferta']}),chip('No me interesa, ocúltala',{go:'dismiss',keys:['interesa','ocult','quita']})]},
  commit:{say:()=>`No. No tienes que hacer nada y tus condiciones actuales no cambian. Si no lo usas, caduca el ${LOAN.validUntil} sin más.`,
   chips:()=>[chip('Ver la oferta',{act:'goto-loan',keys:['ver','oferta']}),chip('No me interesa, ocúltala',{go:'dismiss',keys:['interesa','ocult']})]},
  dismiss:{onEnter:()=>{state.offerDismissed=true},say:()=>'Hecho: ya no lo verás en Productos. Si algún día lo necesitas, pregúntame por un préstamo y lo recuperamos.',
   chips:()=>[chip('Volver al inicio',{act:'home',keys:['inicio','volver']})]},
  already:{say:()=>`Ya lo usaste: tienes un préstamo de ${fmt(state.loan.A)} a ${state.loan.n} meses.`,chips:()=>[chip('Ver mi préstamo',{act:'goto-loan',keys:['ver']})]}
 }}
};

// ── Bizum conversacional (V7.8) ──
// Una pregunta por turno, se salta lo que ya sabe, las respuestas rápidas son frases y escribir siempre gana a tocar.
// Cada fase tiene su URL (datos → revisión → completado) pero el hilo viaja en la sesión: se ve como una sola conversación.
const CONTACTS=[{id:'marta',name:'Marta AMPA cole',full:'Marta AMPA cole',tail:'482',keys:['marta','ampa']},{id:'pau',name:'Pau Seara',full:'Pau Seara',tail:'917',keys:['pau']},{id:'mama',name:'Mamá',full:'Mamá',tail:'305',keys:['mama','madre']}];
const contactToWho=c=>({name:c.name,full:c.full,tail:c.tail,known:true});
function findContact(t){const n=normq(t);return CONTACTS.find(c=>c.keys.some(k=>new RegExp('\\b'+k+'\\b').test(n)))||null}
function findPhone(t){const d=String(t).replace(/\D/g,'').replace(/^34(?=\d{9}$)/,'');return /^[6-7]\d{8}$/.test(d)?d:null}
function fmtPhone(d){return d.replace(/(\d{3})(\d{3})(\d{3})/,'$1 $2 $3')}
function phoneWho(d){return {name:fmtPhone(d),full:fmtPhone(d),tail:d.slice(-3),known:false}}
function bizumAmount(t,bare){const m=String(t).match(/(\d{1,5}(?:[.,]\d{1,2})?)\s*(?:€|eur\b|euros?\b)/i);let a=m?m[1]:null;if(!a&&bare&&!findPhone(t)){const all=[...String(t).matchAll(/(?:^|\s)(\d{1,5}(?:[.,]\d{1,2})?)(?=\s|$|[.,!?])/g)];if(all.length===1)a=all[0][1];}if(!a)return null;const x=parseAmount(a);return Number.isFinite(x)&&x>0?x:null}
function nameFrom(t){const x=String(t).trim().replace(/^(a|para)\s+/i,'').replace(/[.!?¿¡]+$/,'');return /^[A-Za-zÁÉÍÓÚÑáéíóúñ][A-Za-zÁÉÍÓÚÑáéíóúñ ]{1,24}$/.test(x)&&!/\d/.test(x)?x.charAt(0).toUpperCase()+x.slice(1):null}
const nextBizum=v=>!v.who?'ask-who':v.amount==null?'ask-amount':v.amount>money().online?'no-funds':'confirm';
function bizumTicket(v,isLast,done){
 const w=v.who||{name:'—',full:'—',tail:'···'},sending=!!(state.script&&state.script.sending);
 const rows=`<div class="mini-row"><span>Desde</span><strong>Cuenta Online ····1048</strong></div><div class="mini-row"><span>${done?'Llegada':'Llega'}</span><strong>${done?'Ahora mismo':'Al momento'}</strong></div>${v.concept?`<div class="mini-row"><span>Concepto</span><strong>${esc(v.concept)}</strong></div>`:''}`;
 if(done)return `<div class="bizum-ticket is-done"><div class="bt-check">${icon('check',24)}</div><div class="bt-amount">${fmt(v.amount)}</div><div class="bt-sub">enviados a ${esc(w.full)}</div><div class="bt-rows">${rows}</div></div>`;
 return `<div class="bizum-ticket ${isLast?'':'is-old'}"><div class="bt-who"><span class="bt-avatar">${esc((w.name||'?').charAt(0))}</span><div><strong>${esc(w.full)}</strong><small>Bizum · ··· ··· ${esc(w.tail||'···')}</small></div></div><div class="bt-amount">${fmt(v.amount)}</div><div class="bt-rows">${rows}</div>${isLast?`<button class="button-primary bt-send" data-action="bizum-send" ${sending?'disabled':''}>${sending?'<span class="bt-spin" aria-hidden="true"></span>Enviando…':'Enviar '+fmt(v.amount).replace(',00','')}</button>`:''}</div>`;
}
const BIZUM_STEPS={start:v=>v.who?nextBizum(v):v.pending?'ask-phone':'ask-who',steps:{
 'ask-who':{route:'/bizum/datos',ph:'Nombre o teléfono',say:v=>v.amount?`Perfecto, ${fmt(v.amount).replace(',00','')}. ¿A quién se lo envío?`:'¿A quién se lo envío?',
  chips:v=>[...CONTACTS.map(c=>chip(c.name,{go:nextBizum({...v,who:true}),set:{who:contactToWho(c)},keys:c.keys})),chip('Otro número',{go:'other-number',keys:['otro','numero','telefono']})]},
 'other-number':{route:'/bizum/datos',ph:'Nombre o teléfono',numeric:true,say:()=>'Escríbeme su nombre o su teléfono.',chips:()=>[chip('Elegir un contacto',{go:'ask-who',keys:['contacto','elegir']})]},
 'ask-phone':{route:'/bizum/datos',ph:'Teléfono (9 cifras)',numeric:true,say:v=>`No tengo a «${esc(v.pending||'esa persona')}» entre tus contactos de Bizum. Escríbeme su teléfono (9 cifras) y se lo envío.`,chips:()=>[chip('Elegir un contacto',{go:'ask-who',set:{pending:''},keys:['contacto','elegir']})]},
 'ask-amount':{route:'/bizum/datos',ph:'Importe en €',numeric:true,say:v=>`¿Cuánto le envías a ${esc(v.who.name)}?`,
  chips:v=>[10,20,50].map(a=>chip(a+' €',{go:a>money().online?'no-funds':'confirm',set:{amount:a},keys:[String(a)]}))},
 'no-funds':{route:'/bizum/datos',ph:'Importe en €',numeric:true,say:v=>`En tu Cuenta Online tienes <strong>${hide(money().online)}</strong> y quieres enviar ${fmt(v.amount)}. Dime un importe menor, o traspasa antes dinero desde Ahorro.`,
  chips:()=>[chip('Enviar menos',{go:'ask-amount',set:{amount:null},keys:['menos']}),chip('Cancelar',{act:'home',keys:['cancelar','inicio']})]},
 'confirm':{route:'/bizum/revision',ph:'Cambia algo o escribe otra cosa…',say:v=>`Lo tengo: <strong>${fmt(v.amount)}</strong> a <strong>${esc(v.who.name)}</strong> desde tu Cuenta Online.`,panel:(v,isLast)=>bizumTicket(v,isLast,false),
  chips:v=>[chip('Cambiar importe',{go:'ask-amount',set:{amount:null},keys:['importe','cantidad']}),chip('Cambiar destinatario',{go:'ask-who',set:{who:null},keys:['destinatario','persona']}),chip(v.concept?'Cambiar concepto':'Añadir concepto',{go:'ask-concept',keys:['concepto']})]},
 'ask-concept':{route:'/bizum/revision',ph:'Concepto',say:()=>'¿Qué concepto le pongo?',
  chips:()=>[...['Cena','Gracias','Alquiler'].map(c=>chip(c,{go:'confirm',set:{concept:c},keys:[normq(c)]})),chip('Sin concepto',{go:'confirm',set:{concept:''},keys:['sin','nada']})]},
 'sent':{route:'/bizum/completado',ph:'Pregunta o pide otra cosa…',say:v=>`Hecho. <strong>${esc(v.who.name)}</strong> ya lo tiene.`,panel:v=>bizumTicket(v,true,true),
  chips:()=>[chip('Enviar otro Bizum',{act:'bizum-again',keys:['otro','bizum']}),chip('Ver mi cuenta',{act:'goto-account',keys:['cuenta','movimiento']}),chip('Volver al inicio',{act:'home',keys:['inicio','volver']})]}
}};
function bizumSeed(t){const f=state.form||{},v={who:null,pending:'',amount:null},c=findContact(t)||findContact(f.recipient||''),ph=findPhone(t);const a=bizumAmount(t,false)||(f.amount?parseAmount(f.amount):null);if(c)v.who=contactToWho(c);else if(ph)v.who=phoneWho(ph);else if(f.recipient&&nameFrom(f.recipient))v.pending=nameFrom(f.recipient);if(Number.isFinite(a)&&a>0)v.amount=a;return v}
function bizumInput(q){
 const s=state.script,v=s.v,st=s.step;
 if(st==='sent')return false;
 const c=findContact(q),ph=findPhone(q),amt=bizumAmount(q,['ask-amount','no-funds','confirm'].includes(st)),ns={};
 if(st==='ask-phone'&&ph){ns.who={...phoneWho(ph),name:v.pending||phoneWho(ph).name,full:v.pending||phoneWho(ph).full};ns.pending='';}
 else if(c)ns.who=contactToWho(c);
 else if(ph)ns.who=phoneWho(ph);
 if(amt!==null)ns.amount=amt;
 if(st==='ask-concept')ns.concept=q.trim().slice(0,40);
 else{const m=String(q).match(/concepto\s+(.+)$/i);if(m)ns.concept=m[1].trim().slice(0,40);}
 if(!Object.keys(ns).length){
  if(['ask-who','other-number'].includes(st)){const name=nameFrom(q);if(name&&name.split(' ').length<=2&&guess(q)==='other'&&!/\b(si|no|vale|ok|cancelar|inicio)\b/i.test(name)){s.v.pending=name;scriptAdvance(q,{go:'ask-phone'});return true;}}
  return false;
 }
 Object.assign(v,ns);
 scriptAdvance(q,{go:st==='ask-concept'?'confirm':nextBizum(v)});return true;
}
SCRIPTS.bizum=BIZUM_STEPS;
function scriptInit(topic){
 const t=state.text||'',v={amount:null,purpose:null,months:null,mode:null,intent:null,who:null,pending:'',concept:''};
 if(topic==='bizum'){Object.assign(v,bizumSeed(t));if(ROUTE_PATH!=='/bizum/datos'){if(!v.who)v.who=contactToWho(CONTACTS[0]);if(v.amount==null)v.amount=20;}}
 if(topic==='loan'){const a=parseEuros(t);if(a&&a>=300)v.amount=a;v.purpose=purposeOf(t);v.months=monthsIn(t);}
 if(topic==='mortgage'){const s=normq(t);v.intent=/amortiz|adelantar/.test(s)?'amort':/euribor/.test(s)?'euribor':/menos cuota|bajar (la )?cuota|pagar menos/.test(s)?'lower':/llevo pagado|cuanto (me )?queda|pendiente/.test(s)?'paid':null;const a=parseEuros(t);if(a&&a>=1000)v.amount=a;}
 state.script={id:topic,turns:[{u:t||(texts[topic]||texts.other)[0]}],v,step:null};
 scriptPushBot(SCRIPTS[topic].start(v));
}
function scriptPushBot(stepId){
 const sc=SCRIPTS[state.script.id],st=sc.steps[stepId]||sc.steps[sc.start(state.script.v)];
 if(st.onEnter)st.onEnter(state.script.v);
 state.script.turns.push({b:stepId,v:{...state.script.v}});state.script.step=stepId;
 try{if(!location.hash&&/^https?:/.test(location.protocol)){const u=new URL(location.href);u.searchParams.set('paso',stepId);history.replaceState(history.state,'',u)}}catch(err){}
}
function scriptChips(){const sc=SCRIPTS[state.script.id],st=sc.steps[state.script.step];return st&&st.chips?st.chips(state.script.v):[]}
function scriptAdvance(userLabel,c){
 const s=state.script;s.turns.push({u:userLabel});
 if(c.set)Object.assign(s.v,c.set);
 if(c.act){scriptAct(c.act);return;}
 state.scriptTyping=true;renderChat();
 window.setTimeout(()=>{state.scriptTyping=false;scriptPushBot(c.go);const r=(SCRIPTS[s.id].steps[c.go]||{}).route;if(r&&r!==ROUTE_PATH){NEXT_DIR='fade';goto(r);}else renderChat();},prefersReducedMotion?0:650);
}
function scriptAct(act){
 const v=state.script.v;state.via='chat-boton';
 if(act==='goto-amort'){state.sim.amort=String(v.amount||2000);state.sim.mode=v.mode||'cuota';goto('/hipoteca/amortizar');return;}
 if(act==='goto-mortgage'){goto('/hipoteca');return;}
 if(act==='goto-loan'){if(v.amount)state.sim.loanAmount=String(Math.min(v.amount,LOAN.max));if(v.months)state.sim.loanMonths=v.months;goto('/prestamo');return;}
 if(act==='goto-loan-review'){state.sim.loanAmount=String(v.amount);state.sim.loanMonths=v.months||60;state.sim.purpose=v.purpose||'';state.sim.secci=false;state.formError='';goto('/prestamo/revision');return;}
 if(act==='goto-savings'){detailOf('savings');return;}
 if(act==='goto-account'){detailOf('account');return;}
 if(act==='bizum-again'){journey('bizum',undefined,'chat-boton');return;}
 if(act==='human'){journey('human',undefined,'chat-boton');return;}
 if(act==='home'){navigate('home');return;}
}
function scriptInput(q){
 const s=state.script,sc=SCRIPTS[s.id],st=sc.steps[s.step]||{},n=normq(q);state.chatText='';state.refocus=true;
 if(s.id==='bizum'&&bizumInput(q))return;
 if(st.expect==='amount'){const a=parseEuros(q);if(a){scriptAdvance(q,{go:s.id==='loan'&&a>LOAN.max?'too-much':st.next,set:{amount:a}});return;}}
 if(s.id==='loan'){const m=monthsIn(q);if(m&&s.v.amount){scriptAdvance(q,{go:'chosen',set:{months:m}});return;}const a=parseEuros(q);if(a&&a>=300&&['compare','chosen','ask-purpose','emergency'].includes(s.step)){scriptAdvance(q,{go:a>LOAN.max?'too-much':'compare',set:{amount:a}});return;}}
 const hit=scriptChips().find(c=>(c.keys||[]).some(k=>n.includes(k)));
 if(hit){scriptAdvance(q,hit);return;}
 const t=guess(q);
 if(t!=='other'&&t!==s.id){journey(t,q,'chat');return;}
 s.turns.push({u:q});state.scriptTyping=true;renderChat();
 window.setTimeout(()=>{state.scriptTyping=false;s.turns.push({b:'__fallback',v:{...s.v},from:s.step});renderChat();},prefersReducedMotion?0:500);
}
function renderChat(){const el=root.querySelector('#scroller'),prev=el?el.scrollTop:0;render();const nw=root.querySelector('#scroller');if(!nw)return;nw.scrollTop=prev;requestAnimationFrame(()=>nw.scrollTo({top:nw.scrollHeight,behavior:prefersReducedMotion?'auto':'smooth'}));if(state.refocus){state.refocus=false;const inp=root.querySelector('#chat-input');if(inp)inp.focus({preventScroll:true});}}
function botTurnHtml(turn,isLast){
 const sc=SCRIPTS[state.script.id];let say,panel='';
 if(turn.b==='__fallback'){say='No te he entendido del todo. Elige una de las opciones o escríbeme de otra forma.';}
 else{const st=sc.steps[turn.b];say=st.say(turn.v);panel=st.panel?st.panel(turn.v,isLast):'';}
 const chips=isLast&&!state.scriptTyping?scriptChips():[];
 return `<div class="assistant-row turn ${isLast?'turn-enter':''}"><div class="assistant-avatar">${assistantDisc()}</div><div class="assistant-content"><div class="assistant-sign">Asistente digital · 9:41</div><div class="assistant-bubble"><p>${say}</p></div>${panel}${chips.length?`<div class="inline-actions">${chips.map((c,i)=>`<button class="inline-button ${c.primary?'is-primary':''}" data-action="sc-${i}">${esc(c.label)}</button>`).join('')}</div>`:''}</div></div>`;
}
function scriptChat(){
 if(!state.script||state.script.id!==state.topic)scriptInit(state.topic);
 const curStep=(SCRIPTS[state.script.id].steps[state.script.step])||{};
 const turns=state.script.turns,lastBot=turns.map(t=>!!t.b).lastIndexOf(true);
 const body=turns.map((t,i)=>t.u!==undefined?`<div class="message-user turn ${i===turns.length-1?'turn-enter':''}"><div class="user-bubble">${esc(t.u)}</div></div>`:botTurnHtml(t,i===lastBot&&i===turns.length-1)).join('');
 const typing=state.scriptTyping?`<div class="assistant-row turn-enter"><div class="assistant-avatar">${assistantDisc()}</div><div class="assistant-content"><div class="typing" aria-label="El asistente está escribiendo"><span></span><span></span><span></span></div></div></div>`:'';
 return `${chatHeader()}<main class="main" id="scroller"><div class="chat"><div class="chat-kicker">Tu asistente</div>${(state.history||[]).map(h=>`<div class="message-user"><div class="user-bubble">${esc(h.text)}</div></div><div class="assistant-row" style="margin-bottom:20px;opacity:.75"><div class="assistant-avatar">${assistantDisc()}</div><div class="assistant-content"><div class="assistant-sign">Asistente digital · 9:41</div><div class="assistant-bubble"><p>${topicText(h.topic)}</p></div></div></div>`).join('')}${body}${typing}</div></main><div class="chat-composer"><label class="visually-hidden" for="chat-input">Escribir una respuesta</label><input type="text" id="chat-input" name="chatText" placeholder="${esc(curStep.ph||'Escribe tu respuesta…')}" ${curStep.numeric?'inputmode="decimal"':''} enterkeyhint="send" autocomplete="off" value="${esc(state.chatText)}"/><button class="send" data-action="send-chat" aria-label="Enviar">${icon('send',18)}</button></div>`;
}

function chat(){if(SCRIPT_TOPICS.includes(state.topic))return scriptChat();const info=[(texts[state.topic]||texts.other)[0],topicText(state.topic)];const panel=state.topic==='security'?securityPanel():state.topic==='cover'?coverPanel():state.topic==='month'?monthPanel():state.topic==='human'?humanPanel():state.topic==='balance'?balancePanel():state.topic==='payments'?paymentPanel():state.topic==='spending'?spendingPanel():state.topic==='cards'?cardsPanel():state.topic==='bizum'||state.topic==='transfer'?(state.stage==='form'?flowForm():state.stage==='review'?flowReview():flowSuccess()):`<div class="inline-actions">${pill('Ver mis saldos','balance','wallet')}${pill('Próximos pagos','payments','calendar')}${pill('Enviar Bizum','bizum','phone')}${pill('Transferencia','transfer','swap')}${pill('Hablar con una persona','human','user')}</div>`;return `${chatHeader()}<main class="main" id="scroller"><div class="chat"><div class="chat-kicker">Tu asistente</div>${(state.history||[]).map(h=>`<div class="message-user"><div class="user-bubble">${esc(h.text)}</div></div><div class="assistant-row" style="margin-bottom:20px;opacity:.75"><div class="assistant-avatar">${assistantDisc()}</div><div class="assistant-content"><div class="assistant-sign">Asistente digital · 9:41</div><div class="assistant-bubble"><p>${topicText(h.topic)}</p></div></div></div>`).join('')}<div class="message-user"><div class="user-bubble">${esc(state.text||info[0])}</div></div><div class="assistant-row"><div class="assistant-avatar">${assistantDisc()}</div><div class="assistant-content"><div class="assistant-sign">Asistente digital · 9:41</div><div class="assistant-bubble"><p>${info[1]}</p></div>${panel}</div></div></div></main><div class="chat-composer"><label class="visually-hidden" for="chat-input">Escribir una consulta</label><input type="text" id="chat-input" name="chatText" placeholder="Pregunta o pide otra cosa..." value="${esc(state.chatText)}"/><button class="send" data-action="send-chat" aria-label="Enviar">${icon('send',18)}</button></div>`}
function products(){return `${brand()}<main class="main" id="scroller"><div class="page-content"><h1 class="page-title">Tus productos</h1><p class="page-subtitle">Consulta y gestiona lo que tienes contratado.</p><div class="section-head"><h2>Cuentas</h2><span style="font-size:12px;color:#83909e">2 productos</span></div><button class="product-row" data-action="detail-account"><span class="row-icon">${icon('wallet')}</span><span class="row-content"><span class="row-title">Cuenta Online</span><span class="row-subtitle">•••• 1048</span></span><span class="row-amount">${state.balanceVisible?fmt(money().online):'•••• €'}</span>${icon('chevron',14)}</button><button class="product-row" data-action="detail-savings"><span class="row-icon">${icon('wallet')}</span><span class="row-content"><span class="row-title">Cuenta ahorro</span><span class="row-subtitle">•••• 3291</span></span><span class="row-amount">${state.balanceVisible?fmt(money().ahorro):'•••• €'}</span>${icon('chevron',14)}</button><h2 class="page-heading-small">Tarjetas</h2><button class="product-row" data-action="detail-card"><span class="row-icon">${icon('card')}</span><span class="row-content"><span class="row-title">Tarjeta de débito</span><span class="row-subtitle">•••• 4821 · Activa</span></span>${icon('chevron',15)}</button><h2 class="page-heading-small">Préstamos e hipotecas</h2><button class="product-row" data-action="mortgage-open"><span class="row-icon">${icon('building')}</span><span class="row-content"><span class="row-title">Hipoteca</span><span class="row-subtitle">•••• 7720 · Fija ${pct(mortgage().tin)}</span></span><span class="row-amount">${hide(mortgage().pendiente)}</span>${icon('chevron',14)}</button>${state.loan?`<button class="product-row" data-action="loan-open"><span class="row-icon">${icon('wallet')}</span><span class="row-content"><span class="row-title">Préstamo personal</span><span class="row-subtitle">•••• ${LOAN.digits} · ${state.loan.n} meses</span></span><span class="row-amount">${hide(state.loan.A)}</span>${icon('chevron',14)}</button>`:state.offerDismissed?'':`<button class="product-row offer-row" data-action="loan-open"><span class="row-icon">${icon('sparkle')}</span><span class="row-content"><span class="offer-tag">Preaprobado</span><span class="row-title">Préstamo de hasta ${fmt(LOAN.max).replace(',00','')}</span><span class="row-subtitle">${pct(LOAN.tin)} TIN · ${pct(loanTae())} TAE · sin comisiones</span></span>${icon('chevron',14)}</button><button class="offer-why" data-action="journey-preapproved">¿Por qué veo esto?</button>`}<div class="home-guide"><h3>¿Buscas algo más?</h3><p>Puedes pedir lo que necesitas sin navegar por todos tus productos.</p><button class="helper-link" data-action="journey-balance">Consultar mis saldos ${icon('right',14)}</button></div></div></main>${nav()}`}
function moneyPage(){return `${brand()}<main class="main" id="scroller"><div class="page-content"><h1 class="page-title">Mi dinero</h1><p class="page-subtitle">Tus cuentas y movimientos, de un vistazo.</p><div class="money-overview"><div class="money-kicker">Saldo disponible entre tus cuentas</div><div class="money-total">${state.balanceVisible?fmt(money().total):'•••• €'}</div><div class="money-support">2 cuentas</div><button class="money-link" data-action="journey-balance">Ver desglose ${icon('right',15)}</button></div><div class="action-grid money-actions"><button class="action-card" data-action="journey-bizum">${icon('phone',21)}Enviar un Bizum</button><button class="action-card" data-action="journey-transfer">${icon('swap',21)}Hacer transferencia</button></div><div class="section-head" style="margin-top:24px"><h2>Últimos movimientos</h2><button class="textlink" data-action="journey-payments">Próximos pagos ${icon('chevron',14)}</button></div>${movesNow().map(m=>`<div class="movement"><div class="movement-icon">${icon(m[3],17)}</div><div class="movement-name">${m[0]}<small>${m[1]}</small></div><div class="movement-value ${m[2]>0?'positive':''}">${state.balanceVisible?(m[2]>0?'+':'−')+fmt(Math.abs(m[2])):'•••• €'}</div></div>`).join('')}<div class="home-guide"><h3>¿Necesitas entender tus gastos?</h3><p>Puedes preguntar por tus saldos y próximos movimientos sin buscar entre pantallas.</p><button class="helper-link" data-action="journey-spending">¿Puedo gastar 500 € este fin de semana? ${icon('right',14)}</button></div></div></main>${nav()}`}

const contractProducts={cuenta:{icon:'wallet',label:'Cuentas',name:'Cuenta Online',summary:'Una cuenta para gestionar tu día a día desde el móvil.',details:['Consulta tus movimientos y recibos desde la app.','Haz transferencias y gestiona tu dinero.','Revisa las condiciones antes de contratar.']},tarjeta:{icon:'card',label:'Tarjetas',name:'Tarjeta de crédito',summary:'Flexibilidad para tus compras habituales.',details:['Consulta gastos y movimientos desde la app.','Controla la tarjeta y las opciones disponibles.','Las condiciones dependen de cada solicitud.']},ahorro:{icon:'piggy',label:'Ahorro',name:'Opciones de ahorro',summary:'Descubre alternativas para organizar tus objetivos.',details:['Explora opciones según tu horizonte.','Compara antes de decidir.','Las condiciones se mostrarían antes de contratar.']}};
function contractPage(){return `${brand()}<main class="main" id="scroller"><div class="page-content"><h1 class="page-title">Contratar</h1><p class="page-subtitle">Descubre productos y servicios que puedes solicitar desde el banco.</p><div class="contract-banner"><span class="contract-illustration">${icon('sparkle',25)}</span><strong>¿No sabes por dónde empezar?</strong><p>Cuéntanos qué necesitas y te ayudamos a explorar opciones.</p><button class="helper-link" data-action="journey-other">Iniciar conversación ${icon('right',15)}</button></div><h2 class="page-heading-small">Explora productos</h2>${state.loan?'':`<button class="product-row contract-row" data-action="loan-open"><span class="row-icon">${icon('wallet',22)}</span><span class="row-content"><span class="row-title">Préstamo personal</span><span class="row-subtitle">Tienes uno preaprobado de hasta ${fmt(LOAN.max).replace(',00','')}.</span></span>${icon('chevron',17)}</button>`}${Object.entries(contractProducts).map(([id,p])=>`<button class="product-row contract-row" data-action="contract-${id}"><span class="row-icon">${icon(p.icon,22)}</span><span class="row-content"><span class="row-title">${p.name}</span><span class="row-subtitle">${p.summary}</span></span>${icon('chevron',17)}</button>`).join('')}</div></main>${nav()}`}
function contractDetail(){const p=contractProducts[state.contract]||contractProducts.cuenta;return `${headerBack(p.name,'Explorar producto')}<main class="main" id="scroller"><div class="page-content"><div class="contract-detail-art">${icon(p.icon,34)}</div><div class="eyebrow" style="margin-top:20px">${p.label}</div><h1 class="page-title" style="margin-top:9px">${p.name}</h1><p class="page-subtitle">${p.summary}</p><h2 class="page-heading-small">Qué puedes hacer</h2>${p.details.map(d=>`<div class="contract-feature">${icon('checkcircle',18)}<span>${d}</span></div>`).join('')}<button class="button-primary" data-action="contract-info">Solicitar información</button><button class="button-secondary" data-action="nav-contract">Volver a contratar</button></div></main>${nav()}`}
function mailboxPage(){return `${brand()}<main class="main" id="scroller"><div class="page-content"><h1 class="page-title">Buzón</h1>${state.mailOpen?`<p class="page-subtitle">Comunicación · 18 de noviembre</p><div class="answer-panel"><strong style="font-size:17px">Tu extracto ya está disponible</strong><p style="font-size:14px;color:#646464;line-height:1.6;margin:14px 0 0">Puedes consultar el extracto mensual de tu Cuenta Online desde el apartado Mi dinero.</p><div class="inline-actions"><button class="inline-button" data-action="nav-money">Ir a Mi dinero</button><button class="inline-button" data-action="mail-back">Volver al buzón</button></div></div>`:`<p class="page-subtitle">Tus comunicaciones con el banco.</p><button class="product-row" data-action="mail-open"><span class="row-icon">${icon('mail',21)}</span><span class="row-content"><span class="row-title">${state.mailRead?'Extracto disponible':'Tu extracto ya está disponible'}</span><span class="row-subtitle">Banco Sabadell · 18 de noviembre</span></span>${!state.mailRead?'<span class="account-dot" aria-label="Sin leer"></span>':''}${icon('chevron',16)}</button>`}</div></main>${nav()}`}

function detail(){const card=state.detail==='card',savings=state.detail==='savings';return `${headerBack(card?'Tu tarjeta':savings?'Cuenta ahorro':'Cuenta Online',card?'Terminada en 4821':savings?'Terminada en 3291':'Terminada en 1048')}<main class="main" id="scroller"><div class="page-content"><div class="account-hero"><small>${card?'Gasto realizado este mes':'Saldo disponible'}</small><strong>${state.balanceVisible?fmt(card?money().card:savings?money().ahorro:money().online):'•••• €'}</strong><span>${card?'Tarjeta activa':savings?'Cuenta ahorro':'Cuenta Online'}</span></div><div class="action-grid"><button class="action-card" data-action="journey-transfer">${icon('swap',22)}Transferir dinero</button><button class="action-card" data-action="journey-bizum">${icon('phone',22)}Enviar un Bizum</button></div><h2 class="page-heading-small">Movimientos recientes</h2>${movesNow().slice(0,3).map(m=>`<div class="movement"><div class="movement-icon">${icon(m[3],17)}</div><div class="movement-name">${m[0]}<small>${m[1]}</small></div><div class="movement-value ${m[2]>0?'positive':''}">${m[2]>0?'+':'−'}${fmt(Math.abs(m[2]))}</div></div>`).join('')}<button class="button-secondary" data-action="nav-movements">Ver todos los movimientos</button></div></main>${nav()}`}
function operations(){return `${brand()}<main class="main" id="scroller"><div class="page-content"><h1 class="page-title">¿Qué quieres hacer?</h1><p class="page-subtitle">Elige una operación o escríbela en el inicio.</p><div class="action-grid"><button class="action-card" data-action="journey-bizum">${icon('phone',23)}Enviar Bizum</button><button class="action-card" data-action="journey-transfer">${icon('swap',23)}Transferencia</button><button class="action-card" data-action="journey-balance">${icon('wallet',23)}Consultar saldo</button><button class="action-card" data-action="journey-payments">${icon('receipt',23)}Próximos recibos</button></div><button class="button-secondary" data-action="nav-home">Volver al inicio</button></div></main>${nav()}`}
function forecastPage(){return `${headerBack('Tu previsión','Hasta el día 30')}<main class="main" id="scroller"><div class="page-content"><div class="flow-kicker">Estimación de movimientos</div><h1 class="simulation-title" style="margin-top:10px">Tu dinero, hasta final de mes</h1><p class="simulation-subtitle">Esta previsión combina la nómina prevista del día 28 y los recibos esperados. Puede cambiar si aparecen nuevos movimientos.</p><div class="simulation-summary"><div class="mini-row" style="border:0"><span>Ingresos previstos</span><strong>+1.850,00 €</strong></div><div class="mini-row"><span>Recibos previstos</span><strong>−1.240,00 €</strong></div><div class="mini-row"><span>Diferencia prevista</span><strong style="color:#16835f">+610,00 €</strong></div></div><div class="notice-strip">${icon('info',16)}Esta es una previsión y puede cambiar si aparecen nuevos movimientos.</div><button class="button-primary" data-action="journey-payments">Ver próximos pagos</button><button class="button-secondary" data-action="nav-home">Volver al inicio</button></div></main>${nav()}`}
function notificationsPage(){const urgent=state.insight==='fraud',warn=state.insight==='warning';return `${brand()}<main class="main" id="scroller"><div class="page-content"><h1 class="page-title">Notificaciones</h1><p class="page-subtitle">Lo importante de tu actividad, en un mismo lugar.</p><button class="product-row" data-action="${urgent?'nav-home':warn?'nav-home':'forecast'}"><span class="row-icon">${icon(urgent?'shield':warn?'receipt':'calendar',22)}</span><span class="row-content"><span class="row-title">${urgent?'Pago retenido para revisar':warn?'Próximo recibo de la luz':'Tu previsión está disponible'}</span><span class="row-subtitle">${urgent?'Revisa el pago de 349 € y toma una decisión':warn?'Te faltan 23 € para el recibo del jueves':'Consulta los movimientos estimados hasta el día 30'}</span></span>${icon('chevron',17)}</button></div></main>${nav()}`}
function profilePage(){return `${brand()}<main class="main" id="scroller"><div class="page-content"><div class="profile-hero"><span class="profile-ring">${icon('user',27)}</span><div><h1 class="page-title" style="margin:0">Laura</h1><p class="page-subtitle" style="margin:5px 0 0">Tu perfil personal</p></div></div><h2 class="page-heading-small">Tus accesos</h2><button class="product-row" data-action="nav-money"><span class="row-icon">${icon('wallet',21)}</span><span class="row-content"><span class="row-title">Mi dinero</span><span class="row-subtitle">Cuentas y movimientos</span></span>${icon('chevron',18)}</button><button class="product-row" data-action="mailbox"><span class="row-icon">${icon('mail',21)}</span><span class="row-content"><span class="row-title">Buzón</span><span class="row-subtitle">Comunicaciones con el banco</span></span>${icon('chevron',18)}</button><button class="product-row" data-action="help"><span class="row-icon">${icon('help',21)}</span><span class="row-content"><span class="row-title">Ayuda</span><span class="row-subtitle">Resolver una duda</span></span>${icon('chevron',18)}</button></div></main>${nav()}`}
function helpPage(){return `${brand()}<main class="main" id="scroller"><div class="page-content"><h1 class="page-title">¿En qué podemos ayudarte?</h1><p class="page-subtitle">Cuéntanos qué necesitas o elige una opción.</p><div class="action-grid"><button class="action-card" data-action="journey-other">${icon('help',24)}Hacer una consulta</button><button class="action-card" data-action="mailbox">${icon('mail',24)}Abrir el buzón</button></div><h2 class="page-heading-small">Gestiones frecuentes</h2><button class="product-row" data-action="journey-bizum"><span class="row-icon">${icon('phone',20)}</span><span class="row-content"><span class="row-title">Enviar un Bizum</span></span>${icon('chevron',18)}</button><button class="product-row" data-action="journey-transfer"><span class="row-icon">${icon('swap',20)}</span><span class="row-content"><span class="row-title">Hacer una transferencia</span></span>${icon('chevron',18)}</button></div></main>${nav()}`}
function coverPage(){return `${headerBack('Cubrir un recibo','Entre tus cuentas')}<main class="main" id="scroller"><div class="page-content">${state.coverDone?`<div style="margin:50px 0 18px;color:#15946d">${icon('checkcircle',45)}</div><h1 class="simulation-title">Traspaso realizado</h1><p class="simulation-subtitle">Has traspasado 23 € desde tu cuenta de ahorro para cubrir el recibo de la luz.</p><button class="button-primary" data-action="nav-home">Volver al inicio</button>`:`<div class="flow-kicker">Propuesta a revisar</div><h1 class="simulation-title" style="margin-top:10px">Te faltan 23 € para el recibo de la luz.</h1><p class="simulation-subtitle">En tu Cuenta Online tienes 64&nbsp;€ y el jueves te pasan 87&nbsp;€. Puedes cubrir la diferencia desde tu cuenta de ahorro.</p><div class="simulation-summary"><div class="mini-row" style="border:0"><span>Desde</span><strong>Cuenta ahorro ···· 3291</strong></div><div class="mini-row"><span>Hasta</span><strong>Cuenta Online ···· 1048</strong></div><div class="mini-row"><span>Importe</span><strong>23,00 €</strong></div><div class="mini-row"><span>Concepto</span><strong>Cubrir recibo de la luz</strong></div></div><button class="button-primary" data-action="cover-confirm">Confirmar traspaso</button><button class="button-secondary" data-action="nav-home">Ahora no</button>`}</div></main>${nav()}`}
function fraudPage(){return `${headerBack('Revisar pago','Seguridad de tu tarjeta')}<main class="main" id="scroller"><div class="page-content">${state.blockDone?`<div style="margin:45px 0 18px;color:#15946d">${icon('checkcircle',46)}</div><h1 class="simulation-title">Tarjeta bloqueada</h1><p class="simulation-subtitle">Hemos bloqueado tu tarjeta terminada en 4821. Puedes revisar su estado desde Tarjetas.</p><button class="button-primary" data-action="nav-home">Volver al inicio</button>`:`<div class="flow-kicker" style="color:#bc241b">Operación retenida</div><h1 class="simulation-title" style="margin-top:10px">¿Quieres bloquear la tarjeta?</h1><p class="simulation-subtitle">Has indicado que no reconoces este pago. Revisa los datos de la operación antes de continuar.</p><div class="simulation-summary"><div class="mini-row" style="border:0"><span>Importe</span><strong>349,00 €</strong></div><div class="mini-row"><span>Comercio</span><strong>tienda-online.xyz</strong></div><div class="mini-row"><span>Tarjeta</span><strong>···· 4821</strong></div><div class="mini-row"><span>Estado</span><strong style="color:#af281d">Retenido</strong></div></div><button class="button-primary" data-action="fraud-confirm" style="background:#b82119">Confirmar bloqueo</button><button class="button-secondary" data-action="nav-home">Volver sin bloquear</button>`}</div></main>${nav()}`}
function sessionReset(){
  const scenario=state.insight==='covered'?'warning':state.insight==='blocked'||state.insight==='verified'?'fraud':state.insight;
  Object.assign(state,{screen:'home',topic:'',text:'',query:'',chatText:'',balanceVisible:true,stage:'form',form:{recipient:'',iban:'',amount:'',concept:''},formError:'',toast:'',detail:'cuenta',contract:'cuenta',priorScreen:'home',insight:validScenarios.includes(scenario)?scenario:'ok',coverDone:false,blockDone:false,mailRead:false,mailOpen:false});
  lastScreen=null;
  render();
}
function launchSplash(){
  window.clearTimeout(bootTimer);window.clearTimeout(bootExitTimer);
  const phone=root.querySelector('.phone');if(!phone)return;
  phone.querySelector('.splash-overlay')?.remove();
  const splash=document.createElement('div');splash.className='splash-overlay';
  splash.innerHTML=`<div class="splash-brand"><span class="splash-logo" role="img" aria-label="Sabadell"><svg width="34" height="34" viewBox="0 0 26.1786 26.047" fill="none" aria-hidden="true"><path fill="#fff" fill-rule="evenodd" d="M13.0888 0C20.3146 0 26.1786 5.83 26.1786 13.023C26.1786 20.217 20.3146 26.047 13.0888 26.047C5.86001 26.047 0 20.217 0 13.023C0 5.83 5.86001 0 13.0888 0ZM13.8084 6.506H7.95237V19.53L14.0359 19.5298C15.1057 19.5269 16.2767 19.4831 17.165 18.827C18.0825 18.164 18.7709 17.154 18.7709 16.016C18.7709 14.328 17.6624 13.094 16.0414 12.77V12.734C17.4142 12.392 18.4071 11.404 18.4071 9.926C18.4071 8.69 17.8524 7.742 16.8042 7.075C15.9078 6.506 14.8405 6.506 13.8084 6.506ZM13.2561 13.9857C13.7516 13.9857 14.3616 13.9857 14.7998 14.2337C15.2399 14.4787 15.5465 14.9897 15.5465 15.4857C15.5465 16.0167 15.2992 16.5477 14.8581 16.8327C14.3817 17.1537 13.6762 17.1187 13.1225 17.1187H11.004V13.9857H13.2561ZM12.8544 8.82C13.371 8.82 14.174 8.764 14.6091 9.012C15.0322 9.259 15.2603 9.714 15.2603 10.191C15.2603 10.629 15.0674 11.101 14.7056 11.366C14.2493 11.708 13.6192 11.669 13.0856 11.669H11.0033V8.82H12.8544Z"/></svg><svg width="173" height="34" viewBox="0 0 172.609 33.788" fill="none" aria-hidden="true"><path fill="#fff" fill-rule="evenodd" d="M26.0701 7.705C24.0491 2.009 19.3367 0 13.5652 0C10.5372 0 7.69811 0.67 5.2922 2.679C2.93553 4.641 1.73258 7.321 1.73258 10.383C1.73258 17.562 7.50415 19.285 13.3722 20.482C15.3892 20.91 19.1428 21.439 19.1428 24.168C19.1428 26.894 16.2113 27.709 13.9983 27.709C10.5844 27.709 8.08502 26.511 7.12226 23.065L0 24.692C1.4944 31.106 7.12226 33.788 13.324 33.788C16.6444 33.788 20.2492 33.166 22.8923 31.106C25.446 29.142 26.9836 26.081 26.9836 22.874C26.9836 19.622 25.3455 16.894 22.6541 15.123C20.3447 13.591 16.7379 12.92 14.0475 12.347C12.1692 12.009 9.28296 11.436 9.28296 9.047C9.28296 6.508 11.7853 5.98 13.8526 5.98C16.7851 5.98 18.5659 7.082 19.5287 9.858L26.0701 7.705ZM51.5592 33.308C51.1733 32.113 51.0769 30.914 51.0769 29.67V18.328C51.0769 15.41 51.318 12.729 48.8187 10.72C46.8419 9.093 43.5737 8.517 41.0764 8.517C35.9289 8.517 30.1583 10.242 29.4377 16.126L36.1208 16.75C36.1208 14.357 38.0936 13.207 40.3508 13.207C41.411 13.207 42.613 13.543 43.2391 14.357C43.9616 15.265 43.8631 16.508 43.8631 17.562V18.135C40.8814 18.424 36.9861 18.614 34.1993 19.668C30.9774 20.864 28.7152 23.308 28.7152 26.894C28.7152 31.49 32.0798 33.788 36.4092 33.788C40.0663 33.788 42.1788 32.398 44.2028 29.527C44.1536 30.772 44.2491 32.062 44.5385 33.308H51.5592ZM43.8631 22.635C43.8631 24.363 43.9134 25.794 42.9034 27.326C42.0843 28.572 40.7859 29.336 39.3428 29.336C37.373 29.336 36.2183 28.043 36.2183 26.13C36.2183 22.587 41.1688 21.967 43.8631 21.677V22.635ZM62.1426 19.622C62.1426 17.038 62.62 13.352 66.0359 13.352C69.9332 13.352 69.9332 18.424 69.9332 21.152C69.9332 23.783 69.9332 28.856 65.9404 28.856C64.641 28.856 63.63 28.236 62.9587 27.181C62.1889 25.988 62.1426 24.453 62.1426 23.115V19.622ZM54.9741 33.308H58.8202C59.2543 32.016 59.5438 30.626 60.407 29.575C62.1889 32.494 63.8722 33.788 67.3826 33.788C74.739 33.788 77.2886 27.516 77.2886 21.152C77.2886 15.41 75.1731 8.517 68.1996 8.517C65.457 8.517 63.4401 9.666 62.2351 12.06H62.0452V0.478H54.9741V33.308ZM101.577 33.308C101.19 32.113 101.098 30.914 101.098 29.67V18.328C101.098 15.41 101.338 12.729 98.8323 10.72C96.8645 9.093 93.5923 8.517 91.0919 8.517C85.9475 8.517 80.1739 10.242 79.4543 16.126L86.1384 16.75C86.1384 14.357 88.1092 13.207 90.3704 13.207C91.4296 13.207 92.6296 13.543 93.2567 14.357C93.9772 15.265 93.8848 16.508 93.8848 17.562V18.135C90.901 18.424 87.0057 18.614 84.2139 19.668C80.9919 20.864 78.7287 23.308 78.7287 26.894C78.7287 31.49 82.0974 33.788 86.4259 33.788C90.081 33.788 92.1974 32.398 94.2204 29.527C94.1712 30.772 94.2647 32.062 94.5561 33.308H101.577ZM93.8848 22.635C93.8848 24.363 93.931 25.794 92.921 27.326C92.102 28.572 90.8025 29.336 89.3624 29.336C87.3886 29.336 86.2349 28.043 86.2349 26.13C86.2349 22.587 91.1864 21.967 93.8848 21.677V22.635ZM125.864 33.308V0.478H118.795V11.581C117.253 9.331 115.43 8.517 112.686 8.517C105.568 8.517 103.741 15.649 103.741 21.439C103.741 27.086 105.663 33.788 112.541 33.788C115.668 33.788 117.689 32.113 119.037 29.527H119.133V33.308H125.864ZM118.795 23.163C118.795 24.363 118.746 25.652 118.17 26.752C117.591 27.85 116.39 28.714 115.093 28.714C111.579 28.714 111.194 24.263 111.194 21.63C111.194 18.71 111.341 13.446 115.378 13.446C118.602 13.446 118.795 17.466 118.795 19.813V23.163ZM151.838 22.347C151.886 19.046 151.355 15.601 149.335 12.826C147.312 10.05 143.804 8.517 140.389 8.517C132.787 8.517 128.511 14.308 128.511 21.487C128.511 28.714 133.271 33.788 140.579 33.788C148.853 33.788 151.69 26.608 151.69 25.41L145.147 24.933C145.147 27.181 142.987 28.761 140.822 28.761C137.745 28.761 136.108 26.417 136.108 23.544L136.156 22.347H151.838ZM136.108 18.185C136.351 15.41 137.551 13.11 140.677 13.11C143.756 13.11 144.622 15.551 144.765 18.185H136.108ZM154.962 33.308H162.03V0.478H154.962V33.308ZM165.543 33.308H172.609V0.478H165.543V33.308Z"/></svg></span></div>`;
  phone.appendChild(splash);
  requestAnimationFrame(()=>splash.classList.add('splash-visible'));
  bootTimer=window.setTimeout(()=>{splash.classList.add('splash-dismissing');bootExitTimer=window.setTimeout(()=>splash.remove(),500)},prefersReducedMotion?600:2000);
}
function startParticipantSession(){showPanel=false;sessionReset();launchSplash()}
function copyParticipantLink(){
  const url=new URL(location.href);url.searchParams.delete('research');url.searchParams.set('scenario',validScenarios.includes(state.insight)?state.insight:'ok');
  const str=url.toString();
  if(navigator.clipboard && navigator.clipboard.writeText){navigator.clipboard.writeText(str).then(()=>{state.toast='Enlace copiado';render()}).catch(()=>window.prompt('Copia el enlace:',str))}
  else window.prompt('Copia el enlace:',str);
}
function aside(){if(!researcherEnabled||!showPanel)return '';return `<aside class="stage-info researcher-panel" aria-label="Panel de Research"><div class="research-eyebrow"><span class="research-dot"></span> RESEARCH · CONFIGURACIÓN</div><h1>Prepara la sesión.</h1><p>Configura el estado inicial antes de entregar el dispositivo al participante. Este panel no aparece en el enlace de prueba.</p><div class="step-label">Escenario inicial</div><div class="research-scenarios" role="group" aria-label="Seleccionar escenario"><button class="scenario-option" data-action="insight-ok" aria-pressed="${state.insight==='ok'}"><span class="scenario-state normal"></span><span><strong>Todo en orden</strong><small>Previsión del mes</small></span>${state.insight==='ok'?icon('check',19):''}</button><button class="scenario-option" data-action="insight-warning" aria-pressed="${state.insight==='warning'}"><span class="scenario-state warning"></span><span><strong>Falta saldo</strong><small>Recibo de la luz</small></span>${state.insight==='warning'?icon('check',19):''}</button><button class="scenario-option" data-action="insight-fraud" aria-pressed="${state.insight==='fraud'}"><span class="scenario-state danger"></span><span><strong>Pago retenido</strong><small>Revisión de seguridad</small></span>${state.insight==='fraud'?icon('check',19):''}</button></div><div class="step-label" style="margin-top:26px">Preparar una sesión nueva</div><button class="research-start" data-action="research-start">${icon('send',20)} Iniciar prueba con splash</button><button class="research-neutral" data-action="research-reset">${icon('back',16)} Reiniciar sin splash</button><div class="research-divider"></div><button class="research-copy" data-action="research-copy">${icon('right',18)} Copiar enlace para participante</button><p class="research-hint">La splash original dura 2 segundos. Para mostrar u ocultar este panel durante la sesión: <kbd>Alt</kbd> + <kbd>Mayús</kbd> + <kbd>R</kbd>.</p></aside>`}

function parseAmount(s){return Number(String(s||'').replace(/\s/g,'').replace(/\./g,'').replace(',','.'))}

const SPLASH_LOGO="<span class=\"splash-logo\" role=\"img\" aria-label=\"Sabadell\"><svg width=\"34\" height=\"34\" viewBox=\"0 0 26.1786 26.047\" fill=\"none\" aria-hidden=\"true\"><path fill=\"#fff\" fill-rule=\"evenodd\" d=\"M13.0888 0C20.3146 0 26.1786 5.83 26.1786 13.023C26.1786 20.217 20.3146 26.047 13.0888 26.047C5.86001 26.047 0 20.217 0 13.023C0 5.83 5.86001 0 13.0888 0ZM13.8084 6.506H7.95237V19.53L14.0359 19.5298C15.1057 19.5269 16.2767 19.4831 17.165 18.827C18.0825 18.164 18.7709 17.154 18.7709 16.016C18.7709 14.328 17.6624 13.094 16.0414 12.77V12.734C17.4142 12.392 18.4071 11.404 18.4071 9.926C18.4071 8.69 17.8524 7.742 16.8042 7.075C15.9078 6.506 14.8405 6.506 13.8084 6.506ZM13.2561 13.9857C13.7516 13.9857 14.3616 13.9857 14.7998 14.2337C15.2399 14.4787 15.5465 14.9897 15.5465 15.4857C15.5465 16.0167 15.2992 16.5477 14.8581 16.8327C14.3817 17.1537 13.6762 17.1187 13.1225 17.1187H11.004V13.9857H13.2561ZM12.8544 8.82C13.371 8.82 14.174 8.764 14.6091 9.012C15.0322 9.259 15.2603 9.714 15.2603 10.191C15.2603 10.629 15.0674 11.101 14.7056 11.366C14.2493 11.708 13.6192 11.669 13.0856 11.669H11.0033V8.82H12.8544Z\"/></svg><svg width=\"173\" height=\"34\" viewBox=\"0 0 172.609 33.788\" fill=\"none\" aria-hidden=\"true\"><path fill=\"#fff\" fill-rule=\"evenodd\" d=\"M26.0701 7.705C24.0491 2.009 19.3367 0 13.5652 0C10.5372 0 7.69811 0.67 5.2922 2.679C2.93553 4.641 1.73258 7.321 1.73258 10.383C1.73258 17.562 7.50415 19.285 13.3722 20.482C15.3892 20.91 19.1428 21.439 19.1428 24.168C19.1428 26.894 16.2113 27.709 13.9983 27.709C10.5844 27.709 8.08502 26.511 7.12226 23.065L0 24.692C1.4944 31.106 7.12226 33.788 13.324 33.788C16.6444 33.788 20.2492 33.166 22.8923 31.106C25.446 29.142 26.9836 26.081 26.9836 22.874C26.9836 19.622 25.3455 16.894 22.6541 15.123C20.3447 13.591 16.7379 12.92 14.0475 12.347C12.1692 12.009 9.28296 11.436 9.28296 9.047C9.28296 6.508 11.7853 5.98 13.8526 5.98C16.7851 5.98 18.5659 7.082 19.5287 9.858L26.0701 7.705ZM51.5592 33.308C51.1733 32.113 51.0769 30.914 51.0769 29.67V18.328C51.0769 15.41 51.318 12.729 48.8187 10.72C46.8419 9.093 43.5737 8.517 41.0764 8.517C35.9289 8.517 30.1583 10.242 29.4377 16.126L36.1208 16.75C36.1208 14.357 38.0936 13.207 40.3508 13.207C41.411 13.207 42.613 13.543 43.2391 14.357C43.9616 15.265 43.8631 16.508 43.8631 17.562V18.135C40.8814 18.424 36.9861 18.614 34.1993 19.668C30.9774 20.864 28.7152 23.308 28.7152 26.894C28.7152 31.49 32.0798 33.788 36.4092 33.788C40.0663 33.788 42.1788 32.398 44.2028 29.527C44.1536 30.772 44.2491 32.062 44.5385 33.308H51.5592ZM43.8631 22.635C43.8631 24.363 43.9134 25.794 42.9034 27.326C42.0843 28.572 40.7859 29.336 39.3428 29.336C37.373 29.336 36.2183 28.043 36.2183 26.13C36.2183 22.587 41.1688 21.967 43.8631 21.677V22.635ZM62.1426 19.622C62.1426 17.038 62.62 13.352 66.0359 13.352C69.9332 13.352 69.9332 18.424 69.9332 21.152C69.9332 23.783 69.9332 28.856 65.9404 28.856C64.641 28.856 63.63 28.236 62.9587 27.181C62.1889 25.988 62.1426 24.453 62.1426 23.115V19.622ZM54.9741 33.308H58.8202C59.2543 32.016 59.5438 30.626 60.407 29.575C62.1889 32.494 63.8722 33.788 67.3826 33.788C74.739 33.788 77.2886 27.516 77.2886 21.152C77.2886 15.41 75.1731 8.517 68.1996 8.517C65.457 8.517 63.4401 9.666 62.2351 12.06H62.0452V0.478H54.9741V33.308ZM101.577 33.308C101.19 32.113 101.098 30.914 101.098 29.67V18.328C101.098 15.41 101.338 12.729 98.8323 10.72C96.8645 9.093 93.5923 8.517 91.0919 8.517C85.9475 8.517 80.1739 10.242 79.4543 16.126L86.1384 16.75C86.1384 14.357 88.1092 13.207 90.3704 13.207C91.4296 13.207 92.6296 13.543 93.2567 14.357C93.9772 15.265 93.8848 16.508 93.8848 17.562V18.135C90.901 18.424 87.0057 18.614 84.2139 19.668C80.9919 20.864 78.7287 23.308 78.7287 26.894C78.7287 31.49 82.0974 33.788 86.4259 33.788C90.081 33.788 92.1974 32.398 94.2204 29.527C94.1712 30.772 94.2647 32.062 94.5561 33.308H101.577ZM93.8848 22.635C93.8848 24.363 93.931 25.794 92.921 27.326C92.102 28.572 90.8025 29.336 89.3624 29.336C87.3886 29.336 86.2349 28.043 86.2349 26.13C86.2349 22.587 91.1864 21.967 93.8848 21.677V22.635ZM125.864 33.308V0.478H118.795V11.581C117.253 9.331 115.43 8.517 112.686 8.517C105.568 8.517 103.741 15.649 103.741 21.439C103.741 27.086 105.663 33.788 112.541 33.788C115.668 33.788 117.689 32.113 119.037 29.527H119.133V33.308H125.864ZM118.795 23.163C118.795 24.363 118.746 25.652 118.17 26.752C117.591 27.85 116.39 28.714 115.093 28.714C111.579 28.714 111.194 24.263 111.194 21.63C111.194 18.71 111.341 13.446 115.378 13.446C118.602 13.446 118.795 17.466 118.795 19.813V23.163ZM151.838 22.347C151.886 19.046 151.355 15.601 149.335 12.826C147.312 10.05 143.804 8.517 140.389 8.517C132.787 8.517 128.511 14.308 128.511 21.487C128.511 28.714 133.271 33.788 140.579 33.788C148.853 33.788 151.69 26.608 151.69 25.41L145.147 24.933C145.147 27.181 142.987 28.761 140.822 28.761C137.745 28.761 136.108 26.417 136.108 23.544L136.156 22.347H151.838ZM136.108 18.185C136.351 15.41 137.551 13.11 140.677 13.11C143.756 13.11 144.622 15.551 144.765 18.185H136.108ZM154.962 33.308H162.03V0.478H154.962V33.308ZM165.543 33.308H172.609V0.478H165.543V33.308Z\"/></svg></span>";
const BANK_LOGO=SPLASH_LOGO.replaceAll('fill="#fff"','fill="#006DFF"').replaceAll('fill=\"#fff\"','fill=\"#006DFF\"');
const RS_KEY='sabadell-userzoom-v7';
const liveChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('sabadell-research-v7') : null;
const ROUTES={
 '/':{screen:'splash',title:'Inicio de sesión'},
 '/splash':{screen:'splash',title:'Inicio de sesión'},
 '/acceso':{screen:'login',title:'Acceso'},
 '/inicio':{screen:'home',title:'Inicio'},
 '/mi-dinero':{screen:'money',title:'Mi dinero'},
 '/productos':{screen:'products',title:'Productos'},
 '/contratar':{screen:'contract',title:'Contratar'},
 '/operar':{screen:'operations',title:'Operar'},
 '/perfil':{screen:'profile',title:'Mi perfil'},
 '/ayuda':{screen:'help',title:'Ayuda'},
 '/buzon':{screen:'mailbox',mailOpen:false,title:'Buzón'},
 '/buzon/mensaje':{screen:'mailbox',mailOpen:true,title:'Extracto disponible'},
 '/prevision':{screen:'forecast',title:'Previsión'},
 '/notificaciones':{screen:'notifications',title:'Notificaciones'},
 '/cuentas/online':{screen:'detail',detail:'account',title:'Cuenta Online'},
 '/cuentas/ahorro':{screen:'detail',detail:'savings',title:'Cuenta ahorro'},
 '/tarjetas/debito':{screen:'detail',detail:'card',title:'Tarjeta de débito'},
 '/contratar/cuenta':{screen:'contract-detail',contract:'cuenta',title:'Cuenta'},
 '/contratar/tarjeta':{screen:'contract-detail',contract:'tarjeta',title:'Tarjetas'},
 '/contratar/ahorro':{screen:'contract-detail',contract:'ahorro',title:'Ahorro'},
 '/contratar/solicitud-recibida':{screen:'contract-result',title:'Solicitud recibida'},
 '/conversacion/saldo':{screen:'chat',topic:'balance',title:'Consulta de saldo'},
 '/conversacion/pagos':{screen:'chat',topic:'payments',title:'Próximos pagos'},
 '/conversacion/gasto':{screen:'chat',topic:'spending',title:'Consulta de gastos'},
 '/conversacion/tarjetas':{screen:'chat',topic:'cards',title:'Consulta de tarjetas'},
 '/conversacion/ayuda':{screen:'chat',topic:'other',title:'Consulta'},
 '/conversacion/seguridad':{screen:'chat',topic:'security',title:'Seguridad de la tarjeta'},
 '/conversacion/recibo':{screen:'chat',topic:'cover',title:'Recibo de la luz'},
 '/conversacion/fin-de-mes':{screen:'chat',topic:'month',title:'Fin de mes'},
 '/conversacion/persona':{screen:'chat',topic:'human',title:'Hablar con una persona'},
 '/hipoteca':{screen:'mortgage',title:'Hipoteca'},
 '/hipoteca/amortizar':{screen:'amort',title:'Amortizar hipoteca'},
 '/hipoteca/amortizar/revision':{screen:'amort-review',title:'Revisar amortización'},
 '/hipoteca/amortizacion-programada':{screen:'amort-done',title:'Amortización programada'},
 '/prestamo':{screen:'loan',title:'Préstamo'},
 '/prestamo/revision':{screen:'loan-review',title:'Revisar préstamo'},
 '/prestamo/contratado':{screen:'loan-done',title:'Préstamo contratado'},
 '/conversacion/hipoteca':{screen:'chat',topic:'mortgage',title:'Conversación · Hipoteca'},
 '/conversacion/prestamo':{screen:'chat',topic:'loan',title:'Conversación · Préstamo'},
 '/conversacion/preaprobado':{screen:'chat',topic:'preapproved',title:'Conversación · Preaprobado'},
 '/bizum/datos':{screen:'chat',topic:'bizum',stage:'form',title:'Bizum · Datos'},
 '/bizum/revision':{screen:'chat',topic:'bizum',stage:'review',title:'Bizum · Revisar'},
 '/bizum/completado':{screen:'chat',topic:'bizum',stage:'success',title:'Bizum · Completado'},
 '/transferencia/datos':{screen:'chat',topic:'transfer',stage:'form',title:'Transferencia · Datos'},
 '/transferencia/revision':{screen:'chat',topic:'transfer',stage:'review',title:'Transferencia · Revisar'},
 '/transferencia/completada':{screen:'chat',topic:'transfer',stage:'success',title:'Transferencia · Completada'},
 '/recibos/cubrir':{screen:'cover',coverDone:false,title:'Cubrir recibo'},
 '/recibos/completado':{screen:'cover',coverDone:true,title:'Traspaso realizado'},
 '/seguridad/revisar':{screen:'fraud',blockDone:false,title:'Revisar pago'},
 '/seguridad/tarjeta-bloqueada':{screen:'fraud',blockDone:true,title:'Tarjeta bloqueada'},
 '/seguridad/pago-reconocido':{screen:'recognized',title:'Pago reconocido'},
};
const ROUTE_PATH=decodeURIComponent(location.pathname).replace(/\/+$/,'')||'/';
const currentRoute=ROUTES[ROUTE_PATH]||ROUTES['/inicio'];
const initialQueryParams=new URLSearchParams(location.search);
const requestedScenario=validScenarios.includes(initialQueryParams.get('scenario'))?initialQueryParams.get('scenario'):null;
let saved={};
try {saved=JSON.parse(sessionStorage.getItem(RS_KEY)||'{}')||{};}catch(err){saved={};}
if(!saved.form||typeof saved.form!=='object')saved.form={};
const defaultForm={recipient:'',iban:'',amount:'',concept:''};
const baseState={sim:{amort:'2000',mode:'cuota',loanAmount:'6000',loanMonths:60,purpose:'',secci:false},loan:null,amortDone:null,offerDismissed:false,script:null,scriptTyping:false,via:'',history:[],trail:[],screen:'home',topic:'',text:'',query:'',chatText:'',balanceVisible:true,stage:'form',form:{...defaultForm},formError:'',toast:'',detail:'account',contract:'cuenta',priorScreen:'home',insight:'ok',scenario:'ok',coverDone:false,blockDone:false,mailRead:false,mailOpen:false};
if(ROUTE_PATH==='/'||ROUTE_PATH==='/splash'){
  saved={};
  try {sessionStorage.removeItem(RS_KEY);}catch(err){}
}
Object.assign(state,baseState,saved);
state.form={...defaultForm,...(saved.form||{})};
state.sim={...baseState.sim,...(saved.sim||{})};state.scriptTyping=false;state.toast='';state.pillFill='';
if(requestedScenario && requestedScenario!==state.scenario){
 state.scenario=requestedScenario;
 state.insight=requestedScenario;
 state.coverDone=false;state.blockDone=false;
}
if(!state.scenario)state.scenario=requestedScenario||'ok';
const priorTopic=state.topic;
Object.assign(state,currentRoute);
if(currentRoute.screen==='chat'&&(!state.text || (priorTopic && priorTopic!==currentRoute.topic)))state.text=(texts[currentRoute.topic]||texts.other)[0];
if(state.trail&&state.trail.length&&state.trail[state.trail.length-1]===ROUTE_PATH)state.trail=state.trail.slice(0,-1);
document.body.dataset.pageId=ROUTE_PATH;
document.title='Sabadell · '+currentRoute.title;

// V7.3 · Dirección de la transición entre pantallas (View Transitions entre documentos).
// forward: entra desde la derecha · back: vuelve desde la izquierda · tab: fundido entre pestañas · fade: arranque.
const TAB_SCREENS=['home','money','products','contract'];
let NEXT_DIR=null;
// Sin View Transitions entre documentos (Firefox, Safari < 18.2) se anima a mano: salida antes de navegar y entrada al cargar.
const REDUCED_VT=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
const MANUAL_VT=!REDUCED_VT&&((typeof window.__MANUAL_VT==='boolean')?window.__MANUAL_VT:!('onpagereveal' in window));
let ENTER_DIR=null;
if(MANUAL_VT){try{ENTER_DIR=sessionStorage.getItem('sabadell-vt-dir');sessionStorage.removeItem('sabadell-vt-dir');}catch(err){}if(window.__enterDir){ENTER_DIR=window.__enterDir;window.__enterDir=null;}}
let FIRST_RENDER=true;
function dirFor(path){
 const ts=(ROUTES[path]||ROUTES['/inicio']).screen, cs=state.screen;
 if(['splash','login'].includes(cs)||['splash','login'].includes(ts))return 'fade';
 const a=TAB_SCREENS.includes(cs), b=TAB_SCREENS.includes(ts);
 if(a&&b)return 'tab';
 if(!a&&b)return 'back';
 return 'forward';
}
// V7.4 · «Atrás» vuelve a la pantalla de origen. trail = pila de pantallas visitadas desde la última pestaña principal.
// Desde una pantalla final de un flujo (Bizum enviado, tarjeta bloqueada…) vuelve a donde empezó el flujo, nunca al paso de revisión.
const FLOW_DONE=['/hipoteca/amortizacion-programada','/prestamo/contratado','/bizum/completado','/transferencia/completada','/recibos/completado','/seguridad/tarjeta-bloqueada','/seguridad/pago-reconocido','/contratar/solicitud-recibida'];
function flowOf(p){const m=String(p).match(/^\/(bizum|transferencia|recibos|seguridad|hipoteca|prestamo)\//);if(m)return m[1];if(/^\/contratar\/./.test(p))return 'contratar';return null;}
function backTarget(){
 const t=[...(state.trail||[])];
 if(FLOW_DONE.includes(ROUTE_PATH)){const f=flowOf(ROUTE_PATH);while(t.length&&flowOf(t[t.length-1])===f)t.pop();}
 const prev=t.pop()||'/inicio';
 state.trail=t;return prev;
}
function trailOnGoto(path,isBack){
 const ts=(ROUTES[path]||{}).screen;
 if(TAB_SCREENS.includes(ts)){state.trail=[];return;}
 if(isBack){const t=state.trail||[];if(t[t.length-1]===path)state.trail=t.slice(0,-1);return;}
 if(flowOf(path)==='bizum'&&flowOf(ROUTE_PATH)==='bizum')return;
 if(['splash','login'].includes(state.screen))return;
 state.trail=[...(state.trail||[]),ROUTE_PATH].slice(-20);
}
function setVtDir(path){const d=NEXT_DIR||dirFor(path);NEXT_DIR=null;window.__vtDir=d;try{sessionStorage.setItem('sabadell-vt-dir',d);}catch(err){}}
function saveState(){try {sessionStorage.setItem(RS_KEY,JSON.stringify(state));}catch(err){}}
function appUrl(path){
 const qs=new URLSearchParams(location.search);
 qs.delete('research');qs.delete('paso');
 qs.set('scenario',state.scenario||'ok');
 if(state.via)qs.set('via',state.via);else qs.delete('via');
 return path+(qs.size?'?'+qs.toString():'');
}
function goto(path,replace=false){
 saveState();
 if(path===ROUTE_PATH){render();return;}
 trailOnGoto(path,NEXT_DIR==='back');
 setVtDir(path);
 if(TAB_SCREENS.includes((ROUTES[path]||{}).screen)){state.via='';state.history=[];}
 saveState();
 const go=()=>{if(replace)location.replace(appUrl(path));else location.assign(appUrl(path));};
 const shell=MANUAL_VT&&root.querySelector('.screen-shell');
 if(!shell){go();return;}
 shell.className='screen-shell vt-manual-exit-'+window.__vtDir;
 setTimeout(go,170);return;
 if(replace)location.replace(appUrl(path));else location.assign(appUrl(path));
}
function applyLiveScenario(msg){
 if(!msg||msg.kind!=='scenario'||!validScenarios.includes(msg.value))return;
 state.scenario=msg.value;state.insight=msg.value;state.coverDone=false;state.blockDone=false;
 saveState();
 if(state.screen==='home')render();
}
if(liveChannel)liveChannel.addEventListener('message',event=>applyLiveScenario(event.data));
window.addEventListener('storage',event=>{
 if(event.key==='sabadell-research-command'&&event.newValue){
  try {const msg=JSON.parse(event.newValue);applyLiveScenario(msg);}catch(err){}
 }
});

// Recognises common intents and pre-fills uncomplicated requests. Not a remote AI service.
function guess(q){
 const s=q.toLocaleLowerCase('es').normalize('NFD').replace(/[̀-ͯ]/g,'');
 const ins=state.insight;
 const AMT=/\d+(?:[.,]\d{1,2})?\s*(?:€|eur\b|euros?\b|pavos\b)/;
 if(/persona|humano|gestor|agente|hablar con (alguien|un|una)|llamar|atencion al cliente/.test(s))return 'human';
 if(/bloque|robad|robo|perdid|he perdido|fraude|no reconozco|no (he|lo he) (sido|hecho)|no fui yo|cargo raro|sospech|retenid|tienda-online/.test(s))return 'security';
 if(ins==='fraud'&&/pago|cargo|349|compra/.test(s))return 'security';
 if((ins==='warning'||ins==='covered')&&/cubr|me falta|no me llega para|la luz|traspas|desde (el|mi) ahorro/.test(s))return 'cover';
 if(/preaprobad|por que (tengo|veo|me sale) (un |el |este )?prestamo|oferta de prestamo/.test(s))return 'preapproved';
 if(/hipoteca|amortiz|euribor|cuota de (la )?casa|cuota del piso/.test(s))return 'mortgage';
 if(/prestamo|financiar|financiacion|credito personal|pedir dinero|necesito (dinero|\d)|me hace falta dinero|me falta(n)? \d|para (un|el) coche|para (una|la) reforma/.test(s))return 'loan';
 if(/bizum/.test(s))return 'bizum';
 if(/transferencia|iban|\bes\d{2}/.test(s))return 'transfer';
 if(/\b(envia|enviale|enviar|enviarle|manda|mandale|mandar|mandarle|pasale|pasarle|prestale|devuelvele)\b/.test(s))return /cuenta|transfer/.test(s)?'transfer':'bizum';
 if(/llega a fin|llego a fin|fin de mes|final de mes|prevision|cuanto me quedara/.test(s))return 'month';
 if((AMT.test(s)||/gastar|permitir|capricho|comprar/.test(s))&&/puedo|permit|gast|comprar|capricho/.test(s))return 'spending';
 if(/recib|proxim|pago|cargos|factur|impuesto|domicili|luz|agua|\bgas\b|fibra|movil/.test(s))return 'payments';
 if(/tarjet|debito|credito/.test(s))return 'cards';
 if(/saldo|cuent|dinero|tengo|disponible|ahorro|cuanto me queda/.test(s))return 'balance';
 return 'other';
}
function prefillsFromQuery(topic,q){
 if(topic!=='bizum'&&topic!=='transfer')return;
 const amount=q.match(/(?:\b|^)(\d{1,5}(?:[.,]\d{1,2})?)\s*(?:€|eur\b|euros?\b|pavos\b)/i);
 if(amount)state.form.amount=amount[1];
 const who=q.match(/(?:^|\s)(?:a|para)\s+((?:mi|mis)\s+[a-záéíóúñ]+|[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)?)(?=\s|$|[.,!?])/);
 if(who)state.form.recipient=who[1].trim();
}
const TOPIC_ROUTES={mortgage:'/conversacion/hipoteca',loan:'/conversacion/prestamo',preapproved:'/conversacion/preaprobado',security:'/conversacion/seguridad',cover:'/conversacion/recibo',month:'/conversacion/fin-de-mes',human:'/conversacion/persona',balance:'/conversacion/saldo',payments:'/conversacion/pagos',spending:'/conversacion/gasto',cards:'/conversacion/tarjetas',other:'/conversacion/ayuda',bizum:'/bizum/datos',transfer:'/transferencia/datos'};
function journey(topic,query,via){
 // V7.2 · via = por dónde empezó la tarea: caja (texto en inicio), pill (atajo del inicio), aviso (saludo),
 // chat / chat-boton (dentro de la conversación), nav (resto de la app). Viaja en la URL hasta la pantalla final.
 const fromChat=state.screen==='chat';
 state.via=via||(state.screen==='home'?'pill':fromChat?'chat-boton':'nav');
 if(fromChat&&state.text){state.history=[...(state.history||[]),{text:state.text,topic:state.topic}].slice(-3);}else state.history=[];
 state.script=null;state.scriptTyping=false;
 state.topic=topic;state.text=query||'';state.stage='form';state.form={...defaultForm};state.formError='';state.query='';state.chatText='';state.toast='';
 prefillsFromQuery(topic,query||'');
 let dest=TOPIC_ROUTES[topic]||TOPIC_ROUTES.other;
 if(topic==='bizum'){const sd=bizumSeed(query||'');dest=(BIZUM_STEPS.steps[BIZUM_STEPS.start(sd)]||{}).route||dest;}
 goto(dest);
}
function navigate(screen){
 state.via='';state.history=[];
 const map={home:'/inicio',money:'/mi-dinero',products:'/productos',contract:'/contratar',operations:'/operar',movements:'/mi-dinero',profile:'/perfil',help:'/ayuda',forecast:'/prevision',notifications:'/notificaciones',mailbox:'/buzon'};
 goto(map[screen]||'/inicio');
}
function detailOf(type){state.detail=type;goto(type==='card'?'/tarjetas/debito':type==='savings'?'/cuentas/ahorro':'/cuentas/online')}
function send(from){const q=(from==='chat'?state.chatText:state.query).trim();if(!q){const box=root.querySelector(from==='chat'?'#chat-input':'#home-prompt,#dock-prompt');if(box)box.focus();return;}if(from==='chat'&&state.screen==='chat'&&state.script&&SCRIPT_TOPICS.includes(state.topic)){scriptInput(q);return;}const pf=state.pillFill;state.pillFill='';const via=from==='chat'?'chat':(pf&&q.startsWith(pf.trim()))?'pill-escrita':state.screen==='home'?'caja':'caja-fija';journey(guess(q),q,via)}
function contractResult(){return `${headerBack('Solicitud enviada','Contratar')}<main class="main" id="scroller"><div class="page-content"><div class="success-symbol" style="margin:34px 0 18px">${icon('check',29)}</div><h1 class="simulation-title">Solicitud recibida</h1><p class="simulation-subtitle">Hemos recibido tu solicitud de información. Te contactaremos para continuar.</p><button class="button-primary" data-action="nav-contract">Volver a Contratar</button></div></main>${nav()}`;}
function paymentRecognized(){return `${headerBack('Seguridad','Pago reconocido')}<main class="main" id="scroller"><div class="page-content"><div class="success-symbol" style="margin:34px 0 18px">${icon('check',29)}</div><h1 class="simulation-title">Pago reconocido</h1><p class="simulation-subtitle">Has confirmado el pago de 349,00 € en tienda-online.xyz.</p><button class="button-primary" data-action="nav-home">Volver al inicio</button></div></main>${nav()}`;}
function welcomeSplash(){
 return `<section class="boot-splash" aria-label="Cargando Sabadell"><div class="splash-center">${SPLASH_LOGO}</div><div class="splash-caption">Tu banco, contigo</div></section>`;
}
function faceGlyph(){return `<svg viewBox="0 0 100 100" width="76" height="76" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 8H12a4 4 0 0 0-4 4v10 M78 8h10a4 4 0 0 1 4 4v10 M22 92H12a4 4 0 0 1-4-4V78 M78 92h10a4 4 0 0 0 4-4V78"/><path d="M34 36v10 M66 36v10 M50 38v12l-5 4 M36 64c4 5 24 5 28 0"/></svg>`;}
function loginScreen(){return `<header class="brandbar login-top"><button class="iconbtn" data-action="back-login" aria-label="Volver">${icon('back')}</button></header><main class="main login-body"><div class="login-mark">${BANK_LOGO}</div><p class="login-safe">${icon('shield',16)} Estás en un <strong>entorno seguro</strong></p><div class="login-account"><span class="login-avatar">${icon('user',36)}</span><h1>Hola, Laura</h1><p>Accede a tu banca digital</p></div><button class="button-primary face-primary" data-action="face-start">${icon('lock',19)} Acceder con Face ID</button><button class="login-fallback" data-action="face-start">Entrar</button></main>${state.faceScanning?`<div class="face-overlay"><div class="face-card"><div class="face-glyph ${state.faceDone?'face-done':''}">${state.faceDone?icon('check',66):faceGlyph()}</div><h2>${state.faceDone?'Identidad verificada':'Face ID'}</h2><p>${state.faceDone?'Acceso autorizado':'Verificando tu identidad…'}</p></div></div>`:''}`;}
let faceTimer=null;
function startFace(){
 if(faceTimer)return;
 state.faceScanning=true;state.faceDone=false;render();
 faceTimer=window.setTimeout(()=>{state.faceDone=true;render();faceTimer=window.setTimeout(()=>{faceTimer=null;state.faceScanning=false;state.faceDone=false;goto('/inicio')},620)},1350);
}
let TOAST_T=null;
function render(){
 const content=state.screen==='splash'?welcomeSplash():state.screen==='login'?loginScreen():state.screen==='home'?home():state.screen==='chat'?chat():state.screen==='products'?products():state.screen==='money'?moneyPage():state.screen==='detail'?detail():state.screen==='operations'?operations():state.screen==='contract'?contractPage():state.screen==='contract-detail'?contractDetail():state.screen==='contract-result'?contractResult():state.screen==='mailbox'?mailboxPage():state.screen==='profile'?profilePage():state.screen==='help'?helpPage():state.screen==='cover'?coverPage():state.screen==='fraud'?fraudPage():state.screen==='recognized'?paymentRecognized():state.screen==='forecast'?forecastPage():state.screen==='notifications'?notificationsPage():CREDIT_SCREENS[state.screen]?CREDIT_SCREENS[state.screen]():home();
 // V7.7 · Reglas de barras. Cabecera de pestañas solo en las 4 pestañas; el resto, volver + título.
 // Barra inferior solo en pestañas y pantallas de detalle (con la pestaña padre marcada); los flujos van a pantalla completa.
 const NAV_SCREENS=['home','money','products','contract','detail','forecast','contract-detail','mortgage','mailbox','profile','help','notifications','operations'];
 const SECONDARY=['operations','profile','help','mailbox','notifications'];
 const DOCK_SCREENS=['money','products','contract','detail','forecast','contract-detail','mortgage'];
 let body=content;
 const hasNav=NAV_SCREENS.includes(state.screen)||(state.screen==='loan'&&!!state.loan);
 if(!hasNav)body=body.replace(/<nav class="bottomnav"[\s\S]*?<\/nav>/,'');
 if(SECONDARY.includes(state.screen))body=body.replace(/<header class="brandbar">[\s\S]*?<\/header>/,backOnly());
 if(hasNav&&DOCK_SCREENS.includes(state.screen))body=body.replace('<nav class="bottomnav"',askDock()+'<nav class="bottomnav"');
 const isBoot=state.screen==='splash';
 root.innerHTML=`<div class="stage participant-mode"><section class="phone ${isBoot?'phone-splash':''}" aria-label="Sabadell">${status()}<div class="screen-shell ${FIRST_RENDER&&ENTER_DIR?'vt-manual-enter-'+ENTER_DIR:''}">${body}</div><div class="home-indicator" aria-hidden="true"></div><div class="toast ${state.toast?'visible':''}" role="status">${esc(state.toast)}</div></section></div>`;
 saveState();
 clearTimeout(TOAST_T);
 if(state.toast)TOAST_T=setTimeout(()=>{state.toast='';const t=root.querySelector('.toast');if(t)t.classList.remove('visible');saveState();},3200);
 if(FIRST_RENDER&&state.screen==='chat'&&state.script){const sc=root.querySelector('#scroller');if(sc)sc.scrollTop=sc.scrollHeight;}
 FIRST_RENDER=false;
}
function handleAct(a){
 if(a==='face-start'){startFace();return;}
 if(a==='back-login'){NEXT_DIR='fade';goto('/splash');return;}
 if(a==='profile'){navigate('profile');return;}
 if(a==='help'){navigate('help');return;}
 if(a==='forecast'){navigate('forecast');return;}
 const viaHere=()=>state.screen==='home'?'aviso':state.screen==='chat'?'chat-boton':state.screen==='notifications'?'notificacion':(state.via||'nav');
 if(a==='cover'){state.via=viaHere();state.coverDone=false;goto('/recibos/cubrir');return;}
 if(a==='cover-confirm'){state.coverDone=true;state.insight='covered';goto('/recibos/completado');return;}
 if(a==='fraud-block'){state.via=viaHere();state.blockDone=false;goto('/seguridad/revisar');return;}
 if(a==='fraud-confirm'){state.blockDone=true;state.insight='blocked';goto('/seguridad/tarjeta-bloqueada');return;}
 if(a==='fraud-legit'){state.via=viaHere();state.insight='verified';goto('/seguridad/pago-reconocido');return;}
 if(a.startsWith('sc-')&&state.script){const c=scriptChips()[Number(a.slice(3))];if(c)scriptAdvance(c.label,c);return;}
 if(a==='mortgage-open'){goto('/hipoteca');return;}
 if(a==='amort-start'){state.sim.amort=state.sim.amort||'2000';goto('/hipoteca/amortizar');return;}
 if(a.startsWith('amort-amt-')){state.sim.amort=a.slice(10);render();return;}
 if(a==='mode-cuota'||a==='mode-plazo'){state.sim.mode=a.slice(5);render();return;}
 if(a==='amort-review'){const A=parseAmount(state.sim.amort),m=mortgage();if(!Number.isFinite(A)||A<1000||A>money().online||A>m.pendiente-1000){state.toast='Revisa el importe: tiene que estar entre 1.000 € y lo que tienes en tu Cuenta Online.';render();return;}goto('/hipoteca/amortizar/revision');return;}
 if(a==='amort-confirm'){state.amortDone=amortSim(parseAmount(state.sim.amort),state.sim.mode);goto('/hipoteca/amortizacion-programada');return;}
 if(a==='amort-edit'){NEXT_DIR='back';goto('/hipoteca/amortizar');return;}
 if(a==='loan-open'){goto('/prestamo');return;}
 if(a.startsWith('loan-amt-')){state.sim.loanAmount=a.slice(9);render();return;}
 if(a.startsWith('loan-m-')){state.sim.loanMonths=Number(a.slice(7));render();return;}
 if(a==='loan-review'){const A=parseAmount(state.sim.loanAmount);if(!Number.isFinite(A)||A<LOAN.min||A>LOAN.max){state.toast=`Elige un importe entre ${fmt(LOAN.min)} y ${fmt(LOAN.max)}.`;render();return;}state.sim.secci=false;state.formError='';goto('/prestamo/revision');return;}
 if(a==='loan-confirm'){if(!state.sim.secci){state.formError='Marca que has leído la información precontractual para continuar.';render();return;}state.formError='';state.loan=loanSim(parseAmount(state.sim.loanAmount),Number(state.sim.loanMonths)||60);goto('/prestamo/contratado');return;}
 if(a==='loan-edit'){NEXT_DIR='back';goto('/prestamo');return;}
 if(a==='loan-ask'){const A=parseAmount(state.sim.loanAmount)||6000;journey('loan',`Tengo dudas con ${fmt(A).replace(',00','')} a ${state.sim.loanMonths} meses`);return;}
 if(a==='loan-dismiss'){state.offerDismissed=true;state.toast='No volveremos a mostrarte esta oferta en Productos.';NEXT_DIR='back';goto('/productos');return;}
 if(a==='bizum-send'){const sc=state.script;if(!sc||sc.id!=='bizum'||sc.step!=='confirm'||sc.sending)return;sc.sending=true;renderChat();window.setTimeout(()=>{sc.sending=false;scriptPushBot('sent');NEXT_DIR='fade';goto('/bizum/completado');},prefersReducedMotion?0:900);return;}
 if(a.startsWith('fill-')){const t=a.slice(5);state.query=PILL_TEXT[t]||'';state.pillFill=state.query;state.toast='';render();const ta=root.querySelector('#home-prompt');if(ta){ta.focus();ta.setSelectionRange(ta.value.length,ta.value.length);}return;}
 if(a.startsWith('journey-')){journey(a.slice(8));return;}
 if(a.startsWith('nav-')){let t=a.slice(4);navigate(t==='operar'?'operations':t);return;}
 if(a==='back'){
  const target=backTarget();
  if((ROUTES[target]||{}).screen==='chat'&&state.history&&state.history.length){const h=state.history[state.history.length-1];state.history=state.history.slice(0,-1);state.text=h.text;state.topic=h.topic;}
  NEXT_DIR='back';goto(target);return;
 }
 if(a==='mailbox'||a==='alerts'){state.mailOpen=false;goto('/buzon');return;}
 if(a==='mail-open'){state.mailRead=true;state.mailOpen=true;goto('/buzon/mensaje');return;}
 if(a==='mail-back'){state.mailOpen=false;goto('/buzon');return;}
 if(a==='contract-info'){goto('/contratar/solicitud-recibida');return;}
 if(a.startsWith('contract-')){state.contract=a.slice(9);goto('/contratar/'+state.contract);return;}
 if(a==='send-home'){send('home');return;}
 if(a==='send-chat'){send('chat');return;}
 if(a==='detail-account'){detailOf('account');return;}
 if(a==='detail-savings'){detailOf('savings');return;}
 if(a==='detail-card'){detailOf('card');return;}
 if(a==='privacy'){state.balanceVisible=!state.balanceVisible;render();return;}
 if(a==='review'){
  const f=state.form,amount=parseAmount(f.amount);let err='';
  if(!f.recipient.trim())err='Introduce un destinatario.';
  else if(state.topic==='transfer'&&!/^ES\d{22}$/i.test(f.iban.replace(/\s+/g,'')))err='Introduce un IBAN español válido de 24 caracteres (ES y 22 dígitos).';
  else if(!Number.isFinite(amount)||amount<=0||amount>20000)err='Introduce un importe válido mayor que 0 y menor de 20.000 €.';
  if(err){state.formError=err;render();return;}
  state.formError='';goto(state.topic==='transfer'?'/transferencia/revision':'/bizum/revision');return;
 }
 if(a==='edit'){NEXT_DIR='back';goto(state.topic==='transfer'?'/transferencia/datos':'/bizum/datos');return;}
 if(a==='confirm'){goto(state.topic==='transfer'?'/transferencia/completada':'/bizum/completado');return;}
 if(a==='new-operation'){journey(state.topic);return;}
 if(a==='mic'){state.toast='El micrófono no está disponible. Puedes escribir tu consulta.';render();return;}
 if(a==='more-ideas'){navigate('operations');return;}
}
root.addEventListener('click',e=>{
 const el=e.target.closest('[data-action]');if(!el||!root.contains(el))return;
 e.preventDefault();handleAct(el.getAttribute('data-action'));
});
root.addEventListener('input',e=>{
 const name=e.target.name,value=e.target.value;
 if(name==='query')state.query=value;
 else if(name==='chatText')state.chatText=value;
 else if(name==='simAmort'||name==='simLoan'){if(name==='simAmort')state.sim.amort=value;else state.sim.loanAmount=value;const box=root.querySelector('#sim-result');if(box)box.innerHTML=name==='simAmort'?amortResult():loanResult();root.querySelectorAll('.choice-chip[data-action^="amort-amt-"],.choice-chip[data-action^="loan-amt-"]').forEach(b=>b.setAttribute('aria-pressed',String(parseAmount(value)===Number(b.dataset.action.split('-').pop()))));}
 else if(name==='secci'){state.sim.secci=e.target.checked;if(state.sim.secci&&state.formError){state.formError='';const er=root.querySelector('.check-row + .form-error');if(er)er.remove();}}
 else if(Object.prototype.hasOwnProperty.call(state.form,name))state.form[name]=value;
 saveState();
});
root.addEventListener('keydown',e=>{
 if(e.key==='Enter'&&!e.shiftKey&&(e.target.name==='query'||e.target.name==='chatText')){
  e.preventDefault();send(e.target.name==='query'?'home':'chat');
 }
});
window.addEventListener('pageshow',()=>{
 // Each URL is a full document navigation; returning with Back/Forward recovers session state.
});
render();
if(state.screen==='splash')window.setTimeout(()=>goto('/acceso'),window.matchMedia('(prefers-reduced-motion: reduce)').matches?600:2000);
if(state.screen==='login')window.setTimeout(()=>startFace(),850);

})();
