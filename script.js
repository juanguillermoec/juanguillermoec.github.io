// Año en el pie
document.getElementById('year').textContent = new Date().getFullYear();

// Barra de navegación y progreso
const nav = document.querySelector('.nav');
const bar = document.querySelector('.progress');
const onScroll = () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
  const h = document.documentElement.scrollHeight - innerHeight;
  bar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Menú en celular
const btn = document.querySelector('.menu-btn');
btn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  btn.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// Animación al aparecer
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    el.style.transitionDelay = Math.min(siblings.indexOf(el), 5) * 90 + 'ms';
    el.classList.add('in');
    el.querySelectorAll('.count').forEach(countUp);
    if (el.classList.contains('count')) countUp(el);
    io.unobserve(el);
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Contadores
function countUp(el) {
  if (el.dataset.done) return;
  el.dataset.done = 1;
  const to = parseFloat(el.dataset.to), dec = +(el.dataset.dec || 0), sep = el.dataset.sep;
  const start = performance.now(), dur = 1800;
  const fmt = v => {
    let s = v.toFixed(dec).replace('.', ',');
    if (sep) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
    return s;
  };
  const step = t => {
    const p = Math.min((t - start) / dur, 1), e = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(to * e);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Texto que se escribe solo
const typed = document.querySelector('.typed');
if (typed) {
  const words = JSON.parse(typed.dataset.words);
  let w = 0, i = 0, del = false;
  const tick = () => {
    const word = words[w];
    i += del ? -1 : 1;
    typed.textContent = word.slice(0, i);
    let wait = del ? 40 : 85;
    if (!del && i === word.length) { del = true; wait = 1600; }
    else if (del && i === 0) { del = false; w = (w + 1) % words.length; wait = 350; }
    setTimeout(tick, wait);
  };
  tick();
}

// Inclinación 3D de las capturas
if (matchMedia('(hover:hover)').matches) {
  document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });
}

// Enlace activo según la sección
const sections = [...document.querySelectorAll('main section[id]')];
const links = [...document.querySelectorAll('.links a')];
const so = new IntersectionObserver(es => {
  es.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => so.observe(s));
