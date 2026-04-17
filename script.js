function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

const layers = [
  { canvas: document.getElementById('stars'), count: 120, speed: 0.3 },
  { canvas: document.getElementById('stars2'), count: 60, speed: 0.7 }
];

layers.forEach(layer => {
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

const container = document.getElementById('repoContainer');

for (let i = 0; i < 6; i++) {
  const div = document.createElement('div');
  div.className = 'skeleton';
  container.appendChild(div);
}

let reposData = [];

fetch('https://api.github.com/users/lunarianbyte/repos')
  .then(res => res.json())
  .then(data => {
    reposData = data.sort((a,b)=>b.stargazers_count-a.stargazers_count);
    renderRepos('all');
  });

function renderRepos(filter) {
  container.innerHTML = '';

  reposData
    .filter(r => filter === 'all' || r.language === filter)
    .slice(0, 6)
    .forEach(repo => {
      const div = document.createElement('div');
      div.className = 'card';

      div.innerHTML = `
        <h3 class="text-xl font-bold mb-2">${repo.name}</h3>
        <p class="text-gray-400 text-sm">${repo.description || 'No description'}</p>
        <div class="mt-3 text-xs text-purple-300">${repo.language || ''}</div>
        <div class="mt-1 text-xs text-gray-500">⭐ ${repo.stargazers_count}</div>
        <a href="${repo.html_url}" target="_blank" class="block mt-4 text-sm text-indigo-400">View Project →</a>
      `;

      container.appendChild(div);
    });
}

document.getElementById('filter').addEventListener('change', e => {
  renderRepos(e.target.value);
});

document.getElementById('toggleDark').onclick = () => {
  document.body.classList.toggle('light');
};
