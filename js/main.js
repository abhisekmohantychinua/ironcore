/* ---------------------
   NAV TOGGLE (unchanged)
   --------------------- */
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    navToggle.classList.toggle('open');
  });
}

/* ---------------------
   Helper: read CSS var
   --------------------- */
function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/* ---------------------
   Modal system (generic)
   --------------------- */
function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.style.display = 'block';
  modalEl.setAttribute('aria-hidden', 'false');

  // If modal contains a datetime-local input, set min to now (local)
  const dt = modalEl.querySelector('input[type="datetime-local"], input[name="datetime"]');
  if (dt) {
    const now = new Date();
    // adjust for timezone offset so ISO is local
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    dt.min = now.toISOString().slice(0, 16);
  }

  // focus first field for accessibility
  const first = modalEl.querySelector('input, textarea, button');
  if (first) first.focus();
}

function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.style.display = 'none';
  modalEl.setAttribute('aria-hidden', 'true');

  // reset any form inside
  const form = modalEl.querySelector('form');
  if (form) {
    form.reset();
    const fb = form.querySelector('[data-feedback], #formFeedback');
    if (fb) fb.textContent = '';
  }
}

// Open triggers — supports data-modal attribute, legacy .open-modal and #openModal
const modalTriggers = document.querySelectorAll('[data-modal], .open-modal, #openModal');
modalTriggers.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    // dataset.modal preferred; fallback to #ctaModal (legacy)
    const selector = btn.dataset && btn.dataset.modal ? btn.dataset.modal : '#ctaModal';
    const target = document.querySelector(selector);
    if (target) openModal(target);
  });
});

// Close buttons for each modal
document.querySelectorAll('.modal').forEach(modalEl => {
  const closeBtn = modalEl.querySelector('.close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeModal(modalEl));
  }
});

// click outside to close
window.addEventListener('click', (e) => {
  if (e.target && e.target.classList && e.target.classList.contains('modal')) {
    closeModal(e.target);
  }
});

/* ---------------------
   Generic modal form handling
   works for:
    - #ctaForm  (existing contact form)
    - #bookCallForm (new booking form)
   Uses data-feedback inside each form OR falls back to #formFeedback for legacy.
   --------------------- */
document.querySelectorAll('.modal form').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const modalEl = form.closest('.modal');
    const feedback = form.querySelector('[data-feedback]') || document.getElementById('formFeedback') || null;

    // show sending
    if (feedback) {
      feedback.textContent = 'Sending...';
      feedback.style.color = getCSSVar('--color-primary');
    }

    // Simple validation (for book-call form: phone + datetime)
    const phoneInput = form.querySelector('input[name="phone"]');
    const dtInput = form.querySelector('input[name="datetime"], input[type="datetime-local"]');

    if (phoneInput) {
      const phoneVal = phoneInput.value.trim();
      if (!phoneVal || phoneVal.length < 6) {
        if (feedback) {
          feedback.textContent = 'Please enter a valid phone number.';
          feedback.style.color = getCSSVar('--color-red');
        }
        return;
      }
    }

    if (dtInput) {
      const dtVal = dtInput.value;
      if (!dtVal) {
        if (feedback) {
          feedback.textContent = 'Please select a date & time.';
          feedback.style.color = getCSSVar('--color-red');
        }
        return;
      }
      const selected = new Date(dtVal);
      const now = new Date();
      if (selected < now) {
        if (feedback) {
          feedback.textContent = 'Please choose a future date/time.';
          feedback.style.color = getCSSVar('--color-red');
        }
        return;
      }
    }

    // Simulate sending (demo) — reuse your previous behavior
    setTimeout(() => {
      const success = Math.random() > 0.15; // 85% success
      if (success) {
        if (feedback) {
          // friendly success messages based on form
          if (form.id === 'bookCallForm') {
            feedback.textContent = 'Request saved! We will call you at the scheduled time.';
          } else {
            feedback.textContent = 'Message sent successfully!';
          }
          feedback.style.color = getCSSVar('--color-accent');
        }
        form.reset();
        // close modal shortly after success
        setTimeout(() => closeModal(modalEl), 1100);
      } else {
        if (feedback) {
          feedback.textContent = 'Something went wrong. Try again.';
          feedback.style.color = getCSSVar('--color-red');
        }
      }
    }, 1000);
  });
});

/* ---------------------
   Preserve previous join button behavior but make it explicit
   joinNow (if present) should open the contact modal (#ctaModal)
   --------------------- */
const joinBtn = document.getElementById('joinNow');
if (joinBtn) {
  joinBtn.addEventListener('click', () => {
    const cta = document.getElementById('ctaModal');
    if (cta) openModal(cta);
  });
}

/* ---------------------
   Hero enhancements (kept from your original file)
   - smooth scroll
   - parallax (optional)
   - stats counter
   --------------------- */
(function () {
  // smooth scrolling for hero scroll and viewPrograms and nav anchors
  document.querySelectorAll('.hero-scroll, #viewPrograms, .nav a[href^="#"]').forEach(el => {
    el.addEventListener('click', function (e) {
      const href = this.getAttribute('href') || this.dataset.target;
      if (!href || !href.startsWith('#')) return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Parallax effect for background — subtle
  const bg = document.querySelector('.hero-bg');
  if (bg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const y = Math.min(window.scrollY, 500);
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
    stats.forEach(s => s.textContent = s.dataset.target || '0');
  }
})();

// FAQ toggle
document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => {
    const answer = q.nextElementSibling; // assumes structure: question -> answer
    if (!answer) return;

    const isActive = q.classList.contains('active');
    // hide all other answers (optional)
    document.querySelectorAll('.faq-question').forEach(otherQ => {
      if (otherQ !== q) {
        otherQ.classList.remove('active');
        const otherA = otherQ.nextElementSibling;
        if (otherA) otherA.style.display = 'none';
      }
    });

    // toggle current
    if (isActive) {
      q.classList.remove('active');
      answer.style.display = 'none';
    } else {
      q.classList.add('active');
      answer.style.display = 'block';
    }
  });
});

// XXX: Hire me logic, Promotion
(function() {
  const ctaUrl = "https://abhisekmohantychinua.github.io/mohantyabhisek.portfolio"; // <-- static URL
  let toastCounter = 0;

  function createToast(message) {
    const toast = document.createElement('div');
    toast.className = 'custom-toast';

    const msg = document.createElement('span');
    msg.className = 'toast-message';
    msg.textContent = message;

    const cta = document.createElement('button');
    cta.className = 'btn-cta-primary toast-cta';
    cta.textContent = 'Hire Me';
    cta.onclick = () => window.open(ctaUrl, '_blank');

    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => removeToast(toast);

    toast.appendChild(msg);
    toast.appendChild(cta);
    toast.appendChild(closeBtn);
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => removeToast(toast), 5000);
  }

  function removeToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }

  // On page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      if(toastCounter < 2) {
        createToast('Looking to hire a developer?');
        toastCounter++;
      }
    }, 3000);
  });

  // On reaching footer
  const footer = document.querySelector('.footer');
  if(footer) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting && toastCounter < 2) {
          createToast('Looking to hire a developer?');
          toastCounter++;
        }
      });
    }, { threshold: 0.5 });
    observer.observe(footer);
  }
})();
