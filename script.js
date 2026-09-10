document.documentElement.classList.add('js');

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const header = document.querySelector('[data-header]');
const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];

function setMenu(open) {
  if (!menuButton || !nav) return;
  nav.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
}

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuButton.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) setMenu(false);
  });
}

function updateHeader() {
  header?.classList.toggle('scrolled', window.scrollY > 24);
}

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = [...document.querySelectorAll('.reveal')];

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

  revealItems.forEach((item) => revealObserver.observe(item));
}

const observedSections = ['services', 'systems', 'proof', 'approach', 'about', 'contact']
  .map((id) => document.getElementById(id))
  .filter(Boolean);

if ('IntersectionObserver' in window && observedSections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${visible.target.id}`;
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { threshold: [0.18, 0.35, 0.55], rootMargin: '-18% 0px -55% 0px' });

  observedSections.forEach((section) => sectionObserver.observe(section));
}

const briefButton = document.querySelector('[data-copy-brief]');
const copyStatus = document.querySelector('[data-copy-status]');
const isSlovenian = document.documentElement.lang.toLowerCase().startsWith('sl');
const briefText = isSlovenian ? `AlpskiMedved.solutions — izhodišče projekta

Lokacija in okolje:

Kaj odpoveduje in kdaj:

Kdo ali kaj je prizadeto:

Kaj mora ostati v delovanju:

Trenutna povezljivost in oprema, če sta znani:

Časovne omejitve ali pomembni datumi:

Kako je videti uspešen rezultat:` : `AlpskiMedved.solutions — project brief

Location and environment:

What is failing, and when:

Who or what is affected:

What must keep working:

Current connectivity and equipment, if known:

Time constraints or important dates:

What a successful outcome looks like:`;

async function copyBrief() {
  try {
    await navigator.clipboard.writeText(briefText);
  } catch (error) {
    const field = document.createElement('textarea');
    field.value = briefText;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    if (!copied) throw error;
  }

  if (copyStatus) copyStatus.textContent = isSlovenian
    ? 'Izhodišče je kopirano — prilepite ga v sporočilo ali zapiske.'
    : 'Project brief copied — paste it into your preferred message or notes app.';
  if (briefButton) briefButton.textContent = isSlovenian ? 'Izhodišče kopirano' : 'Brief copied';
}

briefButton?.addEventListener('click', copyBrief);

document.querySelectorAll('[data-year]').forEach((year) => {
  year.textContent = String(new Date().getFullYear());
});
