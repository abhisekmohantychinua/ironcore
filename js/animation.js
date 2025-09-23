// ===========================
// Scroll-triggered animations
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(
    ".animate-fade-up, .about-card, .trainer-card, .testimonial-card"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // animate only once
        }
      });
    },
    { threshold: 0.15 }
  );

  animatedElements.forEach((el) => observer.observe(el));
});

// ===========================
// FAQ accordion animation
// ===========================
document.querySelectorAll(".faq-question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const answer = btn.nextElementSibling;

    if (answer.classList.contains("open")) {
      answer.classList.remove("open");
    } else {
      // Close other open answers
      document
        .querySelectorAll(".faq-answer.open")
        .forEach((el) => el.classList.remove("open"));

      answer.classList.add("open");
    }
  });
});

