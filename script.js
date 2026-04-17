function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

const layers = [
  { canvas: document.getElementById('stars'), count: 100, speed: 0.3 },
  { canvas: document.getElementById('stars2'), count: 70, speed: 0.6 },
  { canvas: document.getElementById('stars3'), count: 40, speed: 1 }
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
    reposData = data;
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
        <h3>${repo.name}</h3>
        <p>${repo.description || ''}</p>
        <small>${repo.language || ''}</small>
        <br/>
        <a href="${repo.html_url}" target="_blank">View</a>
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
