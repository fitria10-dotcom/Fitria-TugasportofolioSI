// Theme toggle, mobile menu, smooth scroll, reveal on scroll, form handling
(function(){
  const themeToggle = document.getElementById('theme-toggle');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const yearEl = document.getElementById('year');

  // Set year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme: detect stored or system preference
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'light') {
    applyLightTheme();
  } else if (storedTheme === 'dark') {
    applyDarkTheme();
  } else {
    // fallback to system preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) applyDarkTheme(); else applyDarkTheme(); // default dark look
  }

  function applyDarkTheme(){
    document.documentElement.style.setProperty('--bg','#0b0f17');
    // you can add more variable swaps for light/dark if desired
    document.body.dataset.theme = 'dark';
    localStorage.setItem('theme','dark');
  }
  function applyLightTheme(){
    // Simple light overrides (minimal)
    document.documentElement.style.setProperty('--bg','#f6f8fb');
    document.documentElement.style.setProperty('--card','rgba(0,0,0,0.04)');
    document.documentElement.style.setProperty('--muted','#475569');
    document.documentElement.style.setProperty('--text','#0b1220');
    document.body.dataset.theme = 'light';
    localStorage.setItem('theme','light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = localStorage.getItem('theme');
      if (current === 'light') {
        applyDarkTheme();
      } else {
        applyLightTheme();
      }
      themeToggle.animate([{transform:'rotate(0deg)'},{transform:'rotate(360deg)'}],{duration:420});
    });
  }

  // Mobile menu toggle
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      const open = !mobileMenu.hasAttribute('hidden');
      if (open) {
        mobileMenu.hidden = true;
        mobileBtn.setAttribute('aria-label','Buka menu');
      } else {
        mobileMenu.hidden = false;
        mobileBtn.setAttribute('aria-label','Tutup menu');
      }
    });
    mobileBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        mobileBtn.click();
      }
    });
  }

  // Smooth scroll for anchor links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
        // close mobile menu on selection
        if (mobileMenu && !mobileMenu.hasAttribute('hidden')) {
          mobileMenu.hidden = true;
        }
      }
    });
  });

  // Reveal on scroll using IntersectionObserver
  const reveals = Array.from(document.querySelectorAll('.section, .card, .project-card, .hero-content, .hero-card'));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Optionally unobserve for performance
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: 0.08});
    reveals.forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });
  } else {
    // Fallback: reveal all
    reveals.forEach(el => el.classList.add('visible'));
  }

  // Simple form handling (dummy)
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      status.textContent = '';
      const name = (form.name && form.name.value || '').trim();
      const email = (form.email && form.email.value || '').trim();
      const message = (form.message && form.message.value || '').trim();
      if (!name || !email || !message) {
        status.textContent = 'Mohon lengkapi semua field.';
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        status.textContent = 'Alamat email tidak valid.';
        return;
      }
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Mengirim...';
      }
      // Simulate send (replace with real fetch to endpoint when ready)
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Kirim Pesan';
        }
        status.textContent = 'Terima kasih! Pesan Anda telah dikirim (simulasi).';
        form.reset();
      }, 1000);
    });
  }

})();