// ============================================
// CODE DESIGN — main.js
// ============================================

document.documentElement.classList.add('js-loaded');

function init() {

  // Language
  const html = document.documentElement;
  const langBtns = document.querySelectorAll('.lang-btn');
  let lang = localStorage.getItem('cd-lang') || 'ro';

  function setLang(l) {
    lang = l;
    html.setAttribute('data-lang', l);
    localStorage.setItem('cd-lang', l);
    langBtns.forEach(function(b) {
      b.classList.toggle('active', b.dataset.lang === l);
    });
  }
  setLang(lang);
  langBtns.forEach(function(b) {
    b.addEventListener('click', function() { setLang(b.dataset.lang); });
  });

  // Navbar scroll
  var nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', function() {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  // Hamburger
  var hamburger = document.querySelector('.hamburger');
  var mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function() {
      var open = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      var spans = hamburger.querySelectorAll('span');
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
    mobileMenu.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        mobileMenu.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(function(s) {
          s.style.transform = '';
          s.style.opacity = '';
        });
      });
    });
  }

  // Active nav link
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function(a) {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  // Scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

    revealEls.forEach(function(el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.classList.add('visible');
      } else {
        revealObserver.observe(el);
      }
    });
  } else {
    revealEls.forEach(function(el) { el.classList.add('visible'); });
  }

  // Counter animation
  function animCounter(el, target, dur) {
    dur = dur || 1800;
    if (el.dataset.animated) return;
    el.dataset.animated = '1';
    var start = null;
    var suffix = el.dataset.suffix || '';
    function step(ts) {
      if (!start) start = ts;
      var prog = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - prog, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (prog < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('.counter');
  if (counters.length) {
    // Animate counters already visible on load
    counters.forEach(function(el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        animCounter(el, parseInt(el.dataset.target, 10));
      }
    });

    // Watch for counters that scroll into view
    if ('IntersectionObserver' in window) {
      var cObserver = new IntersectionObserver(function(entries) {
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
  }

  // Contact form
  var form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var orig = btn.innerHTML;
      btn.innerHTML = '<span class="ro">Trimis! \u2713</span><span class="en">Sent! \u2713</span>';
      btn.disabled = true;
      setTimeout(function() {
        btn.innerHTML = orig;
        btn.disabled = false;
        form.reset();
      }, 3000);
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
