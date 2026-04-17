/* ═══════════════════════════════════════════════════
   DIGITAL ENTERPRISE LAB — script.js
   Vanilla JS — No dependencies
═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── DOM REFERENCES ─────────────────────────── */
  const nav         = document.getElementById('nav');
  const navToggle   = document.getElementById('navToggle');
  const navLinks    = document.getElementById('navLinks');
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  /* ─── NAV SCROLL BEHAVIOR ────────────────────── */
  let lastScrollY = 0;

  function handleNavScroll() {
    const scrollY = window.scrollY;

    // Add scrolled class after 80px
    if (scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // Run once on load

  /* ─── ACTIVE NAV HIGHLIGHT ───────────────────── */
  const navLinkEls = document.querySelectorAll('.nav__link:not(.nav__cta)');
  const sections   = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollMid = window.scrollY + window.innerHeight / 3;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id     = section.getAttribute('id');

      if (scrollMid >= top && scrollMid < bottom) {
        navLinkEls.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ─── MOBILE NAV TOGGLE ──────────────────────── */
  // Create overlay element
  const overlay = document.createElement('div');
  overlay.className = 'nav__overlay';
  document.body.appendChild(overlay);

  function openNav() {
    navLinks.classList.add('open');
    overlay.classList.add('visible');
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    navLinks.classList.remove('open');
    overlay.classList.remove('visible');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    if (isOpen) {
      closeNav();
    } else {
      openNav();
    }
  });

  overlay.addEventListener('click', closeNav);

  // Close nav on link click
  navLinkEls.forEach(link => {
    link.addEventListener('click', closeNav);
  });

  const navCta = document.querySelector('.nav__cta');
  if (navCta) {
    navCta.addEventListener('click', closeNav);
  }

  // Close nav on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeNav();
      navToggle.focus();
    }
  });

  /* ─── SMOOTH SCROLLING ───────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = nav ? nav.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });

  /* ─── SCROLL REVEAL ANIMATION ────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after reveal for performance
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ─── COHORT BAR ANIMATION ───────────────────── */
  const cohortBars = document.querySelectorAll('.cohort-row__bar');

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Bars animate via CSS transition on width
        // We just trigger a class to ensure width animates from 0
        entry.target.style.width = entry.target.style.width;
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  cohortBars.forEach(bar => {
    const targetWidth = bar.style.width;
    bar.style.width = '0%';
    barObserver.observe(bar);

    // Small delay to ensure transition fires
    setTimeout(() => {
      bar.style.width = targetWidth;
    }, 200);
  });

  /* ─── CONTACT FORM HANDLING ──────────────────── */
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name    = document.getElementById('name');
      const email   = document.getElementById('email');
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      let valid = true;

      // Simple validation
      if (!name || !name.value.trim()) {
        highlightError(name);
        valid = false;
      }

      if (!email || !isValidEmail(email.value)) {
        highlightError(email);
        valid = false;
      }

      if (!valid) return;

      // Simulate form submission
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        contactForm.reset();
        submitBtn.textContent = 'Send Message →';
        submitBtn.disabled = false;

        if (formSuccess) {
          formSuccess.classList.add('visible');
          setTimeout(() => {
            formSuccess.classList.remove('visible');
          }, 5000);
        }
      }, 1200);
    });

    // Clear error state on input
    contactForm.querySelectorAll('input, textarea, select').forEach(input => {
      input.addEventListener('input', function () {
        this.style.borderColor = '';
        this.style.boxShadow = '';
      });
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function highlightError(el) {
    if (!el) return;
    el.style.borderColor = '#CC1A1A';
    el.style.boxShadow = '3px 3px 0px #CC1A1A';
    el.focus();
  }

  /* ─── HERO TICKER PAUSE ON HOVER ─────────────── */
  const tickerInner = document.querySelector('.hero__ticker-inner');
  const tickerWrap  = document.querySelector('.hero__ticker-wrap');

  if (tickerInner && tickerWrap) {
    tickerWrap.addEventListener('mouseenter', () => {
      tickerInner.style.animationPlayState = 'paused';
    });

    tickerWrap.addEventListener('mouseleave', () => {
      tickerInner.style.animationPlayState = 'running';
    });
  }

  /* ─── SECTION NUMBER COUNTER ANIMATION ──────── */
  const statNums = document.querySelectorAll('.hero__stat-num');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el      = entry.target;
        const target  = parseInt(el.textContent, 10);
        if (isNaN(target)) return;

        animateCounter(el, 0, target, 1200);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.8 });

  statNums.forEach(num => counterObserver.observe(num));

  function animateCounter(el, from, to, duration) {
    const start   = performance.now();
    const range   = to - from;

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutQuart(progress);
      const value    = Math.round(from + range * eased);

      el.textContent = value;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  /* ─── KEYBOARD ACCESSIBILITY ─────────────────── */
  // Ensure focus is visible on keyboard nav
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', function () {
    document.body.classList.remove('keyboard-nav');
  });

  /* ─── INIT LOG ───────────────────────────────── */
  console.log(
    '%cDigital Enterprise Lab\n%cTurn Campus Skill Into Global Income.',
    'color: #2B52E0; font-size: 16px; font-weight: bold;',
    'color: #555; font-size: 12px;'
  );

})();