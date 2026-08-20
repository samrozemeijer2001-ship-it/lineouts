/* ---------------- DATA ---------------- */
const NUMBERS = [
  {n:'1', text:'Jumper gaat <b>naar voren</b>.'},
  {n:'2', text:'Jumper springt <b>op de plek</b>.'},
  {n:'3', text:'Jumper gaat <b>naar achter</b>.'},
  {n:'4', text:'Jumper springt <b>naar buiten</b> → achterlifter tilt.'},
  {n:'5', text:'Jumper gaat <b>naar voren</b> → voorlifter doet een <b>dummy til</b>.'},
  {n:'6', text:'Jumper <b>slipt er recht uit</b> → achterlifter tilt.'},
  {n:'0', text:'Geen sprong. Voorprop draait <b>180°</b> naar de hooker → snelle bal.'},
];

function stepsForDigit(letter, d){
  const map = {
    '1':`${letter} → voren (1)`,
    '2':`${letter} → op de plek (2)`,
    '3':`${letter} → naar achter (3)`,
    '4':`${letter} → naar buiten, achterlifter tilt (4)`,
    '5':`${letter} → voren, voorlifter fake-til (5)`,
    '6':`${letter} slipt er recht uit, achterlifter tilt (6)`,
    '0':`Voorprop 180° → snelle bal naar hooker (0)`,
  };
  return map[d] || `${letter} → beweging ${d}`;
}

const CALLS = {
  'm4-middle': {
    label:'4-man · middle stack',
    calls:[
      {code:'A1', type:'hoofd', who:'Jumper A', steps:[stepsForDigit('A','1')]},
      {code:'A5', type:'fake', who:'Jumper A', steps:[stepsForDigit('A','5')]},
      {code:'A54', type:'fake', who:'Jumper A · fake→echt', steps:['Fake getoond: '+stepsForDigit('A','5'), 'Echte worp: '+stepsForDigit('A','4')]},
      {code:'Zero', type:'hoofd', who:'Geen jumper', steps:[stepsForDigit('-','0')]},
      {code:'Red', type:'hoofd', who:'Vaste backup', steps:['Vaste backup-worp — details op training']},
      {code:'Slice', type:'fake', who:'Variant', steps:['Speciale variant — details op training']},
    ]
  },
  'm4-front': {
    label:'4-man · front stack',
    calls:[
      {code:'A4', type:'hoofd', who:'Jumper A', steps:[stepsForDigit('A','4')]},
      {code:'A45', type:'fake', who:'Jumper A · fake→echt', steps:['Fake getoond: '+stepsForDigit('A','4'), 'Echte worp: '+stepsForDigit('A','5')]},
      {code:'Zero', type:'hoofd', who:'Geen jumper', steps:[stepsForDigit('-','0')]},
      {code:'Red', type:'hoofd', who:'Vaste backup', steps:['Vaste backup-worp — details op training']},
    ]
  },
  'm5-front': {
    label:'5-man · front stack',
    calls:[
      {code:'C1', type:'fake', who:'Jumper C', steps:[stepsForDigit('C','1')]},
      {code:'C5', type:'fake', who:'Jumper C', steps:[stepsForDigit('C','5')]},
      {code:'CLoop', type:'fake', who:'Jumper C · loop', steps:['C loopt weg van zijn plek (loop-beweging) — details op training']},
      {code:'Red', type:'hoofd', who:'Vaste backup', steps:['Vaste backup-worp — details op training']},
    ]
  },
  'm5-middle': {
    label:'5-man · middle stack',
    calls:[
      {code:'A1', type:'hoofd', who:'Jumper A', steps:[stepsForDigit('A','1')]},
      {code:'A4', type:'fake', who:'Jumper A', steps:[stepsForDigit('A','4')]},
      {code:'BSlip4', type:'fake', who:'Jumper B · slip', steps:['B slipt er recht uit (6-stijl fake)', 'Echte worp: target 4, achterlifter tilt']},
      {code:'BSlipC', type:'fake', who:'B fake → C echt', steps:['B slipt/faket (6-stijl)', 'Bal gaat écht naar jumper C']},
      {code:'Red', type:'hoofd', who:'Vaste backup', steps:['Vaste backup-worp — details op training']},
    ]
  },
};

/* ---------------- NAV (syncs #topnav + #bottomnav) ---------------- */
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

/* ---------------- NUMBER LEGEND ---------------- */
const numgrid = document.getElementById('numgrid');
NUMBERS.forEach(item=>{
  const card = document.createElement('div');
  card.className = 'numcard mono';
  card.textContent = item.n;
  card.addEventListener('click', ()=>{
    const already = card.classList.contains('flipped');
    document.querySelectorAll('.numcard').forEach(c=>c.classList.remove('flipped'));
    const detail = document.getElementById('numdetail-active');
    if(detail) detail.remove();
    if(!already){
      card.classList.add('flipped');
      const d = document.createElement('div');
      d.className = 'numdetail show';
      d.id = 'numdetail-active';
      d.innerHTML = item.text;
      numgrid.appendChild(d);
    }
  });
  numgrid.appendChild(card);
});

/* ---------------- CALL CARDS ---------------- */
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
      detailBox.innerHTML = `<div class="who">${call.who}</div><ol>${call.steps.map(s=>`<li>${s}</li>`).join('')}</ol>`;
      detailBox.classList.add('show');
    });
    container.appendChild(chip);
  });
}
Object.keys(CALLS).forEach(renderGroup);

/* ---------------- QUIZ ---------------- */
let pool = [];
Object.keys(CALLS).forEach(key=>{
  CALLS[key].calls.forEach(call=>{
    pool.push({code:call.code, who:call.who, steps:call.steps, label:CALLS[key].label});
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
  fcAnswer.innerHTML = `<div style="font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--gold);margin-bottom:6px;text-transform:uppercase;">${current.who}</div><ol>${current.steps.map(s=>`<li>${s}</li>`).join('')}</ol>`;
  fcHint.style.display = 'block';
  fcButtons.style.display = 'none';
}
flashcard.addEventListener('click', ()=>{
  if(!fcAnswer.classList.contains('show')){
    fcAnswer.classList.add('show');
    fcHint.style.display = 'none';
    fcButtons.style.display = 'flex';
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
