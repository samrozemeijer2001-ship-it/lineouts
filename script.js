/* =========================================================
   DATA — numbers legend
   ========================================================= */
const NUMBERS = [
  {n:'1', text:'Jumper gaat <b>naar voren</b>, recht op de gooi af.'},
  {n:'2', text:'Jumper springt <b>op de plek</b> waar hij al staat.'},
  {n:'3', text:'Jumper gaat <b>naar achter</b>, weg van zijn beginpositie.'},
  {n:'4', text:'Jumper springt <b>naar buiten</b> (richting 15m) → de achterlifter tilt hem daar op.'},
  {n:'5', text:'Jumper gaat <b>naar voren</b> → de voorlifter doet een <b>dummy-til</b>, de jumper vangt zelf lager en sneller.'},
  {n:'6', text:'Jumper <b>slipt er recht uit</b> op zijn eigen plek → de achterlifter tilt hem op.'},
  {n:'0', text:'Geen sprong. De voorprop draait <b>180°</b> om naar de hooker → snelle bal naar de 9.'},
];

const DIGIT_LABEL = {
  '1':'stapt naar voren',
  '2':'vangt op de plek',
  '3':'stapt naar achteren',
  '4':'springt naar buiten — achterlifter tilt',
  '5':'stapt naar voren — voorlifter faket de til',
  '6':'slipt er recht uit — achterlifter tilt',
  'loop':'loopt weg van zijn eigen plek',
};

/* =========================================================
   DATA — formation layouts (left→right = touchline → 15m)
   ========================================================= */
const LAYOUTS = {
  'm4-middle': {n:4, slots:[
    {id:'B', role:'decoy'},
    {id:'fl_a', role:'lift'},
    {id:'A', role:'jumper'},
    {id:'bl_a', role:'lift'},
  ]},
  'm4-front': {n:4, slots:[
    {id:'fl_a', role:'lift'},
    {id:'A', role:'jumper'},
    {id:'bl_a', role:'lift'},
    {id:'B', role:'decoy'},
  ]},
  'm5-front': {n:5, slots:[
    {id:'fl_c', role:'lift'},
    {id:'C', role:'jumper'},
    {id:'bl_c', role:'lift'},
    {id:'A', role:'decoy'},
    {id:'B', role:'decoy'},
  ]},
  'm5-middle': {n:5, slots:[
    {id:'C', role:'decoy'},
    {id:'fl_a', role:'lift'},
    {id:'A', role:'jumper'},
    {id:'bl_a', role:'lift'},
    {id:'B', role:'decoy'},
  ]},
  'mini': {n:3, slots:[
    {id:'fl', role:'lift'},
    {id:'J', role:'jumper'},
    {id:'bl', role:'lift'},
  ]},
};

function findSlot(layout, id){
  return layout.slots.find(s=>s.id===id);
}
function adjacentLift(layout, jumperId, side){
  // side: 'fl' (front/left) or 'bl' (back/right) — find lift slot immediately next to jumper
  const idx = layout.slots.findIndex(s=>s.id===jumperId);
  if(idx<0) return null;
  const i = side==='fl' ? idx-1 : idx+1;
  const s = layout.slots[i];
  return (s && s.role==='lift') ? s.id : null;
}
function roleLabel(layout, slotId){
  const slot = findSlot(layout, slotId);
  if(!slot) return '';
  if(slot.role === 'jumper') return 'springer';
  if(slot.role === 'decoy') return 'decoy';
  if(slot.role === 'lift'){
    if(slotId.indexOf('fl') === 0) return 'voorlifter';
    if(slotId.indexOf('bl') === 0) return 'achterlifter';
    return 'lifter';
  }
  return '';
}

/* =========================================================
   DATA — calls per group, with "anim" sequence for the diagram
   ========================================================= */
const CALLS = {
  'm4-middle': {
    label:'4-man · middle stack',
    layout:'m4-middle',
    calls:[
      {code:'A1', type:'hoofd', who:'Jumper A', steps:[
        'A stapt naar voren, recht op de gooi af. Beide lifters — voor én achter — tillen hem in dezelfde beweging omhoog zodra hij springt.'],
        anim:{sequence:[{mover:'A', digit:'1'}]}},
      {code:'A5', type:'fake', who:'Jumper A', steps:[
        'A stapt naar voren alsof het een A1 wordt. De voorlifter doet alleen een dummy-til — A vangt zelf, net iets lager en sneller, zonder echt getild te worden.'],
        anim:{sequence:[{mover:'A', digit:'5'}]}},
      {code:'A54', type:'fake', who:'Jumper A · fake→echt', steps:[
        'Fake: A stapt naar voren en de voorlifter doet een dummy-til — precies zoals bij A5. De tegenstander leest dit als de echte bal.',
        'Echt: vlak daarna springt A juist naar buiten. Nu tilt de achterlifter hem écht omhoog — pas hier komt de bal.'],
        anim:{sequence:[{mover:'A', digit:'5', fake:true},{mover:'A', digit:'4'}]}},
      {code:'Zero', type:'hoofd', who:'Geen jumper', steps:[
        'Er wordt niet gesprongen. De voorprop draait in één keer 180° om en speelt de bal direct door aan de hooker, voor een snelle bal naar de 9.'],
        anim:{special:'quick'}},
      {code:'Red', type:'hoofd', who:'Vaste backup', steps:['Vaste backup-worp — details op training'],
        anim:{special:'hidden'}},
      {code:'Slice', type:'fake', who:'Variant', steps:['Speciale variant — details op training'],
        anim:{special:'hidden'}},
    ]
  },
  'm4-front': {
    label:'4-man · front stack',
    layout:'m4-front',
    calls:[
      {code:'A4', type:'hoofd', who:'Jumper A', steps:[
        'A springt vanuit de voorste positie naar buiten, richting het midden van de rij. De achterlifter tilt hem daar in één keer omhoog voor de vangst.'],
        anim:{sequence:[{mover:'A', digit:'4'}]}},
      {code:'A45', type:'fake', who:'Jumper A · fake→echt', steps:[
        'Fake: A springt eerst naar buiten, als bij A4 — de achterlifter beweegt mee alsof hij gaat tillen.',
        'Echt: A stapt in plaats daarvan naar voren en de voorlifter doet een dummy-til — de bal komt bij A op de voorste plek terecht.'],
        anim:{sequence:[{mover:'A', digit:'4', fake:true},{mover:'A', digit:'5'}]}},
      {code:'Zero', type:'hoofd', who:'Geen jumper', steps:[
        'Er wordt niet gesprongen. De voorprop draait 180° om en speelt de bal direct door aan de hooker, voor een snelle bal naar de 9.'],
        anim:{special:'quick'}},
      {code:'Red', type:'hoofd', who:'Vaste backup', steps:['Vaste backup-worp — details op training'],
        anim:{special:'hidden'}},
    ]
  },
  'm5-front': {
    label:'5-man · front stack',
    layout:'m5-front',
    calls:[
      {code:'C1', type:'fake', who:'Jumper C', steps:[
        'C stapt naar voren vanaf de voorste pod, recht op de gooi af. Beide lifters — voor en achter — tillen hem samen omhoog.'],
        anim:{sequence:[{mover:'C', digit:'1'}]}},
      {code:'C5', type:'fake', who:'Jumper C', steps:[
        'C stapt naar voren zoals bij C1, maar de voorlifter faket de til — C vangt de bal net iets lager en sneller op eigen kracht.'],
        anim:{sequence:[{mover:'C', digit:'5'}]}},
      {code:'CLoop', type:'fake', who:'Jumper C · loop', steps:[
        'C loopt weg van zijn eigen plek in de rij en vangt de bal verderop, zonder dat een vaste lifter hem optilt — puur op snelheid en verrassing.'],
        anim:{sequence:[{mover:'C', digit:'loop'}]}},
      {code:'Red', type:'hoofd', who:'Vaste backup', steps:['Vaste backup-worp — details op training'],
        anim:{special:'hidden'}},
    ]
  },
  'm5-middle': {
    label:'5-man · middle stack',
    layout:'m5-middle',
    calls:[
      {code:'A1', type:'hoofd', who:'Jumper A', steps:[
        'A stapt naar voren vanuit het midden van de rij. Beide lifters — voor en achter — tillen hem in dezelfde beweging omhoog.'],
        anim:{sequence:[{mover:'A', digit:'1'}]}},
      {code:'A4', type:'fake', who:'Jumper A', steps:[
        'A springt naar buiten, richting de 15m-lijn. De achterlifter tilt hem daar op voor de vangst.'],
        anim:{sequence:[{mover:'A', digit:'4'}]}},
      {code:'BSlip4', type:'fake', who:'Jumper B · slip', steps:[
        'Fake: B — een decoy verderop in de rij — slipt er recht uit alsof hij zelf springt. Dat moet de tegenstander wegtrekken van de echte actie.',
        'Echt: terwijl de tegenstander op B let, springt A naar buiten en tilt de achterlifter hem écht omhoog voor de vangst.'],
        anim:{sequence:[{mover:'B', digit:'6', fake:true},{mover:'A', digit:'4'}]}},
      {code:'BSlipC', type:'fake', who:'B fake → C echt', steps:[
        'Fake: B slipt er recht uit op zijn eigen plek, net als bij BSlip4 — puur om aandacht weg te trekken van de echte bal.',
        'Echt: de bal gaat naar jumper C, die op zijn eigen plek in de rij vangt zonder dat er specifiek voor hem getild wordt.'],
        anim:{sequence:[{mover:'B', digit:'6', fake:true},{mover:'C', digit:'2'}]}},
      {code:'Red', type:'hoofd', who:'Vaste backup', steps:['Vaste backup-worp — details op training'],
        anim:{special:'hidden'}},
    ]
  },
};

/* =========================================================
   LINEOUT VISUALIZER — builds one clear, static diagram per step
   ========================================================= */
const SVG_NS = 'http://www.w3.org/2000/svg';
const VB_W = 780, VB_H = 285, TRACK_Y = 140;
const X0 = 210, X1 = 700;
const HOOKER_X = 60, HOOKER_Y = 200;
const PROP_X = 150;
const SCRUMHALF_X = 730, SCRUMHALF_Y = 220;
const ROLECAP_Y = TRACK_Y + 68;
const FIELDLABEL_Y = TRACK_Y + 96;

function el(tag, attrs){
  const e = document.createElementNS(SVG_NS, tag);
  for(const k in attrs) e.setAttribute(k, attrs[k]);
  return e;
}
function txt(tag_attrs, content){
  const t = el('text', tag_attrs);
  t.textContent = content;
  return t;
}

function slotX(i, n){
  if(n<=1) return (X0+X1)/2;
  return X0 + i*(X1-X0)/(n-1);
}

const DELTA = {
  '1':  {dx:-60, dy:-70},
  '2':  {dx:0,   dy:-70},
  '3':  {dx:60,  dy:-70},
  '4':  {dx:-20, dy:-100},
  '5':  {dx:-60, dy:-70, dyFake:-28},
  '6':  {dx:20,  dy:-100, dyFake:-28},
  'loop':{dx:120, dy:-70},
};
const LIFT_FOR_DIGIT = {
  '1':'both', '2':'both', '3':'both', '4':'bl', '5':'fl', '6':'bl', 'loop':null,
};
const LIFT_TYPE_FOR_DIGIT = { '5':'dummy' };

function makeBall(x,y){
  return el('circle', {cx:x, cy:y, r:9, class:'lo-ball lo-visible'});
}

/**
 * Builds one static SVG snapshot of the formation for a single step.
 * step: {moverId, digit, fake} OR {quick:true} for the Zero-call.
 */
function buildStepSVG(layoutKey, step, opts){
  opts = opts || {};
  const layout = LAYOUTS[layoutKey];
  const n = layout.slots.length;
  const svg = el('svg', {viewBox:`0 0 ${VB_W} ${VB_H}`, class:'lo-svg'+(opts.small?' small':''), 'aria-hidden':'true'});

  svg.appendChild(el('line', {x1:PROP_X, y1:TRACK_Y, x2:X1, y2:TRACK_Y, class:'lo-track'}));
  svg.appendChild(txt({x:PROP_X-10, y:FIELDLABEL_Y, class:'lo-endlabel', 'text-anchor':'start'}, 'TOUCH'));
  svg.appendChild(txt({x:X1, y:FIELDLABEL_Y, class:'lo-endlabel', 'text-anchor':'end'}, '15M'));

  // hooker
  const hookerG = el('g', {class:'lo-figure lo-figure-support', transform:`translate(${HOOKER_X},${HOOKER_Y})`});
  hookerG.appendChild(el('circle', {r:18, class:'lo-circ lo-role-support'}));
  hookerG.appendChild(txt({class:'lo-idtxt', y:2}, 'H'));
  svg.appendChild(hookerG);
  svg.appendChild(txt({x:HOOKER_X, y:HOOKER_Y+38, class:'lo-rolecap', 'text-anchor':'middle'}, 'hooker'));

  // prop — rotates 180° for the quick-ball call
  const propRot = step.quick ? 180 : 0;
  const propG = el('g', {class:'lo-figure lo-figure-support'+(step.quick?' lo-figure-real':''), transform:`translate(${PROP_X},${TRACK_Y}) rotate(${propRot})`});
  propG.appendChild(el('circle', {r:16, class:'lo-circ lo-role-support'}));
  propG.appendChild(txt({class:'lo-idtxt', y:2}, 'P'));
  svg.appendChild(propG);
  svg.appendChild(txt({x:PROP_X, y:ROLECAP_Y, class:'lo-rolecap', 'text-anchor':'middle'}, 'prop'));

  // scrumhalf — only "lit up" on the quick-ball call
  const shOpacity = step.quick ? '1' : '.45';
  const shG = el('g', {class:'lo-figure lo-figure-support'+(step.quick?' lo-figure-real':''), style:`opacity:${shOpacity}`, transform:`translate(${SCRUMHALF_X},${SCRUMHALF_Y})`});
  shG.appendChild(el('circle', {r:15, class:'lo-circ lo-role-support'}));
  shG.appendChild(txt({class:'lo-idtxt', y:2}, '9'));
  svg.appendChild(shG);
  svg.appendChild(txt({x:SCRUMHALF_X, y:SCRUMHALF_Y+34, class:'lo-rolecap', 'text-anchor':'middle'}, 'scrumhalf'));

  if(step.quick){
    svg.appendChild(makeBall(SCRUMHALF_X, SCRUMHALF_Y));
    return svg;
  }

  // ---- jumpers / lifters / decoys ----
  const moverIdx = layout.slots.findIndex(s=>s.id===step.moverId);
  const moverSlot = layout.slots[moverIdx];
  const delta = DELTA[step.digit] || {dx:0,dy:0};
  const dy = (step.fake && delta.dyFake!==undefined) ? delta.dyFake : delta.dy;
  const dx = delta.dx;
  const moverX = slotX(moverIdx, n) + dx;
  const moverY = TRACK_Y + dy;

  const liftWho = (moverSlot && moverSlot.role === 'jumper') ? LIFT_FOR_DIGIT[step.digit] : null;
  const liftType = step.fake ? 'dummy' : (LIFT_TYPE_FOR_DIGIT[step.digit] || 'real');
  let flId = null, blId = null, activeLiftIds = [];
  if(liftWho){
    flId = adjacentLift(layout, step.moverId, 'fl');
    blId = adjacentLift(layout, step.moverId, 'bl');
    activeLiftIds = (liftWho==='both' ? [flId, blId] : liftWho==='fl' ? [flId] : [blId]).filter(Boolean);
  }
  const readyLiftIds = [flId, blId].filter(id => id && !activeLiftIds.includes(id));

  const positions = {};
  layout.slots.forEach((slot,i)=>{
    let x = slotX(i,n), y = TRACK_Y;
    if(slot.id === step.moverId){ x = moverX; y = moverY; }
    else if(activeLiftIds.includes(slot.id)){ y = TRACK_Y - 26; }
    else if(readyLiftIds.includes(slot.id)){ y = TRACK_Y - 10; }
    positions[slot.id] = {x,y};
  });

  // connecting lines between lifter(s) and the jumper — drawn first, figures sit on top
  [...activeLiftIds, ...readyLiftIds].forEach(id=>{
    const p = positions[id];
    const cls = activeLiftIds.includes(id) ? (liftType==='dummy' ? 'lo-link-fake' : 'lo-link-real') : 'lo-link-ready';
    svg.appendChild(el('line', {x1:p.x, y1:p.y, x2:moverX, y2:moverY, class:'lo-link '+cls}));
  });

  layout.slots.forEach(slot=>{
    const p = positions[slot.id];
    let statusClass = '';
    if(slot.id === step.moverId) statusClass = step.fake ? 'lo-figure-fake' : 'lo-figure-real';
    else if(activeLiftIds.includes(slot.id)) statusClass = liftType==='dummy' ? 'lo-figure-fake' : 'lo-figure-real';
    else if(readyLiftIds.includes(slot.id)) statusClass = 'lo-figure-ready';
    else if(slot.role==='decoy') statusClass = 'lo-figure-idle';

    const r = slot.role==='jumper' ? 27 : slot.role==='decoy' ? 24 : 20;
    const g = el('g', {class:'lo-figure '+statusClass, transform:`translate(${p.x},${p.y})`});
    g.appendChild(el('circle', {r:r, class:'lo-circ lo-role-'+slot.role}));
    g.appendChild(txt({class:'lo-idtxt', y:2}, slot.id.replace(/_.*/,'').toUpperCase()));
    svg.appendChild(g);

    svg.appendChild(txt({x:slotX(layout.slots.indexOf(slot), n), y:ROLECAP_Y, class:'lo-rolecap', 'text-anchor':'middle'}, roleLabel(layout, slot.id)));
  });

  if(!step.fake){
    svg.appendChild(makeBall(moverX, moverY - 36));
  }

  return svg;
}

function hiddenBlock(call){
  const div = document.createElement('div');
  div.className = 'stepcard stepcard-hidden';
  div.innerHTML = `<div class="stepcard-head"><span class="step-eyebrow">VASTE VARIANT</span></div>
    <div class="hidden-block"><div class="hidden-mark">?</div><p><b>${call.code}</b> wordt in detail op training getoond.</p></div>`;
  return div;
}

/**
 * Renders a call as a stack of big, static "step cards" — one per stage of
 * the call, each with its own diagram, a bold FAKE/ECHT tag and the full
 * explanation text. No animation timing, so it can be studied at your own pace.
 */
function renderCallSteps(host, layoutKey, call, opts){
  opts = opts || {};
  host.innerHTML = '';

  if(call.anim && call.anim.special === 'hidden'){
    host.appendChild(hiddenBlock(call));
    return;
  }

  let steps;
  if(call.anim && call.anim.special === 'quick'){
    steps = [{quick:true, fake:false}];
  } else {
    steps = ((call.anim && call.anim.sequence) || []).map(s=>({moverId:s.mover, digit:s.digit, fake:!!s.fake}));
  }
  const total = steps.length;

  steps.forEach((step, i)=>{
    const svg = buildStepSVG(layoutKey, step, {small:opts.small});

    const card = document.createElement('div');
    card.className = 'stepcard ' + (step.fake ? 'stepcard-fake' : 'stepcard-real');

    const head = document.createElement('div');
    head.className = 'stepcard-head';
    const eyebrow = document.createElement('span');
    eyebrow.className = 'step-eyebrow';
    eyebrow.textContent = total>1 ? `STAP ${i+1} VAN ${total}` : 'WAT GEBEURT ER';
    const pill = document.createElement('span');
    pill.className = 'step-pill ' + (step.fake ? 'pill-fake' : 'pill-real');
    pill.textContent = step.fake ? '✗ FAKE' : '✓ ECHT';
    head.appendChild(eyebrow);
    head.appendChild(pill);
    card.appendChild(head);

    const body = document.createElement('div');
    body.className = 'stepcard-body';
    const diagramWrap = document.createElement('div');
    diagramWrap.className = 'stepcard-diagram';
    diagramWrap.appendChild(svg);
    body.appendChild(diagramWrap);

    const textWrap = document.createElement('div');
    textWrap.className = 'stepcard-text';
    const p = document.createElement('p');
    p.innerHTML = (call.steps && call.steps[i]) || '';
    textWrap.appendChild(p);
    body.appendChild(textWrap);

    card.appendChild(body);
    host.appendChild(card);

    if(i < total-1){
      const conn = document.createElement('div');
      conn.className = 'stepconnector';
      conn.textContent = 'DAN';
      host.appendChild(conn);
    }
  });
}

/* =========================================================
   NAV (syncs #topnav + #bottomnav)
   ========================================================= */
document.querySelectorAll('.navbtn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const target = btn.dataset.view;
    document.querySelectorAll('.navbtn').forEach(b=>{
      b.classList.toggle('active', b.dataset.view === target);
    });
    document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
    document.getElementById('view-'+target).classList.add('active');
  });
});

/* =========================================================
   NUMBER LEGEND — tap a digit, see it happen on a mini pod
   ========================================================= */
const numgrid = document.getElementById('numgrid');
const numviz = document.getElementById('numviz');
NUMBERS.forEach(item=>{
  const card = document.createElement('div');
  card.className = 'numcard mono';
  card.textContent = item.n;
  card.addEventListener('click', ()=>{
    const already = card.classList.contains('flipped');
    document.querySelectorAll('.numcard').forEach(c=>c.classList.remove('flipped'));
    if(already){
      numviz.innerHTML = '';
      return;
    }
    card.classList.add('flipped');
    numviz.innerHTML = '';
    if(item.n === '0'){
      renderCallSteps(numviz, 'mini', {code:'0', steps:[item.text], anim:{special:'quick'}}, {small:true});
    } else {
      renderCallSteps(numviz, 'mini', {code:item.n, steps:[item.text], anim:{sequence:[{mover:'J', digit:item.n}]}}, {small:true});
    }
  });
  numgrid.appendChild(card);
});

/* =========================================================
   CALL CARDS — chips per formation, each opens its step-by-step detail
   ========================================================= */
function renderGroup(groupKey){
  const container = document.querySelector(`.callgrid[data-group="${groupKey}"]`);
  const detailBox = document.getElementById('detail-'+groupKey);
  const data = CALLS[groupKey];
  data.calls.forEach(call=>{
    const chip = document.createElement('div');
    chip.className = 'chip ' + (call.type === 'hoofd' ? 'hoofd' : 'fake');
    chip.textContent = call.code;
    chip.addEventListener('click', ()=>{
      const isActive = chip.classList.contains('active');
      container.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
      if(isActive){
        detailBox.classList.remove('show');
        detailBox.innerHTML = '';
        return;
      }
      chip.classList.add('active');
      detailBox.classList.add('show');
      detailBox.innerHTML = '';

      const titleRow = document.createElement('div');
      titleRow.className = 'call-title-row';
      titleRow.innerHTML = `<span class="call-typepill ${call.type==='hoofd'?'pill-hoofd':'pill-variant'}">${call.type==='hoofd'?'HOOFDCALL':'FAKE / VARIANT'}</span><span class="call-who">${call.who}</span>`;
      detailBox.appendChild(titleRow);

      const stepsHost = document.createElement('div');
      detailBox.appendChild(stepsHost);
      renderCallSteps(stepsHost, data.layout, call);
    });
    container.appendChild(chip);
  });
}
Object.keys(CALLS).forEach(renderGroup);

/* =========================================================
   QUIZ
   ========================================================= */
let pool = [];
Object.keys(CALLS).forEach(key=>{
  CALLS[key].calls.forEach(call=>{
    pool.push({code:call.code, who:call.who, label:CALLS[key].label, layout:CALLS[key].layout, call});
  });
});

let current = null;
let correct = 0, total = 0;
const fcCode = document.getElementById('fc-code');
const fcSub = document.getElementById('fc-sub');
const fcAnswer = document.getElementById('fc-answer');
const fcHint = document.getElementById('fc-hint');
const fcButtons = document.getElementById('fc-buttons');
const flashcard = document.getElementById('flashcard');
const scoreEl = document.getElementById('quiz-score');
const bestEl = document.getElementById('quiz-best');

function loadBest(){
  try{
    const v = localStorage.getItem('lineout_best');
    bestEl.textContent = 'beste run: ' + (v ? v+'%' : '—');
  }catch(e){ bestEl.textContent = 'beste run: —'; }
}
function saveBest(pct){
  try{
    const v = parseInt(localStorage.getItem('lineout_best') || '0', 10);
    if(pct > v) localStorage.setItem('lineout_best', pct);
    loadBest();
  }catch(e){}
}

function nextCard(){
  current = pool[Math.floor(Math.random()*pool.length)];
  fcCode.textContent = current.code;
  fcSub.textContent = current.label;
  fcAnswer.classList.remove('show');
  fcAnswer.innerHTML = '';
  fcHint.style.display = 'block';
  fcButtons.style.display = 'none';
}
flashcard.addEventListener('click', ()=>{
  if(!fcAnswer.classList.contains('show')){
    fcAnswer.classList.add('show');
    fcHint.style.display = 'none';
    fcButtons.style.display = 'flex';
    const who = document.createElement('div');
    who.className = 'answer-who';
    who.textContent = current.who;
    fcAnswer.appendChild(who);
    const stepsHost = document.createElement('div');
    fcAnswer.appendChild(stepsHost);
    renderCallSteps(stepsHost, current.layout, current.call, {small:true});
  }
});
document.getElementById('btn-goed').addEventListener('click', (e)=>{
  e.stopPropagation();
  correct++; total++;
  updateScore();
  nextCard();
});
document.getElementById('btn-fout').addEventListener('click', (e)=>{
  e.stopPropagation();
  total++;
  updateScore();
  nextCard();
});
function updateScore(){
  scoreEl.textContent = `${correct} / ${total}`;
  if(total > 0) saveBest(Math.round(correct/total*100));
}
document.getElementById('quiz-reset').addEventListener('click', (e)=>{
  e.stopPropagation();
  correct = 0; total = 0;
  updateScore();
  try{ localStorage.removeItem('lineout_best'); }catch(err){}
  loadBest();
  nextCard();
});

loadBest();
nextCard();
