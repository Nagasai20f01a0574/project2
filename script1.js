
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
// 🎬 PROJECT CARD ANIMATIONS (your existing function kept)
// =======================
function animateProjects() {
  const projectCards = document.querySelectorAll('.project-card');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    if (prefersReduced) {
      card.style.opacity = '1';
      card.style.transform = 'none';
    } else {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'all 0.6s ease';
      observer.observe(card);
    }
  });
}
document.addEventListener('DOMContentLoaded', animateProjects);


// ==============
// Inline card details toggler (NEW)
// ==============
(function() {
  // State for currently open card
  let activeCard = null;

  // Open the card: add .open, set aria attributes, focus button
  function openCard(card) {
    if (!card) return;
    closeActiveCard();
    card.classList.add('open');
    card.setAttribute('aria-expanded', 'true');
    const details = card.querySelector('.card-details');
    if (details) details.setAttribute('aria-hidden', 'false');
    activeCard = card;
    // focus enroll button for accessibility if present
    const btn = card.querySelector('.btn-enroll');
    if (btn) btn.focus({ preventScroll: true });
  }

  // Close current active card if any
  function closeActiveCard() {
    if (!activeCard) return;
    activeCard.classList.remove('open');
    activeCard.setAttribute('aria-expanded', 'false');
    const details = activeCard.querySelector('.card-details');
    if (details) details.setAttribute('aria-hidden', 'true');
    activeCard = null;
  }

  // Toggle logic: if clicked card is active close it, otherwise open it
  function toggleCard(card) {
    if (!card) return;
    if (card === activeCard) closeActiveCard();
    else openCard(card);
  }

  // Initialize behavior after DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.project-card');

    // Ensure each card has the proper accessibility attributes
    cards.forEach((card, idx) => {
      if (!card.hasAttribute('data-key')) card.setAttribute('data-key', `p${idx+1}`);
      if (!card.hasAttribute('role')) card.setAttribute('role', 'button');
      if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
      if (!card.hasAttribute('aria-expanded')) card.setAttribute('aria-expanded', 'false');

      // Make sure the details element exists; if not, create a basic fallback to avoid errors
      if (!card.querySelector('.card-details')) {
        const fallback = document.createElement('div');
        fallback.className = 'card-details';
        fallback.innerHTML = `<div class="card-details-inner"><p>No details provided.</p></div>`;
        fallback.setAttribute('aria-hidden', 'true');
        card.appendChild(fallback);
      }
    });

    // Click listener on each card
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        // If click happened inside the details inner (buttons, links), don't toggle the card
        if (e.target.closest('.card-details-inner')) return;
        toggleCard(card);
      });

      // Keyboard support: Enter / Space to toggle, Escape to close
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleCard(card);
        } else if (e.key === 'Escape') {
          closeActiveCard();
        }
      });
    });

    // Click outside closes any open card
    document.addEventListener('click', (e) => {
      // If click inside a card or inside a details element, do nothing
      if (e.target.closest('.project-card') || e.target.closest('.card-details')) return;
      if (activeCard) closeActiveCard();
    });

    // Global Escape closes
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && activeCard) closeActiveCard();
    });

    // Optional: close card when window is resized (prevents layout issues)
    window.addEventListener('resize', () => {
      // if user prefers reduced motion or layout change, close active card to avoid stuck states
      if (activeCard) closeActiveCard();
    });
  });
})();


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
// 🧾 CONTACT FORM SUBMISSION (client-side)
// =======================
document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const modal = document.getElementById('contactModal');
  const contactBtns = document.querySelectorAll('.contact-btn');
  const closeModal = document.querySelector('.close-modal');
  const closeSuccess = document.getElementById('closeSuccess');
  const contactForm = document.getElementById('contactForm');
  const contactFormContainer = document.getElementById('contactFormContainer');
  const successMessage = document.getElementById('successMessage');
  const spinnerOverlay = document.getElementById('spinnerOverlay');
  const sendLottie = document.getElementById('sendLottie'); // lottie player

  // Defensive guards
  const submitBtn = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

  // Open modal when any .contact-btn clicked
  if (contactBtns && modal) {
    contactBtns.forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        modal.style.display = 'flex';
        if (contactFormContainer) contactFormContainer.style.display = 'block';
        if (successMessage) successMessage.style.display = 'none';
      });
    });
  }

  // Close handlers
  if (closeModal) closeModal.addEventListener('click', () => { modal.style.display = 'none'; });
  if (closeSuccess) closeSuccess.addEventListener('click', () => { modal.style.display = 'none'; });
  window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

  function showSuccess() {
    // stop lottie if playing
    if (sendLottie && typeof sendLottie.stop === 'function') {
      try { sendLottie.stop(); } catch (err) {}
    }

    // fade-out overlay
    if (spinnerOverlay) {
      spinnerOverlay.classList.add("hide");
      setTimeout(() => {
        spinnerOverlay.style.display = "none";
        spinnerOverlay.classList.remove("hide");
      }, 300);
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '';
      submitBtn.style.cursor = '';
    }

    if (contactFormContainer) {
      contactFormContainer.classList.add("form-hide");
      setTimeout(() => {
        contactFormContainer.style.display = 'none';
        contactFormContainer.classList.remove("form-hide");
      }, 250);
    }

    setTimeout(() => {
      if (successMessage) {
        successMessage.style.display = 'block';
        successMessage.classList.add("show-success");
      }
    }, 260);

    if (contactForm) contactForm.reset();
  }

  if (!contactForm) return;

  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const payload = {
      name: (document.getElementById('name')?.value || '').trim(),
      email: (document.getElementById('email')?.value || '').trim(),
      phone: (document.getElementById('phone')?.value || '').trim(),
      service: (document.getElementById('service')?.value || '').trim(),
      message: (document.getElementById('message')?.value || '').trim()
    };

    try {
      // show spinner and play lottie
      if (spinnerOverlay) {
        spinnerOverlay.style.display = 'flex';
        spinnerOverlay.classList.remove('hide');
      }
      if (sendLottie && typeof sendLottie.play === 'function') {
        try { sendLottie.play(); } catch (err) {}
      }
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        submitBtn.style.cursor = 'not-allowed';
      }

      const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyrknD-0nXM-n0jAvJmzsKIJrmVPD1FFELsoIxCRWp7DJWI7W5J65v8ItSlUzrboyH-vA/exec";
      const res = await fetch(WEB_APP_URL, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      const text = await res.text();
      let result;
      try { result = JSON.parse(text); } catch (err) { result = { status: 'error', message: text }; }

      if (result && result.status === 'success') {
        showSuccess();
      } else {
        // stop lottie + hide spinner
        if (sendLottie && typeof sendLottie.stop === 'function') try{ sendLottie.stop(); }catch(e){}
        if (spinnerOverlay) spinnerOverlay.style.display = 'none';
        if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = ''; submitBtn.style.cursor = ''; }
        alert("Server error: " + (result?.message || "Please try again"));
      }

    } catch (err) {
      console.error('Submit error:', err);
      if (sendLottie && typeof sendLottie.stop === 'function') try{ sendLottie.stop(); }catch(e){}
      if (spinnerOverlay) spinnerOverlay.style.display = 'none';
      if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = ''; submitBtn.style.cursor = ''; }
      alert("Network error — check your Web App URL and deployment settings.");
    }
  });

});
