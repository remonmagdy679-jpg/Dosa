/* Dosa store — app logic. Data lives in config.js */
(function(){
const D = window.DOSA, S = D.store, P = D.product;
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const fmt = n => Math.round(n).toLocaleString('ar-EG') + ' ' + S.currency;
const wa = txt => 'https://wa.me/' + S.whatsapp + (txt ? '?text=' + encodeURIComponent(txt) : '');
const store = {get(k,d){try{const v=localStorage.getItem('dosa_'+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem('dosa_'+k,JSON.stringify(v))}catch(e){}}};

/* ---------- palette ---------- */
function applyPalette(id){
  const p = D.palettes[id] || D.palettes[S.defaultPalette]; const r = document.documentElement.style;
  r.setProperty('--a-l',p.accent); r.setProperty('--a-d',p.accentDark); r.setProperty('--brand-ink',p.ink);
  r.setProperty('--soft-l',p.soft); r.setProperty('--soft-d',p.softDark);
  $$('#tpPanel button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.p===id));
  store.set('palette',id);
}
let pal = store.get('palette',S.defaultPalette); if(!D.palettes[pal]) pal=S.defaultPalette;
if(S.showThemePicker){
  $('#themePick').hidden=false;
  $('#tpPanel').innerHTML = Object.entries(D.palettes).map(([k,v])=>`<button type="button" data-p="${k}"><i style="background:linear-gradient(135deg,${v.accent} 50%,${v.ink} 50%)"></i>${v.name}</button>`).join('');
  $('#tpBtn').onclick=()=>{const o=$('#tpPanel').hidden;$('#tpPanel').hidden=!o;$('#tpBtn').setAttribute('aria-expanded',o)};
  $('#tpPanel').onclick=e=>{const b=e.target.closest('[data-p]');if(b)applyPalette(b.dataset.p)};
}
applyPalette(pal);

/* ---------- art (SVG placeholders until real photos) ---------- */
const dev = c => `<rect x="150" y="160" width="100" height="100" rx="26" fill="${c}" stroke="var(--line)" stroke-width="3"/><circle cx="200" cy="203" r="17" fill="var(--accent)"/><rect x="186" y="238" width="28" height="5" rx="2.5" fill="var(--muted)" opacity=".45"/>`;
const ART = {
  front: c=>`<svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"><rect width="400" height="400" fill="var(--surface)"/><circle cx="200" cy="205" r="130" fill="var(--soft)"/><ellipse cx="200" cy="288" rx="78" ry="9" fill="var(--line)"/>${dev(c)}</svg>`,
  side: c=>`<svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"><rect width="400" height="400" fill="var(--soft)"/><g transform="rotate(-14 200 210)">${dev(c)}</g><path d="M120 300h160" stroke="var(--line)" stroke-width="6" stroke-linecap="round"/></svg>`,
  room: c=>`<svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"><rect width="400" height="400" fill="var(--soft)"/><rect x="60" y="56" width="280" height="72" rx="14" fill="var(--surface)" stroke="var(--line)" stroke-width="3"/><path d="M82 108h236" stroke="var(--line)" stroke-width="4"/><path d="M110 140v24M160 140v34M210 140v24M260 140v34M310 140v24" stroke="var(--accent)" stroke-width="3" stroke-linecap="round" opacity=".5"/><g transform="translate(-20 60) scale(.7)">${dev(c)}</g><path d="M150 215 Q 185 170 205 140" stroke="var(--accent)" stroke-width="4" fill="none" stroke-dasharray="6 8"/><rect x="40" y="305" width="320" height="12" rx="6" fill="var(--muted)" opacity=".3"/></svg>`,
  app: ()=>`<svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"><rect width="400" height="400" fill="var(--surface)"/><circle cx="200" cy="200" r="150" fill="var(--soft)"/><rect x="128" y="46" width="144" height="300" rx="28" fill="var(--ink)"/><rect x="140" y="66" width="120" height="260" rx="16" fill="var(--bg)"/><text x="200" y="128" text-anchor="middle" font-family="Alexandria" font-size="36" font-weight="800" fill="var(--ink)">24°</text><text x="200" y="150" text-anchor="middle" font-family="IBM Plex Sans Arabic" font-size="12" fill="var(--muted)">تبريد · مروحة متوسطة</text><rect x="158" y="170" width="84" height="36" rx="18" fill="var(--accent)"/><text x="200" y="194" text-anchor="middle" font-family="IBM Plex Sans Arabic" font-size="15" fill="var(--on-accent)">تشغيل</text><rect x="156" y="224" width="40" height="40" rx="10" fill="var(--surface)"/><rect x="204" y="224" width="40" height="40" rx="10" fill="var(--surface)"/><rect x="156" y="272" width="88" height="34" rx="10" fill="var(--surface)"/></svg>`,
  box: ()=>`<svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"><rect width="400" height="400" fill="var(--bg)"/><path d="M90 170 L200 118 L310 170 L310 292 L200 344 L90 292Z" fill="var(--surface)" stroke="var(--line)" stroke-width="3"/><path d="M90 170 L200 222 L310 170 M200 222 V344" stroke="var(--line)" stroke-width="3" fill="none"/><path d="M90 170 L200 118 L310 170 L200 222Z" fill="var(--accent)"/><text x="132" y="278" font-family="Alexandria" font-weight="800" font-size="26" fill="var(--ink)" transform="rotate(25 132 278)">Dosa</text></svg>`,
  phone: ()=>`<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="var(--soft)"/><rect x="60" y="60" width="90" height="180" rx="18" fill="var(--ink)"/><rect x="68" y="74" width="74" height="150" rx="10" fill="var(--surface)"/><circle cx="105" cy="140" r="18" fill="var(--accent)"/><path d="M165 150 C 220 120, 250 120, 300 110" stroke="var(--accent)" stroke-width="4" stroke-dasharray="6 8" fill="none"/><rect x="262" y="70" width="110" height="40" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="3"/><text x="318" y="164" text-anchor="middle" font-family="Alexandria" font-size="34" font-weight="800" fill="var(--ink)">24°</text></svg>`,
  moon: ()=>`<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="var(--soft)"/><path d="M240 60 a70 70 0 1 0 60 110 a55 55 0 1 1 -60 -110z" fill="var(--accent)"/><text x="120" y="180" text-anchor="middle" font-family="Alexandria" font-size="46" font-weight="800" fill="var(--ink)">4:00</text><text x="120" y="214" text-anchor="middle" font-family="IBM Plex Sans Arabic" font-size="16" fill="var(--muted)">قفل تلقائي</text></svg>`,
  ir: ()=>`<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice"><rect width="400" height="300" fill="var(--soft)"/><rect x="40" y="62" width="150" height="46" rx="10" fill="var(--surface)" stroke="var(--line)" stroke-width="3"/><rect x="216" y="150" width="154" height="96" rx="10" fill="var(--ink)"/><rect x="226" y="160" width="134" height="76" rx="4" fill="var(--accent)" opacity=".35"/><g transform="translate(40 34) scale(.55)">${dev('var(--surface)')}</g><path d="M190 140 L218 122 M200 176 L226 188" stroke="var(--accent)" stroke-width="4" stroke-linecap="round"/></svg>`,
  hero: ()=>`<svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice"><rect width="400" height="400" fill="var(--a-d)" opacity=".14"/><circle cx="200" cy="200" r="150" fill="none" stroke="var(--a-d)" stroke-width="2" opacity=".35"/><circle cx="200" cy="200" r="110" fill="none" stroke="var(--a-d)" stroke-width="2" opacity=".5"/>${dev('#F7F7F5')}<text x="200" y="110" text-anchor="middle" font-family="Alexandria" font-size="40" font-weight="800" fill="var(--a-d)">24°</text></svg>`,
  video: ()=>`<svg viewBox="0 0 800 350" preserveAspectRatio="xMidYMid slice"><rect width="800" height="350" fill="var(--band)"/><circle cx="640" cy="80" r="160" fill="var(--a-d)" opacity=".18"/><circle cx="140" cy="320" r="120" fill="var(--a-d)" opacity=".12"/></svg>`
};
const ICON = {
  plug:'<path d="M9 3v5M15 3v5M6 8h12v4a6 6 0 0 1-12 0zM12 18v3"/>',
  cam:'<circle cx="12" cy="10" r="6"/><circle cx="12" cy="10" r="2"/><path d="M8 21h8M12 16v5"/>',
  bulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
  bell:'<rect x="7" y="2" width="10" height="20" rx="3"/><circle cx="12" cy="8" r="2"/><circle cx="12" cy="15" r="1"/>',
  motion:'<circle cx="12" cy="12" r="3"/><path d="M6.3 6.3a8 8 0 0 0 0 11.4M17.7 6.3a8 8 0 0 1 0 11.4"/>',
  ac:'<rect x="3" y="5" width="18" height="8" rx="2"/><path d="M7 17l-1 3M12 17v3M17 17l1 3M7 9h10"/>'
};
const ico = k => `<svg viewBox="0 0 24 24" class="ico">${ICON[k]}</svg>`;

/* ---------- announce ---------- */
let ai=0; const ann=()=>{$('#announce').innerHTML=`<span>${S.announcements[ai]}</span>`;ai=(ai+1)%S.announcements.length};
ann(); setInterval(ann,4000);

/* ---------- header / mega / mobile nav / search ---------- */
$$('[data-mega]').forEach(b=>{
  b.setAttribute('aria-expanded','false');
  b.addEventListener('click',()=>{const m=$('#'+b.dataset.mega),open=m.hidden;closeMega();if(open){m.hidden=false;b.setAttribute('aria-expanded','true')}});
});
function closeMega(){$$('.mega').forEach(m=>m.hidden=true);$$('[data-mega]').forEach(b=>b.setAttribute('aria-expanded','false'))}
document.addEventListener('click',e=>{if(!e.target.closest('.hdr'))closeMega()});
$$('.mega a').forEach(a=>a.addEventListener('click',closeMega));

const openOv=id=>{$(id).hidden=false;document.body.style.overflow='hidden'};
const closeOv=el=>{el.hidden=true;document.body.style.overflow=''};
$$('.ov').forEach(o=>{o.addEventListener('click',e=>{if(e.target===o||e.target.closest('[data-close]'))closeOv(o)})});
$$('#mnav a').forEach(a=>a.addEventListener('click',()=>closeOv($('#mnav'))));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$$('.ov').forEach(o=>!o.hidden&&closeOv(o));closeMega();$('#tpPanel').hidden=true}});
$('#menuBtn').onclick=()=>openOv('#mnav');
$('#searchBtn').onclick=()=>{openOv('#search');setTimeout(()=>$('#q').focus(),50)};
const catalog=[{n:P.name,p:P.bundles[0].price,h:'#top',k:'تكييف ريموت'},...D.related.map(r=>({n:r.name,p:r.price,h:'#related',k:r.desc}))];
function doSearch(v){
  v=v.trim(); const r=v?catalog.filter(c=>(c.n+c.k).includes(v)):[];
  $('#sres').innerHTML=v?(r.length?r.map(c=>`<a href="${c.h}"><span>${c.n}</span><b>${fmt(c.p)}</b></a>`).join(''):'<p class="tiny">مفيش نتايج. جرّب كلمة تانية أو اسألنا على الواتساب.</p>'):'';
  $$('#sres a').forEach(a=>a.onclick=()=>closeOv($('#search')));
}
$('#q').addEventListener('input',e=>doSearch(e.target.value));
$$('.sugg button').forEach(b=>b.onclick=()=>{$('#q').value=b.dataset.q;doSearch(b.dataset.q)});

/* ---------- WhatsApp links ---------- */
['#waHdr','#waFloat'].forEach(s=>$(s).href=wa('أهلاً دوسة، عندي سؤال'));
$('#askWa').href=wa('أهلاً دوسة، عندي سؤال عن '+P.name);
const ph=S.whatsapp.replace(/^20/,'0');
$('#ftPhone').textContent=ph.replace(/(\d{3})(\d{4})(\d+)/,'$1 $2 $3');
$('#ftTag').textContent=S.tagline+'. من غير مصطلحات، ومن غير كهربائي.';
$('#yr').textContent=new Date().getFullYear();

/* ---------- product ---------- */
let st={b:P.bundles[0].id,c:P.colors[0].id,q:1,w:false,img:0};
const bundle=()=>P.bundles.find(b=>b.id===st.b), color=()=>P.colors.find(c=>c.id===st.c);
const unit=()=>bundle().price+(st.w?P.warranty.price:0);
$('#crumb').innerHTML=`<a href="#top">الرئيسية</a> / <a href="#top">${P.category}</a> / ${P.name}`;
$('#pName').textContent=P.name; $('#pShort').textContent=P.short;
$('#badges').innerHTML=P.badges.map((b,i)=>`<span class="badge">${b}</span>`).join('');
$('#warrantyTxt').innerHTML=`<b>${P.warranty.text}</b> · ‎+${fmt(P.warranty.price)}<small>${P.warranty.note}</small>`;
$('#worksWith').innerHTML=P.worksWith.map(w=>`<b>${w}</b>`).join(' ');
$('#heroArt').innerHTML=ART.hero(); $('#appArt').innerHTML=ART.app(); $('#vArt').innerHTML=ART.video();
if(P.video){$('#videoBlk').href=P.video}else{$('#videoBlk').href=wa('ابعتولي فيديو تشغيل '+P.name)}
$$('.fx').forEach(el=>el.innerHTML=ART[el.dataset.art]());
$$('.more').forEach(b=>b.onclick=()=>{const t=b.previousElementSibling;t.hidden=!t.hidden;b.textContent=t.hidden?'اعرف أكتر':'أقل'});

/* gallery */
const shots = P.images.length ? P.images.map(src=>({img:src})) : [{a:'front'},{a:'side'},{a:'room'},{a:'app'},{a:'box'}];
function shotHtml(s){return s.img?`<img src="${s.img}" alt="${P.name}" loading="lazy">`:ART[s.a](color().hex)}
function drawGallery(){
  $('#slides').innerHTML=shots.map((s,i)=>`<div class="slide" data-i="${i}">${shotHtml(s)}</div>`).join('');
  $('#thumbs').innerHTML=shots.map((s,i)=>`<button type="button" data-i="${i}" aria-label="صورة ${i+1}" aria-pressed="${i===st.img}">${shotHtml(s)}</button>`).join('')
    + `<button type="button" class="vid" id="thVid" aria-label="الفيديو">${ART.hero()}</button>`;
  goImg(st.img,false);
}
function goImg(i,smooth=true){
  st.img=(i+shots.length)%shots.length; const sl=$('#slides');
  sl.scrollTo({left:-sl.clientWidth*st.img*(getComputedStyle(sl).direction==='rtl'?1:-1),behavior:smooth?'smooth':'auto'});
  $$('#thumbs [data-i]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.i===st.img));
  $('#gCount').textContent=`${(st.img+1).toLocaleString('ar-EG')} / ${shots.length.toLocaleString('ar-EG')}`;
}
$('#thumbs').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.id==='thVid'){$('#videoBlk').scrollIntoView({behavior:'smooth',block:'center'});return}goImg(+b.dataset.i)});
$('#gPrev').onclick=()=>goImg(st.img-1); $('#gNext').onclick=()=>goImg(st.img+1);
let sT; $('#slides').addEventListener('scroll',()=>{clearTimeout(sT);sT=setTimeout(()=>{const sl=$('#slides');const i=Math.round(Math.abs(sl.scrollLeft)/sl.clientWidth);if(i!==st.img){st.img=i;$$('#thumbs [data-i]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.i===i));$('#gCount').textContent=`${(i+1).toLocaleString('ar-EG')} / ${shots.length.toLocaleString('ar-EG')}`}},80)});

function drawBuy(){
  const b=bundle(),c=color();
  $('#price').textContent=fmt(b.price); $('#was').textContent=fmt(b.was); $('#save').textContent='وفّر '+fmt(b.was-b.price);
  $('#bundleOpts').innerHTML=P.bundles.map(x=>`<button type="button" class="opt" role="radio" aria-checked="${x.id===st.b}" data-b="${x.id}">${x.tag?`<span class="tag">${x.tag}</span>`:''}<span>${x.name}<small>${x.desc}</small></span><span class="op-p">${fmt(x.price)}<s>${fmt(x.was)}</s></span></button>`).join('');
  $('#colorOpts').innerHTML=P.colors.map(x=>`<button type="button" class="chip" role="radio" aria-checked="${x.id===st.c}" data-c="${x.id}"><span class="sw" style="background:${x.hex}"></span>${x.name}</button>`).join('');
  $('#colorName').textContent=c.name; $('#stock').textContent='● '+c.stock; $('#stock').className='stock'+(c.stock==='متوفر'?'':' low');
  $('#qVal').textContent=st.q.toLocaleString('ar-EG');
  $('#stName').textContent=P.name; $('#stVar').textContent=b.name+' · '+c.name; $('#stPrice').textContent=fmt(unit()*st.q);
}
$('#bundleOpts').addEventListener('click',e=>{const t=e.target.closest('[data-b]');if(t){st.b=t.dataset.b;drawBuy();drawCmp()}});
$('#colorOpts').addEventListener('click',e=>{const t=e.target.closest('[data-c]');if(t){st.c=t.dataset.c;drawBuy();if(!P.images.length)drawGallery()}});
$('#warranty').addEventListener('change',e=>{st.w=e.target.checked;drawBuy()});
$('#qPlus').onclick=()=>{if(st.q<10){st.q++;drawBuy()}}; $('#qMinus').onclick=()=>{if(st.q>1){st.q--;drawBuy()}};

/* countdown to end of month */
function tick(){
  const n=new Date(),end=new Date(n.getFullYear(),n.getMonth()+1,1),d=end-n;
  const dd=Math.floor(d/864e5),hh=Math.floor(d/36e5)%24,mm=Math.floor(d/6e4)%60,ss=Math.floor(d/1e3)%60;
  const p=v=>String(v).padStart(2,'0');
  $('#countdown').textContent=`⏱ العرض بيخلص بعد ${dd} يوم ${p(hh)}:${p(mm)}:${p(ss)}`;
}
tick(); setInterval(tick,1000);

/* shipping estimate */
const near=['القاهرة','الجيزة','القليوبية','الإسكندرية'];
const govOpts=D.governorates.map(g=>`<option>${g}</option>`).join('');
$('#estGov').innerHTML=govOpts; $('#gv').innerHTML=govOpts;
function est(){
  const g=$('#estGov').value,days=near.includes(g)?[2,3]:[3,5];
  const a=new Date(),b=new Date();a.setDate(a.getDate()+days[0]);b.setDate(b.getDate()+days[1]);
  const f=d=>d.toLocaleDateString('ar-EG',{weekday:'long',day:'numeric',month:'long'});
  $('#estTxt').textContent=`يوصلك بين ${f(a)} و${f(b)}`;
}
$('#estGov').addEventListener('change',()=>{$('#gv').value=$('#estGov').value;est()}); est();

/* compare table */
function drawCmp(){
  const rows=[['السعر',b=>`<span class="pr">${fmt(b.price)}</span>`],['ريموت تكييف',b=>b.id==='home'?'2':'1'],['فيشة ذكية',b=>b.id==='one'?'—':'<span class="yes">✓</span>'],['عدد الأوض',b=>b.id==='home'?'2':'1'],['تشغيل على الواتساب',()=>'<span class="yes">✓</span>'],['التوفير',b=>fmt(b.was-b.price)],['',b=>`<button type="button" class="pick" data-pick="${b.id}">${b.id===st.b?'مختارة ✓':'اختار'}</button>`]];
  $('#cmpTable').innerHTML=`<thead><tr><th></th>${P.bundles.map(b=>`<th class="${b.id===st.b?'us':''}">${b.name}</th>`).join('')}</tr></thead><tbody>${rows.map(([l,f])=>`<tr><td>${l}</td>${P.bundles.map(b=>`<td class="${b.id===st.b?'us':''}">${f(b)}</td>`).join('')}</tr>`).join('')}</tbody>`;
}
$('#cmpTable').addEventListener('click',e=>{const t=e.target.closest('[data-pick]');if(!t)return;st.b=t.dataset.pick;drawBuy();drawCmp();$('#buyBox').scrollIntoView({behavior:'smooth',block:'start'})});

/* specs tabs */
$('#specList').innerHTML=P.specs.map(([k,v])=>`<dt>${k}</dt><dd>${v}</dd>`).join('');
$('#inBox').innerHTML=P.inBox.map(i=>`<li>${i}</li>`).join('');
$('#warrantyNote').textContent=P.warrantyNote;
$$('.tabs [role="tab"]').forEach(t=>t.onclick=()=>{$$('.tabs [role="tab"]').forEach(x=>{x.setAttribute('aria-selected',x===t);$('#'+x.dataset.tab).hidden=x!==t})});

/* frequently bought together */
const fbtIds=['plug','bulb']; let fbtOn=new Set(fbtIds);
function drawFbt(){
  const items=[{id:'main',name:P.name,price:P.bundles[0].price,icon:'ac'},...fbtIds.map(i=>D.related.find(r=>r.id===i))];
  const tot=items.filter(i=>i.id==='main'||fbtOn.has(i.id)).reduce((s,i)=>s+i.price,0);
  const cnt=1+fbtOn.size;
  $('#fbt').innerHTML=`<div class="fbt-items">${items.map((it,i)=>`${i?'<span class="plus">+</span>':''}<label class="fbt-item ${it.id==='main'||fbtOn.has(it.id)?'on':''}"><span class="im">${it.id==='main'?'':`<input type="checkbox" data-f="${it.id}" ${fbtOn.has(it.id)?'checked':''} aria-label="${it.name}">`}${ico(it.icon)}</span><span>${it.name}</span><b>${fmt(it.price)}</b></label>`).join('')}</div>
  <div class="fbt-tot"><small>الإجمالي لـ ${cnt.toLocaleString('ar-EG')} منتجات</small><b>${fmt(tot)}</b><button class="btn" type="button" id="fbtAdd">أضف الكل للسلة</button></div>`;
}
$('#fbt').addEventListener('change',e=>{const t=e.target.closest('[data-f]');if(!t)return;t.checked?fbtOn.add(t.dataset.f):fbtOn.delete(t.dataset.f);drawFbt()});
$('#fbt').addEventListener('click',e=>{if(e.target.id!=='fbtAdd')return;
  add({key:'ac-one-'+st.c,name:P.name+' · لوحده',sub:color().name,price:P.bundles[0].price,q:1,icon:'ac'});
  fbtOn.forEach(id=>{const r=D.related.find(x=>x.id===id);add({key:r.id+'-'+r.options[0],name:r.name,sub:r.options[0],price:r.price,q:1,icon:r.icon})});
  toast('اتضافوا للسلة');openCart()});

/* related carousel */
const relSel={};
function drawCar(){
  $('#carousel').innerHTML=D.related.map(r=>{const o=relSel[r.id]||r.options[0];return `<article class="pc"><div class="im">${ico(r.icon)}</div><h3>${r.name}</h3><p>${r.desc}</p><div class="pills">${r.options.map(x=>`<button type="button" data-r="${r.id}" data-o="${x}" aria-pressed="${x===o}">${x}</button>`).join('')}</div><div class="ft"><b>${fmt(r.price)}</b><button type="button" data-add="${r.id}">أضف</button></div></article>`}).join('');
}
$('#carousel').addEventListener('click',e=>{
  const p=e.target.closest('[data-o]'); if(p){relSel[p.dataset.r]=p.dataset.o;drawCar();return}
  const a=e.target.closest('[data-add]'); if(a){const r=D.related.find(x=>x.id===a.dataset.add),o=relSel[r.id]||r.options[0];add({key:r.id+'-'+o,name:r.name,sub:o,price:r.price,q:1,icon:r.icon});toast('اتضاف للسلة')}
});
const carStep=()=>$('#carousel').clientWidth*0.8;
$('#cNext').onclick=()=>$('#carousel').scrollBy({left:-carStep(),behavior:'smooth'});
$('#cPrev').onclick=()=>$('#carousel').scrollBy({left:carStep(),behavior:'smooth'});

/* reviews */
$('#bars').innerHTML=[5,4,3,2,1].map(n=>`<div><span>${n}★</span><i></i><span>0</span></div>`).join('');
let stars=0;
$('#starPick').innerHTML=[1,2,3,4,5].map(n=>`<button type="button" role="radio" aria-checked="false" aria-label="${n} نجوم" data-s="${n}">★</button>`).join('');
$('#starPick').addEventListener('click',e=>{const b=e.target.closest('[data-s]');if(!b)return;stars=+b.dataset.s;$$('#starPick button').forEach(x=>{const on=+x.dataset.s<=stars;x.classList.toggle('on',on);x.setAttribute('aria-checked',+x.dataset.s===stars)})});
$('#revForm').addEventListener('submit',e=>{e.preventDefault();if(!stars){toast('اختار عدد النجوم الأول');return}
  window.open(wa(`تقييمي لـ ${P.name}: ${'★'.repeat(stars)}\n${$('#revTxt').value}`),'_blank');toast('شكراً! كمّل الإرسال من الواتساب')});

/* faq */
function drawFaq(v=''){const r=D.faq.filter(([q,a])=>(q+a).includes(v.trim()));
  $('#faqList').innerHTML=r.length?r.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join(''):'<p class="tiny">مفيش سؤال بالكلام ده. اسألنا على الواتساب.</p>'}
$('#faqQ').addEventListener('input',e=>drawFaq(e.target.value));

/* newsletter */
$('#newsForm').addEventListener('submit',e=>{e.preventDefault();const v=$('#newsPh').value.replace(/\s/g,'');
  if(!/^01[0125]\d{8}$/.test(v)){toast('اكتب رقم موبايل مصري صحيح');return}
  window.open(wa('عايز أشترك في عروض دوسة. رقمي: '+v),'_blank');$('#newsPh').value='';toast('تمام! كمّل من الواتساب')});

/* subnav active + sticky bar */
const secs=$$('.subnav a').map(a=>$(a.getAttribute('href')));
const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){$$('.subnav a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+en.target.id))}}),{rootMargin:'-40% 0px -55% 0px'});
secs.forEach(s=>s&&io.observe(s));
const stickyIo=new IntersectionObserver(([en])=>$('#sticky').classList.toggle('show',!en.isIntersecting&&en.boundingClientRect.top<0));
stickyIo.observe($('#buyNow'));

/* ---------- cart ---------- */
let cart=store.get('cart',[]), coupon=null;
function count(){$('#cartCount').textContent=cart.reduce((s,c)=>s+c.q,0).toLocaleString('ar-EG')}
function add(item){const f=cart.find(c=>c.key===item.key);f?f.q=Math.min(10,f.q+item.q):cart.push(item);store.set('cart',cart);count()}
function mainItem(){const b=bundle(),c=color();return{key:`ac-${b.id}-${st.c}${st.w?'-w':''}`,name:P.name+' · '+b.name,sub:c.name+(st.w?' · ضمان ممتد':''),price:unit(),q:st.q,icon:'ac'}}
function toast(m){const t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(toast.h);toast.h=setTimeout(()=>t.hidden=true,2000)}
function totals(){const sub=cart.reduce((s,c)=>s+c.price*c.q,0);let disc=0;
  if(coupon){disc=coupon.type==='percent'?sub*coupon.value/100:Math.min(coupon.value,sub)}
  const ship=!sub||sub>=S.freeShippingOver?0:S.shippingFee;return{sub,disc,ship,tot:sub-disc+ship}}
function drawCart(done){
  const t=totals(),left=S.freeShippingOver-t.sub;
  $('#shipMsg').textContent=t.sub===0?`الشحن مجاني للطلبات فوق ${fmt(S.freeShippingOver)}`:left>0?`فاضلك ${fmt(left)} وتاخد شحن مجاني`:'مبروك! الشحن عليك مجاني 🎉';
  $('#shipFill').style.width=Math.min(100,t.sub/S.freeShippingOver*100)+'%';
  if(done){$('#lines').innerHTML=done;$('#cartBody').hidden=true;return}
  $('#lines').innerHTML=cart.length?cart.map((c,i)=>`<div class="line"><span class="im">${ico(c.icon||'ac')}</span><div>${c.name}<small>${c.sub||''}</small><div class="lq"><button type="button" data-d="${i}" aria-label="أقل">−</button><span>${c.q.toLocaleString('ar-EG')}</span><button type="button" data-u="${i}" aria-label="أكتر">+</button></div></div><div class="lp">${fmt(c.price*c.q)}<button type="button" class="rm" data-r="${i}">شيل</button></div></div>`).join(''):'<p class="empty">السلة فاضية.<br><a href="#top" data-close style="color:var(--accent)">ابدأ التسوّق</a></p>';
  $('#cartBody').hidden=!cart.length;
  $('#tSub').textContent=fmt(t.sub);$('#tDisc').textContent=t.disc?'− '+fmt(t.disc):'—';$('#tShip').textContent=t.ship?fmt(t.ship):'مجاني';$('#tTot').textContent=fmt(t.tot);
}
function openCart(){drawCart();openOv('#cart')}
$('#lines').addEventListener('click',e=>{const t=e.target;
  if(t.dataset.u!==undefined){const c=cart[+t.dataset.u];if(c.q<10)c.q++}
  else if(t.dataset.d!==undefined){const c=cart[+t.dataset.d];c.q>1?c.q--:cart.splice(+t.dataset.d,1)}
  else if(t.dataset.r!==undefined){cart.splice(+t.dataset.r,1)} else return;
  store.set('cart',cart);count();drawCart()});
$('#cpnBtn').onclick=()=>{const k=$('#cpn').value.trim().toUpperCase(),c=S.coupons[k],m=$('#cpnMsg');m.hidden=false;
  if(c){coupon=c;m.className='err ok-msg';m.textContent='اتطبّق الكود ✓'}else{coupon=null;m.className='err';m.textContent='الكود ده مش شغال. اتأكد منه وجرّب تاني.'}drawCart()};
$('#addBtn').onclick=()=>{add(mainItem());toast('اتضاف للسلة')};
$('#buyNow').onclick=$('#stBuy').onclick=()=>{if(!cart.length)add(mainItem());openCart()};
$('#cartBtn').onclick=openCart;
$('#orderForm').addEventListener('submit',e=>{
  e.preventDefault();
  const phone=$('#ph').value.replace(/\s/g,''),okP=/^01[0125]\d{8}$/.test(phone),okF=$('#nm').value.trim()&&$('#ad').value.trim().length>5;
  $('#phE').hidden=okP;$('#fE').hidden=!!okF;if(!okP||!okF)return;
  const t=totals();
  const msg=`طلب جديد من موقع دوسة\n\n${cart.map(c=>`• ${c.name} (${c.sub}) × ${c.q} = ${fmt(c.price*c.q)}`).join('\n')}\n\nالمنتجات: ${fmt(t.sub)}${t.disc?`\nالخصم: ${fmt(t.disc)}`:''}\nالشحن: ${t.ship?fmt(t.ship):'مجاني'}\nالإجمالي: ${fmt(t.tot)} (دفع عند الاستلام)\n\nالاسم: ${$('#nm').value.trim()}\nالموبايل: ${phone}\nالمحافظة: ${$('#gv').value}\nالعنوان: ${$('#ad').value.trim()}`;
  // TODO (بعد ربط صفقة): ابعت الطلب لـ Cloudflare Worker → Safka API بدل الواتساب
  window.open(wa(msg),'_blank');
  cart=[];coupon=null;store.set('cart',cart);count();
  drawCart(`<div class="done"><span class="ck">✓</span><h3>اتسجّل طلبك</h3><p class="tiny">لو الواتساب ماتفتحش، ابعتلنا على ${ph}.</p><p class="tiny">هنكلمك نأكد قبل الشحن.</p></div>`);
});

/* init */
drawGallery(); drawBuy(); drawCmp(); drawFbt(); drawCar(); drawFaq(); count();
})();
