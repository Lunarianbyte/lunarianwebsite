function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

const layers = [
  { canvas: document.getElementById('stars'), count: 120, speed: 0.3 },
  { canvas: document.getElementById('stars2'), count: 60, speed: 0.7 }
];

layers.forEach(layer => {
  if (!layer.canvas) return;

  const ctx = layer.canvas.getContext('2d');
  layer.canvas.width = window.innerWidth;
  layer.canvas.height = window.innerHeight;

  layer.stars = Array.from({ length: layer.count }, () => ({
    x: Math.random() * layer.canvas.width,
    y: Math.random() * layer.canvas.height,
    r: Math.random() * 1.5
  }));

  function animate() {
    ctx.clearRect(0, 0, layer.canvas.width, layer.canvas.height);

    layer.stars.forEach(s => {
      s.y += layer.speed;
      if (s.y > layer.canvas.height) s.y = 0;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
});

const themeBtn = document.getElementById("themeToggle");

themeBtn?.addEventListener("click", () => {
  const html = document.documentElement;
  const current = html.getAttribute("data-bs-theme");
  html.setAttribute("data-bs-theme", current === "dark" ? "light" : "dark");
});

const container = document.getElementById('repoContainer');
const filter = document.getElementById('filter');

let reposData = [];

if (container) {
  for (let i = 0; i < 6; i++) {
    const div = document.createElement('div');
    div.className = 'col-md-4';
    div.innerHTML = `<div class="card p-3 placeholder-glow">
      <span class="placeholder col-6"></span>
      <span class="placeholder col-7"></span>
    </div>`;
    container.appendChild(div);
  }
}

fetch('https://api.github.com/users/lunarianbyte/repos')
  .then(res => res.json())
  .then(data => {
    reposData = data.sort((a, b) => b.stargazers_count - a.stargazers_count);
    renderRepos('all');
  })
  .catch(() => {
    if (container) container.innerHTML = `<p>Failed load repo</p>`;
  });

function renderRepos(filterValue) {
  if (!container) return;

  container.innerHTML = '';

  reposData
    .filter(r => filterValue === 'all' || r.language === filterValue)
    .slice(0, 6)
    .forEach(repo => {
      const div = document.createElement('div');
      div.className = 'col-md-4';

      div.innerHTML = `
        <div class="card p-3 h-100">
          <h5>${repo.name}</h5>
          <p class="text-secondary small">
            ${repo.description || 'No description'}
          </p>
          <div class="mt-auto">
            <span class="badge bg-success">${repo.language || '-'}</span>
            <div class="small text-muted mt-1">⭐ ${repo.stargazers_count}</div>
          </div>
          <a href="${repo.html_url}" target="_blank" class="btn btn-sm btn-outline-success mt-3">
            View
          </a>
        </div>
      `;

      container.appendChild(div);
    });
}

filter?.addEventListener('change', e => {
  renderRepos(e.target.value);
});

async function loadChangelog() {
  const el = document.getElementById("changelogList");
  if (!el) return;

  el.innerHTML = `<p>Loading...</p>`;

  try {
    const res = await fetch("/api/changelog");
    const data = await res.json();

    el.innerHTML = '';

    data.forEach(item => {
      el.innerHTML += `
        <div class="col-md-4">
          <div class="card p-3 h-100">
            <h5>${item.title}</h5>
            <small class="text-muted">${item.date}</small>
            <p class="mt-2">${item.content}</p>
          </div>
        </div>
      `;
    });
  } catch {
    el.innerHTML = `<p>Failed load changelog</p>`;
  }
}

loadChangelog();
