const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');

navToggle.addEventListener('click', () => {
  nav.classList.toggle('active');

  // Animate hamburger into X
  navToggle.classList.toggle('open');
});

// Modal functionality
const openModalBtn = document.getElementById('openModal');
const modal = document.getElementById('ctaModal');
const closeModal = document.querySelector('.modal .close');
const ctaForm = document.getElementById('ctaForm');
const formFeedback = document.getElementById('formFeedback');

openModalBtn.addEventListener('click', () => {
  modal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
  formFeedback.textContent = '';
  ctaForm.reset();
});

window.addEventListener('click', (e) => {
  if(e.target === modal) {
    modal.style.display = 'none';
    formFeedback.textContent = '';
    ctaForm.reset();
  }
});

// Fake form submission
ctaForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formFeedback.textContent = 'Sending...';
  formFeedback.style.color = "var('--color-primary')";

  setTimeout(() => {
    // Randomly simulate success or failure
    const success = Math.random() > 0.2; // 80% chance success
    if(success) {
      formFeedback.textContent = 'Message sent successfully!';
      formFeedback.style.color = "var('--color-accent')";
      ctaForm.reset();
    } else {
      formFeedback.textContent = 'Something went wrong. Try again.';
      formFeedback.style.color = "var('--color-red')";
    }
  }, 1500);
});
