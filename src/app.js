const fileInput = document.getElementById('file-input');
const dropzone = document.getElementById('dropzone');
const previewWrap = document.getElementById('upload-preview');
const renderTarget = document.getElementById('render-target');
const htmlOut = document.getElementById('html-output');
const cssOut = document.getElementById('css-output');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelector('.nav__links');

const tabs = document.querySelectorAll('.tab');
const panes = document.querySelectorAll('.codepane');

tabs.forEach((t) => t.addEventListener('click', () => {
  tabs.forEach(b => b.classList.remove('active'));
  panes.forEach(p => p.classList.remove('active'));
  t.classList.add('active');
  document.getElementById(`code-${t.dataset.tab}`).classList.add('active');
}));

// Scroll reveals
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.2 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Mobile nav toggle
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
}

// Dropzone interactions
dropzone.addEventListener('click', () => fileInput.click());
dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('drag'); });
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag'));
dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('drag');
  const file = e.dataTransfer?.files?.[0];
  if (file) handleFile(file);
});
fileInput.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (file) handleFile(file);
});

function handleFile(file) {
  if (!file.type.startsWith('image/')) return;
  const url = URL.createObjectURL(file);
  const img = document.createElement('img');
  img.src = url;
  previewWrap.innerHTML = '';
  previewWrap.appendChild(img);
  generateStubLayout(url, file.name);
}

// Simple stub generator: builds a clean card layout for the uploaded screenshot
function generateStubLayout(imageUrl, name = 'Uploaded Screenshot') {
  const html = `\n<div class="page">\n  <header class="page__header">\n    <div class="logo">⌁</div>\n    <h1 class="title">Generated UI</h1>\n  </header>\n  <main class="page__content">\n    <section class="card">\n      <img class="card__image" src="${imageUrl}" alt="${name}"/>\n      <div class="card__body">\n        <h2 class="card__title">Interpreted Layout</h2>\n        <p class="card__text">Detected primary visual block rendered with consistent spacing and hierarchy. Edit freely.</p>\n        <button class="card__btn">Action</button>\n      </div>\n    </section>\n  </main>\n</div>`;

  const css = `\n:root { --bg:#0b0f1a; --surface:#121826; --border:rgba(148,163,184,.2); --text:#e5e7eb; --muted:#94a3b8; --primary:#7c3aed; --cyan:#22d3ee; }\n*{box-sizing:border-box} body{background:var(--bg);color:var(--text);font-family:Inter,system-ui} \n.page{display:grid; gap:16px} \n.page__header{display:flex; align-items:center; gap:12px} \n.logo{width:28px;height:28px;border-radius:8px;display:grid;place-items:center;background:linear-gradient(135deg,var(--primary),var(--cyan)); color:#fff} \n.title{font-size:1.2rem;margin:0} \n.page__content{display:grid; gap:16px} \n.card{display:grid; grid-template-columns: 1.2fr 1fr; gap: 16px; background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.02)); border:1px solid var(--border); border-radius:14px; overflow:hidden} \n.card__image{width:100%; height:100%; object-fit:cover} \n.card__body{padding:16px} \n.card__title{margin:0 0 8px} \n.card__text{color:var(--muted); margin:0 0 12px} \n.card__btn{padding:10px 14px; border-radius:10px; border:1px solid transparent; background:linear-gradient(135deg,var(--primary),var(--cyan)); color:#fff; cursor:pointer} \n@media (max-width:720px){ .card{grid-template-columns:1fr} }`;

  // Render preview
  const htmlFinal = html.replace('Generated UI', 'UI2Code Preview');
  renderTarget.innerHTML = `<style>${css}</style>${htmlFinal}`;
  htmlOut.textContent = htmlFinal.trim();
  cssOut.textContent = css.trim();
}

// Copy & download
document.getElementById('copy-html').addEventListener('click', () => copyText(htmlOut.textContent));
document.getElementById('copy-css').addEventListener('click', () => copyText(cssOut.textContent));

document.getElementById('download-html').addEventListener('click', () => downloadFile('generated.html', htmlOut.textContent));
document.getElementById('download-css').addEventListener('click', () => downloadFile('styles.css', cssOut.textContent));

function copyText(text) {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => toast('Copied to clipboard')); 
}

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// Minimal toast
const toast = (msg) => {
  const el = document.createElement('div');
  el.textContent = msg;
  el.style.position = 'fixed';
  el.style.bottom = '20px';
  el.style.left = '50%';
  el.style.transform = 'translateX(-50%)';
  el.style.padding = '10px 14px';
  el.style.borderRadius = '10px';
  el.style.background = 'linear-gradient(135deg, rgba(124,58,237,.6), rgba(34,211,238,.6))';
  el.style.color = '#fff';
  el.style.boxShadow = '0 12px 30px rgba(0,0,0,.35)';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1600);
};
