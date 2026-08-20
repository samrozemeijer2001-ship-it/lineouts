/* =========================================================
   DATA — numbers legend
   ========================================================= */
const NUMBERS = [
  {n:'1', text:'Jumper gaat <b>naar voren</b>.'},
  {n:'2', text:'Jumper springt <b>op de plek</b>.'},
  {n:'3', text:'Jumper gaat <b>naar achter</b>.'},
  {n:'4', text:'Jumper springt <b>naar buiten</b> → achterlifter tilt.'},
  {n:'5', text:'Jumper gaat <b>naar voren</b> → voorlifter doet een <b>dummy til</b>.'},
  {n:'6', text:'Jumper <b>slipt er recht uit</b> → achterlifter tilt.'},
  {n:'0', text:'Geen sprong. Voorprop draait <b>180°</b> naar de hooker → snelle bal.'},
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

/* =========================================================
   DATA — calls per group, with "anim" sequence for the diagram
   ========================================================= */
const CALLS = {
  'm4-middle': {
    label:'4-man · middle stack',
    layout:'m4-middle',
    calls:[
      {code:'A1', type:'hoofd', who:'Jumper A', steps:['A stapt naar voren, beide lifters tillen.'],
        anim:{sequence:[{mover:'A', digit:'1'}]}},
      {code:'A5', type:'fake', who:'Jumper A', steps:['A stapt naar voren, voorlifter faket de til — bal komt toch bij A.'],
        anim:{sequence:[{mover:'A', digit:'5'}]}},
      {code:'A54', type:'fake', who:'Jumper A · fake→echt', steps:['Fake: A stapt voren, voorlifter faket.', 'Echt: A springt naar buiten, achterlifter tilt echt.'],
        anim:{sequence:[{mover:'A', digit:'5', fake:true},{mover:'A', digit:'4'}]}},
      {code:'Zero', type:'hoofd', who:'Geen jumper', steps:['Voorprop draait 180° → snelle bal naar hooker.'],
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
      {code:'A4', type:'hoofd', who:'Jumper A', steps:['A springt naar buiten, achterlifter tilt.'],
        anim:{sequence:[{mover:'A', digit:'4'}]}},
      {code:'A45', type:'fake', who:'Jumper A · fake→echt', steps:['Fake: A springt naar buiten (achterlifter beweegt mee).', 'Echt: A stapt naar voren, voorlifter faket — bal komt bij A.'],
        anim:{sequence:[{mover:'A', digit:'4', fake:true},{mover:'A', digit:'5'}]}},
      {code:'Zero', type:'hoofd', who:'Geen jumper', steps:['Voorprop draait 180° → snelle bal naar hooker.'],
        anim:{special:'quick'}},
      {code:'Red', type:'hoofd', who:'Vaste backup', steps:['Vaste backup-worp — details op training'],
        anim:{special:'hidden'}},
    ]
  },
  'm5-front': {
    label:'5-man · front stack',
    layout:'m5-front',
    calls:[
      {code:'C1', type:'fake', who:'Jumper C', steps:['C stapt naar voren, beide lifters tillen.'],
        anim:{sequence:[{mover:'C', digit:'1'}]}},
      {code:'C5', type:'fake', who:'Jumper C', steps:['C stapt naar voren, voorlifter faket de til — bal komt toch bij C.'],
        anim:{sequence:[{mover:'C', digit:'5'}]}},
      {code:'CLoop', type:'fake', who:'Jumper C · loop', steps:['C loopt weg van zijn eigen plek en vangt daar — details op training'],
        anim:{sequence:[{mover:'C', digit:'loop'}]}},
      {code:'Red', type:'hoofd', who:'Vaste backup', steps:['Vaste backup-worp — details op training'],
        anim:{special:'hidden'}},
    ]
  },
  'm5-middle': {
    label:'5-man · middle stack',
    layout:'m5-middle',
    calls:[
      {code:'A1', type:'hoofd', who:'Jumper A', steps:['A stapt naar voren, beide lifters tillen.'],
        anim:{sequence:[{mover:'A', digit:'1'}]}},
      {code:'A4', type:'fake', who:'Jumper A', steps:['A springt naar buiten, achterlifter tilt.'],
        anim:{sequence:[{mover:'A', digit:'4'}]}},
      {code:'BSlip4', type:'fake', who:'Jumper B · slip', steps:['Fake: B slipt er recht uit op zijn eigen plek (6-stijl).', 'Echt: A springt naar buiten, achterlifter tilt écht.'],
        anim:{sequence:[{mover:'B', digit:'6', fake:true},{mover:'A', digit:'4'}]}},
      {code:'BSlipC', type:'fake', who:'B fake → C echt', steps:['Fake: B slipt er recht uit op zijn eigen plek (6-stijl).', 'Echt: bal gaat naar jumper C, die op zijn plek vangt.'],
        anim:{sequence:[{mover:'B', digit:'6', fake:true},{mover:'C', digit:'2'}]}},
      {code:'Red', type:'hoofd', who:'Vaste backup', steps:['Vaste backup-worp — details op training'],
        anim:{special:'hidden'}},
    ]
  },
};

/* =========================================================
   LINEOUT VISUALIZER — builds & animates the SVG diagram
   ========================================================= */
const SVG_NS = 'http://www.w3.org/2000/svg';
const VB_W = 640, VB_H = 220, TRACK_Y = 140;
const X0 = 150, X1 = 580;
const HOOKER_X = 40, HOOKER_Y = 178;
const PROP_X = 108;
const SCRUMHALF_X = 615, SCRUMHALF_Y = 190;

function el(tag, attrs){
  const e = document.createElementNS(SVG_NS, tag);
  for(const k in attrs) e.setAttribute(k, attrs[k]);
  return e;
}

function slotX(i, n){
  if(n<=1) return (X0+X1)/2;
  return X0 + i*(X1-X0)/(n-1);
}

const DELTA = {
  '1':  {dx:-45, dy:-55},
  '2':  {dx:0,   dy:-55},
  '3':  {dx:45,  dy:-55},
  '4':  {dx:-15, dy:-85},
  '5':  {dx:-45, dy:-55, dyFake:-20},
  '6':  {dx:15,  dy:-85, dyFake:-20},
  'loop':{dx:92, dy:-55},
};
const LIFT_FOR_DIGIT = {
  '1':'both', '2':'both', '3':'both', '4':'bl', '5':'fl', '6':'bl', 'loop':null,
};
const LIFT_TYPE_FOR_DIGIT = { '5':'dummy' };

function buildDiagram(layoutKey, opts){
  opts = opts || {};
  const layout = LAYOUTS[layoutKey];
  const n = layout.slots.length;
  const svg = el('svg', {viewBox:`0 0 ${VB_W} ${VB_H}`, class:'lo-svg'+(opts.small?' small':''), 'aria-hidden':'true'});

  const defs = el('defs', {});
  const marker = el('marker', {id:'lo-arrow-'+Math.random().toString(36).slice(2), markerWidth:'8', markerHeight:'8', refX:'6', refY:'4', orient:'auto'});
  const arrowPath = el('path', {d:'M0,0 L8,4 L0,8 Z', fill:'currentColor'});
  marker.appendChild(arrowPath);
  defs.appendChild(marker);
  svg.appendChild(defs);
  const arrowId = marker.getAttribute('id');

  // track line
  svg.appendChild(el('line', {x1:PROP_X, y1:TRACK_Y, x2:X1, y2:TRACK_Y, class:'lo-track'}));
  svg.appendChild(el('text', {x:PROP_X-6, y:TRACK_Y+42, class:'lo-endlabel', 'text-anchor':'start'})).textContent = 'touch';
  svg.appendChild(el('text', {x:X1, y:TRACK_Y+42, class:'lo-endlabel', 'text-anchor':'end'})).textContent = '15m';

  // hooker
  const hookerG = el('g', {class:'lo-hooker'});
  hookerG.appendChild(el('circle', {cx:HOOKER_X, cy:HOOKER_Y, r:15}));
  const hookerTxt = el('text', {x:HOOKER_X, y:HOOKER_Y});
  hookerTxt.textContent = 'H';
  hookerG.appendChild(hookerTxt);
  svg.appendChild(hookerG);

  // prop (always present, near touchline end of the line)
  const propOuter = el('g', {transform:`translate(${PROP_X},${TRACK_Y})`});
  const propMover = el('g', {class:'lo-mover', 'data-id':'prop'});
  propMover.appendChild(el('circle', {r:12, class:'lo-circle lo-role-prop', cx:0, cy:0}));
  const propTxt = el('text', {x:0, y:1, class:'lo-label lo-label-decoy'});
  propTxt.textContent = 'P';
  propMover.appendChild(propTxt);
  propOuter.appendChild(propMover);
  svg.appendChild(propOuter);

  // scrumhalf (only relevant for quick ball, drawn faint always)
  const shG = el('g', {class:'lo-hooker', style:'opacity:.55'});
  shG.appendChild(el('circle', {cx:SCRUMHALF_X, cy:SCRUMHALF_Y, r:12}));
  const shTxt = el('text', {x:SCRUMHALF_X, y:SCRUMHALF_Y});
  shTxt.textContent = '9';
  shG.appendChild(shTxt);
  svg.appendChild(shG);

  const nodes = {}; // id -> {outer, mover, circle, trail}
  layout.slots.forEach((slot,i)=>{
    const x = slotX(i,n);
    const outer = el('g', {transform:`translate(${x},${TRACK_Y})`});
    const trail = el('line', {x1:0, y1:0, x2:0, y2:0, class:'lo-trail', 'marker-end':`url(#${arrowId})`, style:'color:var(--gold)'});
    outer.appendChild(trail);
    const mover = el('g', {class:'lo-mover', 'data-id':slot.id});
    const r = slot.role==='jumper' ? 20 : slot.role==='decoy' ? 18 : 14;
    const circle = el('circle', {r:r, cx:0, cy:0, class:'lo-circle lo-role-'+slot.role});
    mover.appendChild(circle);
    if(slot.role!=='lift'){
      const label = el('text', {x:0, y:1, class:'lo-label '+(slot.role==='jumper'?'lo-label-jumper':'lo-label-decoy')});
      label.textContent = slot.id.replace(/_.*/,'').toUpperCase();
      mover.appendChild(label);
    }
    outer.appendChild(mover);
    svg.appendChild(outer);
    nodes[slot.id] = {outer, mover, circle, trail};
  });

  // ball
  const ball = el('circle', {r:7, cx:HOOKER_X, cy:HOOKER_Y, class:'lo-ball'});
  svg.appendChild(ball);

  return {svg, layout, nodes, ball};
}

function resetDiagram(diagram){
  Object.values(diagram.nodes).forEach(node=>{
    node.mover.style.transform = '';
    node.mover.classList.remove('lo-active-real','lo-active-dummy','lo-active-fake','lo-active-ready','lo-fast');
    node.trail.classList.remove('lo-visible','lo-real','lo-fake');
    node.trail.setAttribute('x2', 0);
    node.trail.setAttribute('y2', 0);
  });
  const propMover = diagram.svg.querySelector('.lo-mover[data-id="prop"]');
  if(propMover) propMover.style.transform = '';
  diagram.ball.style.transform = '';
  diagram.ball.classList.remove('lo-visible');
  diagram.ball.setAttribute('cx', HOOKER_X);
  diagram.ball.setAttribute('cy', HOOKER_Y);
}

function playStageOnDiagram(diagram, stage, caption){
  const layout = diagram.layout;
  if(caption){
    const text = stage.label || `${stage.fake ? 'FAKE' : 'ECHT'} — ${stage.mover} ${DIGIT_LABEL[stage.digit] || stage.digit}`;
    caption.el.textContent = text;
    caption.el.parentElement.classList.toggle('lo-fake-caption', !!stage.fake);
  }

  if(stage.digit === undefined) return;

  const delta = DELTA[stage.digit] || {dx:0,dy:0};
  const dy = stage.fake && delta.dyFake!==undefined ? delta.dyFake : delta.dy;
  const dx = delta.dx;
  const node = diagram.nodes[stage.mover];
  if(!node) return;

  node.mover.classList.toggle('lo-fast', !!stage.fast);
  node.mover.style.transform = `translate(${dx}px, ${dy}px)`;
  node.mover.classList.add(stage.fake ? 'lo-active-dummy' : 'lo-active-real');
  if(node.circle.classList.contains('lo-role-decoy') && stage.fake){
    node.mover.classList.add('lo-active-fake');
  }

  node.trail.setAttribute('x2', dx);
  node.trail.setAttribute('y2', dy);
  node.trail.classList.add('lo-visible', stage.fake ? 'lo-fake' : 'lo-real');

  // lifts — only pod jumpers have dedicated lifters in this model, not lone decoys
  const moverSlot = findSlot(layout, stage.mover);
  const liftWho = moverSlot && moverSlot.role === 'jumper' ? LIFT_FOR_DIGIT[stage.digit] : null;
  const liftType = (LIFT_TYPE_FOR_DIGIT[stage.digit]) || 'real';
  if(liftWho){
    const flId = adjacentLift(layout, stage.mover, 'fl');
    const blId = adjacentLift(layout, stage.mover, 'bl');
    const liftIds = liftWho==='both' ? [flId, blId] : liftWho==='fl' ? [flId] : [blId];
    const activeIds = liftIds.filter(Boolean);
    activeIds.forEach(id=>{
      const liftNode = diagram.nodes[id];
      if(liftNode) liftNode.mover.classList.add(liftType==='dummy' ? 'lo-active-dummy' : 'lo-active-real');
    });
    // the OTHER lifter of this pod (the one that does NOT take the real lift)
    // still grips in and gets ready — show that too, so the full pod is visible.
    [flId, blId].filter(Boolean).forEach(id=>{
      if(activeIds.includes(id)) return;
      const liftNode = diagram.nodes[id];
      if(liftNode) liftNode.mover.classList.add('lo-active-ready');
    });
  }

  // ball travel — only on real (non-fake) stages
  if(!stage.fake){
    const idx = layout.slots.findIndex(s=>s.id===stage.mover);
    const x = slotX(idx, layout.slots.length);
    const targetX = x + dx;
    const targetY = TRACK_Y + dy;
    const bdx = targetX - HOOKER_X;
    const bdy = targetY - HOOKER_Y;
    diagram.ball.classList.add('lo-visible');
    diagram.ball.style.transform = `translate(${bdx}px, ${bdy}px)`;
  }
}

function playQuickBall(diagram, caption){
  if(caption){
    caption.el.textContent = 'Voorprop draait 180° — bal direct naar hooker, snelle bal naar de 9.';
    caption.el.parentElement.classList.remove('lo-fake-caption');
  }
  const propMover = diagram.svg.querySelector('.lo-mover[data-id="prop"]');
  if(propMover){
    propMover.style.transformOrigin = 'center';
    propMover.style.transform = 'rotate(180deg)';
    propMover.classList.add('lo-active-real');
  }
  diagram.ball.classList.add('lo-visible');
  diagram.ball.style.transform = `translate(${SCRUMHALF_X-HOOKER_X}px, ${SCRUMHALF_Y-HOOKER_Y}px)`;
}

function showHidden(host, call){
  host.innerHTML = '';
  const overlay = document.createElement('div');
  overlay.className = 'lo-hidden-overlay';
  overlay.innerHTML = `<div class="lo-hidden-badge">?</div><p>${call.code} is een vaste variant — de precieze uitvoering wordt op training getoond.</p>`;
  host.appendChild(overlay);
}

/**
 * Renders and plays a call's animation inside `host` (an element).
 * Adds a caption line and a replay button.
 */
function renderCallVisual(host, layoutKey, call, opts){
  opts = opts || {};
  host.innerHTML = '';

  if(call.anim && call.anim.special === 'hidden'){
    showHidden(host, call);
    return;
  }

  const wrap = document.createElement('div');
  wrap.className = 'lo-wrap';
  host.appendChild(wrap);

  const diagram = buildDiagram(layoutKey, {small:opts.small});
  wrap.appendChild(diagram.svg);

  const captionBox = document.createElement('div');
  captionBox.className = 'lo-caption';
  const captionEl = document.createElement('span');
  captionBox.appendChild(captionEl);
  wrap.appendChild(captionBox);
  const caption = {el: captionEl};

  if(!opts.noControls){
    const controls = document.createElement('div');
    controls.className = 'lo-controls';
    const btn = document.createElement('button');
    btn.className = 'lo-replay';
    btn.textContent = '↻ speel opnieuw';
    btn.addEventListener('click', ()=> run());
    controls.appendChild(btn);
    wrap.appendChild(controls);
  }

  function run(){
    resetDiagram(diagram);
    if(call.anim && call.anim.special === 'quick'){
      // slight delay so the reset is visible before the rotate
      setTimeout(()=> playQuickBall(diagram, caption), 120);
      return;
    }
    const seq = (call.anim && call.anim.sequence) || [];
    let delay = 120;
    seq.forEach(stage=>{
      const dur = stage.fake ? 1100 : 1500;
      setTimeout(()=> playStageOnDiagram(diagram, stage, caption), delay);
      delay += dur;
    });
  }

  // autoplay shortly after mount
  setTimeout(run, opts.autoplayDelay!==undefined ? opts.autoplayDelay : 150);
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
    const info = document.createElement('div');
    info.className = 'calldetail show';
    info.style.marginBottom = '0';
    info.innerHTML = item.text;
    numviz.appendChild(info);

    const vizHost = document.createElement('div');
    numviz.appendChild(vizHost);

    if(item.n === '0'){
      const fakeCall = {code:'0', anim:{special:'quick'}};
      renderCallVisual(vizHost, 'mini', fakeCall, {small:true});
    } else {
      const fakeCall = {code:item.n, anim:{sequence:[{mover:'J', digit:item.n}]}};
      renderCallVisual(vizHost, 'mini', fakeCall, {small:true});
    }
  });
  numgrid.appendChild(card);
});

/* =========================================================
   CALL CARDS — chips per formation, each opens its diagram
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
      detailBox.innerHTML = `<div class="who">${call.who}</div>`;
      const vizHost = document.createElement('div');
      detailBox.appendChild(vizHost);
      renderCallVisual(vizHost, data.layout, call);
      const ol = document.createElement('ol');
      ol.innerHTML = call.steps.map(s=>`<li>${s}</li>`).join('');
      detailBox.appendChild(ol);
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
    pool.push({code:call.code, who:call.who, steps:call.steps, label:CALLS[key].label, layout:CALLS[key].layout, call});
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
  const who = document.createElement('div');
  who.style.cssText = "font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--gold);margin-bottom:6px;text-transform:uppercase;";
  who.textContent = current.who;
  fcAnswer.appendChild(who);
  const vizHost = document.createElement('div');
  fcAnswer.appendChild(vizHost);
  const ol = document.createElement('ol');
  ol.innerHTML = current.steps.map(s=>`<li>${s}</li>`).join('');
  fcAnswer.appendChild(ol);
  // build the diagram now but only autoplay once revealed
  renderCallVisual(vizHost, current.layout, current.call, {small:true, autoplayDelay:99999999});
  current._vizHost = vizHost;
  fcHint.style.display = 'block';
  fcButtons.style.display = 'none';
}
flashcard.addEventListener('click', ()=>{
  if(!fcAnswer.classList.contains('show')){
    fcAnswer.classList.add('show');
    fcHint.style.display = 'none';
    fcButtons.style.display = 'flex';
    // re-render to trigger the autoplay now that it's visible
    if(current && current._vizHost){
      renderCallVisual(current._vizHost, current.layout, current.call, {small:true});
    }
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
