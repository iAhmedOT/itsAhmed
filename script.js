const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle?.querySelector('.theme-toggle__icon');
const storageKey = 'iAhmed-theme';

const applyTheme = (theme) => {
  document.body.dataset.theme = theme;
  if (themeIcon) {
    themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
  }
};

const savedTheme = localStorage.getItem(storageKey);
if (savedTheme === 'light' || savedTheme === 'dark') {
  applyTheme(savedTheme);
} else {
  applyTheme('light');
}

themeToggle?.addEventListener('click', () => {
  const nextTheme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
  applyTheme(nextTheme);
  localStorage.setItem(storageKey, nextTheme);
});

const formatCounterValue = (endValue, value) => {
  if (endValue === 98) return `${value}/100`;
  if (endValue >= 100) return `${value}+`;
  return `${value}`;
};

const animateCounter = (target) => {
  if (target.dataset.animated === 'true') return;
  target.dataset.animated = 'true';

  const endValue = Number(target.dataset.count || 0);
  const duration = 1100;
  const startTime = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(endValue * eased);
    target.textContent = formatCounterValue(endValue, value);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      target.textContent = formatCounterValue(endValue, endValue);
    }
  };

  requestAnimationFrame(tick);
};

const counters = document.querySelectorAll('[data-count]');
if ('IntersectionObserver' in window) {
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
} else {
  counters.forEach(animateCounter);
}

window.addEventListener('load', () => {
  counters.forEach((counter) => {
    const rect = counter.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      animateCounter(counter);
    }
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const filterButtons = document.querySelectorAll('.filter-chip');
const timelineItems = document.querySelectorAll('.timeline-item');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((chip) => chip.classList.remove('is-active'));
    button.classList.add('is-active');

    timelineItems.forEach((item) => {
      const tags = item.dataset.tags || '';
      const shouldShow = filter === 'all' || tags.includes(filter);
      item.classList.toggle('is-hidden', !shouldShow);
    });
  });
});
