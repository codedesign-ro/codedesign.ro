// ============================================
// CODE DESIGN — main.js
// ============================================

document.documentElement.classList.add('js-loaded');

function init() {

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
  if (nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40));

  // ---- Hamburger ----
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(open));
      const spans = hamburger.querySelectorAll('span');
      if (open) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity = '';
      });
    }));
  }

  // ---- Active nav link ----
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  // ---- Scroll reveal ----
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

    revealEls.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('visible');
      else observer.observe(el);
    });
  }

  // ---- Counter ----
  // Always animate counters that are already visible on load
  function animCounter(el, target, dur) {
    dur = dur || 1800;
    if (el.dataset.animated) return;
    el.dataset.animated = '1';
    let start = 0;
    const suffix = el.dataset.suffix || '';
    const step = function(ts) {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - prog, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    // First: immediately animate any counter already in viewport
    counters.forEach(function(el) {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        animCounter(el, parseInt(el.dataset.target, 10));
      }
    });

    // Then: watch for counters that scroll into view later
    const cObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          animCounter(e.target, parseInt(e.target.dataset.target, 10));
          cObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    counters.forEach(function(el) {
      if (!el.dataset.animated) cObserver.observe(el);
    });
  }

  // ---- Contact form ----
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const orig = btn.innerHTML;
      btn.innerHTML = '<span class="ro">Trimis! ✓</span><span class="en">Sent! ✓</span>';
      btn.disabled = true;
      setTimeout(function() { btn.innerHTML = orig; btn.disabled = false; form.reset(); }, 3000);
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
