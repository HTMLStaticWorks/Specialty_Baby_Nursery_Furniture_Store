document.addEventListener('DOMContentLoaded', () => {
  // Theme Management
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);

  const themeToggles = document.querySelectorAll('#theme-toggle, .theme-toggle-btn');
  themeToggles.forEach(themeToggle => {
    themeToggle.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      let newTheme = theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  });

  // RTL Management
  const currentDir = localStorage.getItem('dir') || 'ltr';
  document.documentElement.setAttribute('dir', currentDir);

  const rtlToggles = document.querySelectorAll('#rtl-toggle, .rtl-toggle-btn');
  rtlToggles.forEach(rtlToggle => {
    rtlToggle.addEventListener('click', () => {
      let dir = document.documentElement.getAttribute('dir');
      let newDir = dir === 'rtl' ? 'ltr' : 'rtl';
      document.documentElement.setAttribute('dir', newDir);
      localStorage.setItem('dir', newDir);
    });
  });

  // Sticky Header
  const header = document.querySelector('.navbar-custom');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('sticky');
      } else {
        header.classList.remove('sticky');
      }
    });
  }

  // Intersection Observer for Animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // observer.unobserve(entry.target); // Keep observing if we want animations to replay, else uncomment
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('.animate-fade-up, .animate-slide-left, .animate-slide-right, .animate-fade-in');
  animatedElements.forEach(el => observer.observe(el));

  // Form Validation (Contact Page)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      if (!contactForm.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }
      contactForm.classList.add('was-validated');
    }, false);
  }
});
