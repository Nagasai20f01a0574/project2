
// =======================
// 🧭 MOBILE MENU TOGGLE
// =======================
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');

if (mobileMenu && navLinks) {
  mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// =======================
// ❓ FAQ ACCORDION
// =======================
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  if (question) {
    question.addEventListener('click', () => {
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });
      item.classList.toggle('active');
    });
  }
});

// =======================
// 🌐 SMOOTH SCROLL
// =======================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
      navLinks?.classList.remove('active');
    }
  });
});

// =======================
// 💫 SCROLL ANIMATIONS
// =======================
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('animate');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .testimonial-card, .pricing-card')
  .forEach(card => observer.observe(card));

// =======================
// 🎬 PROJECT CARD ANIMATIONS
// =======================
function animateProjects() {
  const projectCards = document.querySelectorAll('.project-card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  projectCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
  });
}
document.addEventListener('DOMContentLoaded', animateProjects);

// =======================
// ♾️ TESTIMONIAL SCROLL
// =======================
/* Testimonials manual carousel with arrows + drag + keyboard */
(function () {
  const grid = document.querySelector('.testimonial-grid');
  const viewport = document.querySelector('.testimonial-viewport');
  const track = document.querySelector('.testimonial-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.querySelector('.testimonial-nav.prev');
  const nextBtn = document.querySelector('.testimonial-nav.next');

  if (!track || cards.length === 0 || !viewport) return;

  const cardWidth = 350; // must match CSS .testimonial-card width
  const gap = 30;        // must match CSS gap on .testimonial-track
  const step = cardWidth + gap;

  // Calculate full width and set track style width (optional)
  const totalWidth = (cardWidth * cards.length) + (gap * (cards.length - 1));
  track.style.width = totalWidth + 'px';

  // Helper to update nav disabled state
  function updateNav() {
    const maxScrollLeft = track.scrollWidth - viewport.clientWidth;
    prevBtn.disabled = (viewport.scrollLeft <= 5);
    nextBtn.disabled = (viewport.scrollLeft >= maxScrollLeft - 5);
  }

  // Scroll to next / prev card (with bounds)
  function scrollBy(direction) {
    const target = Math.round(viewport.scrollLeft / step) * step + (direction * step);
    viewport.scrollTo({ left: target, behavior: 'smooth' });
  }

  // Attach arrow handlers
  prevBtn.addEventListener('click', () => scrollBy(-1));
  nextBtn.addEventListener('click', () => scrollBy(1));

  // Update nav on scroll
  viewport.addEventListener('scroll', () => {
    // throttle with rAF
    if (typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(updateNav);
    } else {
      updateNav();
    }
  });

  // Keyboard navigation (left/right arrows) when grid focused
  grid.setAttribute('tabindex', '0');
  grid.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); scrollBy(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); scrollBy(1); }
  });

  // Drag to scroll (desktop & mobile)
  let isDown = false, startX, scrollStart;
  viewport.addEventListener('pointerdown', (e) => {
    isDown = true;
    viewport.setPointerCapture(e.pointerId);
    startX = e.clientX;
    scrollStart = viewport.scrollLeft;
    viewport.classList.add('dragging');
  });
  viewport.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    const dx = startX - e.clientX;
    viewport.scrollLeft = scrollStart + dx;
  });
  viewport.addEventListener('pointerup', (e) => {
    if (!isDown) return;
    isDown = false;
    viewport.releasePointerCapture(e.pointerId);
    // Snap to nearest card
    const nearest = Math.round(viewport.scrollLeft / step) * step;
    viewport.scrollTo({ left: nearest, behavior: 'smooth' });
    viewport.classList.remove('dragging');
  });
  viewport.addEventListener('pointercancel', () => {
    isDown = false;
    viewport.classList.remove('dragging');
  });

  // On resize, update nav state
  window.addEventListener('resize', () => {
    updateNav();
  });

  // Init nav state
  updateNav();
})();

// =======================
// 📩 CONTACT POPUP (Iframe-based)
// =======================
document.addEventListener('DOMContentLoaded', function() {
  const openBtn = document.getElementById('openContact');
  const overlay = document.getElementById('popupOverlay');
  const closeBtn = document.getElementById('closePopup');

  if (openBtn && overlay && closeBtn) {
    openBtn.addEventListener('click', e => {
      e.preventDefault();
      overlay.classList.add('show');
    });

    closeBtn.addEventListener('click', () => overlay.classList.remove('show'));

    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('show');
    });
  }
});

// =======================
// 🧾 CONTACT FORM SUBMISSION (Google Apps Script)
// =======================
const modal = document.getElementById('contactModal');
const contactBtns = document.querySelectorAll('.contact-btn');
const closeModal = document.querySelector('.close-modal');
const closeSuccess = document.getElementById('closeSuccess');
const contactForm = document.getElementById('contactForm');
const contactFormContainer = document.getElementById('contactFormContainer');
const successMessage = document.getElementById('successMessage');

// Open modal
if (contactBtns && modal) {
  contactBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      modal.style.display = 'flex';
      contactFormContainer.style.display = 'block';
      successMessage.style.display = 'none';
    });
  });
}

// Close modal
if (closeModal) closeModal.addEventListener('click', () => modal.style.display = 'none');
if (closeSuccess) closeSuccess.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

// Success function
function showSuccess() {
  contactFormContainer.style.display = 'none';
  successMessage.style.display = 'block';
  contactForm.reset();
}

// Handle form submission
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();

    const payload = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      service: document.getElementById('service').value,
      message: document.getElementById('message').value.trim()
    };

    try {
      const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyrknD-0nXM-n0jAvJmzsKIJrmVPD1FFELsoIxCRWp7DJWI7W5J65v8ItSlUzrboyH-vA/exec";

      const res = await fetch(WEB_APP_URL, {
        method: "POST",
        body: JSON.stringify(payload) // no explicit content-type
      });

      const text = await res.text();
      let result;
      try { result = JSON.parse(text); } 
      catch { result = { status: "error", message: text }; }

      if (result.status === "success") {
        showSuccess();
      } else {
        alert("Server error: " + (result.message || "Please try again"));
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Network error — check your Web App URL and deployment settings.");
    }
  });
}

