let students = [
  {name:'Marina Costa', attended:7, possible:8}, {name:'João Vitor', attended:7, possible:8}, {name:'Beatriz Lima', attended:6, possible:8}, {name:'Lucas Almeida', attended:6, possible:8}, {name:'Carolina Reis', attended:5, possible:8}, {name:'Rafael Souza', attended:5, possible:8}, {name:'Isabela Moura', attended:4, possible:8}
];
const talks = [
  ['28 OUT','Química verde na indústria','Prof. Ana Martins','19h00 · Auditório Principal','PRÓXIMA'],
  ['11 NOV','Da bancada ao mercado','Dr. Pedro Azevedo','19h00 · Auditório Principal','EM BREVE'],
  ['25 NOV','Polímeros que mudam o mundo','Dra. Lívia Nunes','19h00 · Auditório Principal','EM BREVE'],
  ['09 DEZ','O futuro da pesquisa química','Mesa redonda','19h00 · Auditório Principal','EM BREVE']
];
const initialsColor = ['#d8ff5e','#9b91ff','#69e8df','#ffb56b','#f39bc2','#85b9ff','#d7b67e'];
const initials = name => name.split(/\s+/).slice(0,2).map(n=>n[0]).join('').toUpperCase();
const avatar = (s,i) => `<span class="avatar" style="background:${initialsColor[i % initialsColor.length]}">${initials(s.name)}</span>`;
const percentage = s => s.possible ? Math.round((s.attended / s.possible) * 100) : 0;
function renderLeaders(lastPresent = null) {
  students.sort((a,b) => percentage(b)-percentage(a) || b.attended-a.attended || a.name.localeCompare(b.name));
  const top = students.slice(0,5);
  document.querySelector('#top-five').innerHTML = top.map((s,i)=>`<article class="person"><span class="place">0${i+1}</span>${avatar(s,i)}<h3>${s.name}</h3><p>${s.attended} presenças · ${percentage(s)}%</p><div><i style="width:${percentage(s)}%"></i></div></article>`).join('');
  document.querySelector('#leader-top-five').innerHTML = top.map((s,i)=>`<article class="podium-card ${i===0?'champion':''}"><span>TOP ${i+1}</span>${avatar(s,i)}<h3>${s.name}</h3><strong>${percentage(s)}<small>%</small></strong><p>${s.attended} de ${s.possible} palestras</p></article>`).join('');
  document.querySelector('#leader-list').innerHTML = students.map((s,i)=>`<div class="leader-row ${i===0?'first':''}"><b>${String(i+1).padStart(2,'0')}</b><span class="student">${avatar(s,i)}<strong>${s.name}</strong></span><strong>${s.attended}<small>/${s.possible}</small></strong><span class="score">${percentage(s)}%</span></div>`).join('');
  document.querySelector('#leader-total').textContent = students.length;
  document.querySelector('#last-attendance').textContent = lastPresent === null ? '—' : lastPresent;
  document.querySelector('#attendance-average').textContent = `${Math.round(students.reduce((sum,s)=>sum+percentage(s),0)/students.length)}%`;
  document.querySelector('#executive-students').textContent = students.length;
  document.querySelector('#executive-rate').innerHTML = `${Math.round(students.reduce((sum,s)=>sum+percentage(s),0)/students.length)}<em>%</em>`;
  document.querySelector('#executive-best').innerHTML = `${percentage(top[0])}<em>%</em>`;
  document.querySelector('#executive-best-name').textContent = top[0].name;
  document.querySelector('#executive-insight').textContent = `${top.length} alunos ocupam o topo do ranking. ${top[0].name} lidera com ${percentage(top[0])}% de presença.`;
  document.querySelector('#bar-chart').innerHTML = top.map(s=>`<i title="${s.name}: ${percentage(s)}%" style="height:${percentage(s)}%"></i>`).join('');
}
function renderSchedule(){ document.querySelector('#schedule-list').innerHTML = talks.map((t,i)=>`<article class="talk ${i===0?'upcoming':''}"><div class="talk-date">${t[0].split(' ')[0]}<small>${t[0].split(' ')[1]}</small></div><div><span class="status">${t[4]}</span><h2>${t[1]}</h2><p>${t[2]} · ${t[3]}</p></div><button>DETALHES <b>↗</b></button></article>`).join(''); }
renderSchedule();
function showPage(id) { document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id===id)); document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('active',a.dataset.page===id)); window.scrollTo({top:0,behavior:'smooth'}); }
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href').slice(1); if(document.getElementById(id)){e.preventDefault(); history.replaceState(null,'','#'+id); showPage(id)}}));
function normalized(row) { return Object.fromEntries(Object.entries(row).map(([key,value])=>[String(key).trim().toLowerCase(), value])); }
function asNumber(value) { return Number(String(value ?? '').replace(',', '.').replace(/[^0-9.]/g,'')) || 0; }
function truthy(value) { return ['sim','yes','true','presente','1','x'].includes(String(value ?? '').trim().toLowerCase()); }
function identity(row) { return String(row['e-mail'] || row.email || row['endereço de e-mail'] || row.aluno || row.nome || '').trim().toLowerCase(); }
async function readSpreadsheet(file) { const buffer = await file.arrayBuffer(); const book = XLSX.read(buffer, {type:'array'}); return XLSX.utils.sheet_to_json(book.Sheets[book.SheetNames[0]], {defval:''}).map(normalized); }
function showFile(input, label) { document.querySelector(label).textContent = input.files[0]?.name || 'Selecionar arquivo'; document.querySelector('#merge-files').disabled = !(document.querySelector('#base-file').files[0] && document.querySelector('#last-file').files[0]); }
document.querySelector('#base-file').addEventListener('change',e=>showFile(e.target,'#base-file-name'));
document.querySelector('#last-file').addEventListener('change',e=>showFile(e.target,'#last-file-name'));
document.querySelector('#merge-files').addEventListener('click',async()=>{
  const button = document.querySelector('#merge-files'); button.textContent='PROCESSANDO...'; button.disabled=true;
  try {
    const [baseRows,lastRows] = await Promise.all([readSpreadsheet(document.querySelector('#base-file').files[0]),readSpreadsheet(document.querySelector('#last-file').files[0])]);
    const historic = new Map(baseRows.map(row=>{const key=identity(row); const name=String(row.aluno || row.nome || key); return [key,{name,attended:asNumber(row['presenças'] || row.presencas || row['presença'] || row.presenca),possible:asNumber(row['total de palestras'] || row.total || row.palestras)}]}));
    const present = new Set(lastRows.filter(row=>truthy(row.presente || row['presença'] || row.presenca || row.confirmado)).map(identity).filter(Boolean));
    lastRows.forEach(row=>{const key=identity(row); if(!key) return; if(!historic.has(key)){const name=String(row.aluno || row.nome || key); historic.set(key,{name,attended:0,possible:0});} historic.get(key).possible += 1; if(present.has(key)) historic.get(key).attended += 1;});
    students=[...historic.values()]; renderLeaders(present.size);
  } catch(error) { alert('Não foi possível ler os arquivos. Verifique se as colunas seguem o formato esperado.'); console.error(error); }
  button.innerHTML='ATUALIZAR LEADERBOARD <b>→</b>'; button.disabled=false;
});
document.querySelector('#talk-form').addEventListener('submit', event => {
  event.preventDefault();
  const date = new Date(`${document.querySelector('#talk-date-input').value}T12:00:00`);
  const dateLabel = `${String(date.getDate()).padStart(2,'0')} ${date.toLocaleString('pt-BR',{month:'short'}).replace('.','').toUpperCase()}`;
  const time = document.querySelector('#talk-time').value.replace(':','h');
  talks.push([dateLabel, document.querySelector('#talk-title').value, document.querySelector('#talk-speaker').value, `${time} · ${document.querySelector('#talk-room').value}`, 'EM BREVE']);
  talks.sort((a,b)=>a[0].localeCompare(b[0])); renderSchedule(); event.target.reset(); document.querySelector('#talk-time').value='19:00';
});
renderLeaders();
showPage(location.hash.slice(1) || 'home');
