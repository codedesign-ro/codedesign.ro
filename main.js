// ============================================
// CODE DESIGN — main.js
// ============================================

document.documentElement.classList.add('js-loaded');

document.addEventListener('DOMContentLoaded', () => {

  // ---- Language ----
  const html = document.documentElement;
  const langBtns = document.querySelectorAll('.lang-btn');
  let lang = localStorage.getItem('cd-lang') || 'ro';

  function setLang(l) {
    lang = l;
    html.setAttribute('data-lang', l);
    localStorage.setItem('cd-lang', l);
    langBtns.forEach(b => b.classList.toggle('active', b.dataset.lang === l));
  }
  setLang(lang);
  langBtns.forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));

  // ---- Navbar scroll ----
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40));

  // ---- Hamburger ----
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
      const [s1,,s3] = hamburger.querySelectorAll('span');
      const s2 = hamburger.querySelectorAll('span')[1];
      if (open) {
        s1.style.transform = 'translateY(7px) rotate(45deg)';
        s2.style.opacity = '0';
        s3.style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        s1.style.transform = s2.style.opacity = s3.style.transform = '';
        s2.style.opacity = '';
      }
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }));
  }

  // ---- Active nav link ----
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  // ---- Scroll reveal ----
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

  revealEls.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('visible');
    else observer.observe(el);
  });

  // ---- Counter ----
  function animCounter(el, target, dur = 1800) {
    let start = 0;
    const step = ts => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - prog, 3);
      el.textContent = Math.floor(eased * target) + (el.dataset.suffix || '');
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const cObserver = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animCounter(e.target, +e.target.dataset.target); cObserver.unobserve(e.target); } });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter').forEach(el => cObserver.observe(el));

  // ---- Contact form ----
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const orig = btn.innerHTML;
      btn.innerHTML = '<span class="ro">Trimis! ✓</span><span class="en">Sent! ✓</span>';
      btn.disabled = true;
      setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; form.reset(); }, 3000);
    });
  }
});
