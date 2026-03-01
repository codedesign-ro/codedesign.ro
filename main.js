// CODE DESIGN — main.js

var SUPABASE_URL = 'https://pyzfilefqqyrmjhfdvgw.supabase.co';
var SUPABASE_KEY = 'sb_publishable_nH6dJS5-3iX9qv8loybgpw_iUAivA2Z';

document.documentElement.classList.add('js-loaded');

function init() {

  // Language switching
  var html = document.documentElement;
  var langBtns = document.querySelectorAll('.lang-btn');
  var lang = localStorage.getItem('cd-lang') || 'ro';

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

  // Navbar scroll shadow
  var nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', function() {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  // Hamburger menu
  var hamburger = document.querySelector('.hamburger');
  var mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function() {
      var isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      var spans = hamburger.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });
    // Close menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        mobileMenu.classList.remove('open');
        var spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      var revealObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
      revealEls.forEach(function(el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          el.classList.add('visible');
        } else {
          revealObs.observe(el);
        }
      });
    } else {
      revealEls.forEach(function(el) { el.classList.add('visible'); });
    }
  }

  // Counter animation
  function animCounter(el, target) {
    if (el.dataset.animated) return;
    el.dataset.animated = '1';
    var start = null;
    var dur = 1800;
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
    // Run immediately for counters already on screen
    counters.forEach(function(el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        animCounter(el, parseInt(el.dataset.target, 10));
      }
    });
    // Watch for counters scrolled into view later
    if ('IntersectionObserver' in window) {
      var cObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if (e.isIntersecting) {
            animCounter(e.target, parseInt(e.target.dataset.target, 10));
            cObs.unobserve(e.target);
          }
        });
      }, { threshold: 0.2 });
      counters.forEach(function(el) {
        if (!el.dataset.animated) cObs.observe(el);
      });
    }
  }

  // Contact form submit
  var form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var orig = btn.innerHTML;
      btn.innerHTML = '<span class="ro">Se trimite...</span><span class="en">Sending...</span>';
      btn.disabled = true;

      var data = {
        first_name: form.querySelector('[name="first_name"]').value,
        last_name:  form.querySelector('[name="last_name"]').value,
        email:      form.querySelector('[name="email"]').value,
        phone:      form.querySelector('[name="phone"]').value || null,
        message:    form.querySelector('[name="message"]').value
      };

      fetch(SUPABASE_URL + '/rest/v1/contact_submissions', {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': 'Bearer ' + SUPABASE_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(data)
      }).then(function(res) {
        if (res.ok) {
          btn.innerHTML = '<span class="ro">Trimis! \u2713</span><span class="en">Sent! \u2713</span>';
          form.reset();
          setTimeout(function() { btn.innerHTML = orig; btn.disabled = false; }, 3000);
        } else {
          btn.innerHTML = '<span class="ro">Eroare \u2014 \u00eencearc\u0103 din nou</span><span class="en">Error \u2014 try again</span>';
          btn.disabled = false;
          setTimeout(function() { btn.innerHTML = orig; }, 3000);
        }
      }).catch(function() {
        btn.innerHTML = '<span class="ro">Eroare \u2014 \u00eencearc\u0103 din nou</span><span class="en">Error \u2014 try again</span>';
        btn.disabled = false;
        setTimeout(function() { btn.innerHTML = orig; }, 3000);
      });
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
