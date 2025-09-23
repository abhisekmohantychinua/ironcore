const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');

navToggle.addEventListener('click', () => {
  nav.classList.toggle('active');

  // Animate hamburger into X
  navToggle.classList.toggle('open');
});

// Modal functionality
const modal = document.getElementById('ctaModal');
const closeModal = document.querySelector('.modal .close');
const ctaForm = document.getElementById('ctaForm');
const formFeedback = document.getElementById('formFeedback');

// FIX: support multiple open modal buttons
const openModalBtns = document.querySelectorAll('.open-modal, #openModal');

openModalBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    modal.style.display = 'block';
  });
});

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
  formFeedback.textContent = '';
  ctaForm.reset();
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
    formFeedback.textContent = '';
    ctaForm.reset();
  }
});

// Helper to get CSS variable value
function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// Fake form submission
ctaForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formFeedback.textContent = 'Sending...';
  formFeedback.style.color = getCSSVar('--color-primary'); // FIXED

  setTimeout(() => {
    // Randomly simulate success or failure
    const success = Math.random() > 0.2; // 80% chance success
    if (success) {
      formFeedback.textContent = 'Message sent successfully!';
      formFeedback.style.color = getCSSVar('--color-accent'); // FIXED
      ctaForm.reset();
    } else {
      formFeedback.textContent = 'Something went wrong. Try again.';
      formFeedback.style.color = getCSSVar('--color-red'); // FIXED
    }
  }, 1500);
});

// Hero enhancements: smooth scroll, subtle parallax, stats counter
(function () {
  // smooth scrolling for hero scroll and viewPrograms
  document.querySelectorAll('.hero-scroll, #viewPrograms, .nav a[href^="#"]').forEach(el => {
    el.addEventListener('click', function (e) {
      const href = this.getAttribute('href') || this.dataset.target;
      if (!href || !href.startsWith('#')) return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Parallax effect for background — subtle
  const bg = document.querySelector('.hero-bg');
  if (bg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const y = Math.min(window.scrollY, 500);
      // small translate and scale
      bg.style.transform = `translateY(${y * 0.03}px) scale(${1 + Math.min(y / 4000, 0.02)})`;
    }, { passive: true });
  }

  // Animate simple stats when they enter viewport
  const stats = document.querySelectorAll('.stat-number');
  if ('IntersectionObserver' in window && stats.length) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10) || 0;
          const duration = 900;
          const start = performance.now();
          requestAnimationFrame(function step(now) {
            const t = Math.min(1, (now - start) / duration);
            const value = Math.floor(t * target);
            el.textContent = value;
            if (t < 1) requestAnimationFrame(step);
          });
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    stats.forEach(s => io.observe(s));
  } else {
    // fallback: set values
    stats.forEach(s => s.textContent = s.dataset.target || '0');
  }

  // Hook join button to modal if present (re-uses earlier modal code)
  const joinBtn = document.getElementById('joinNow');
  if (joinBtn && openModalBtns.length) {
    joinBtn.addEventListener('click', () => openModalBtns[0].click());
  }
})();
