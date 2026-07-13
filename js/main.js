/* ==========================================================================
   Klix Digital — Site interactions & GSAP animations
   ========================================================================== */

/* Safety net: if GSAP/ScrollTrigger fail to load (CDN blocked, offline, slow
   network) or a tab stays backgrounded long enough to stall rAF, .reveal
   content must not stay permanently invisible. */
setTimeout(() => {
  // .reveal/.reveal-item are hidden by a CSS rule, so force them visible explicitly.
  document.querySelectorAll('.reveal, .reveal-item').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
  // hero/page-header/blob elements are only ever hidden via inline styles GSAP
  // sets at runtime, so clearing the inline style restores their CSS default.
  document.querySelectorAll('.hero *, .page-header *, .blob').forEach(el => {
    el.style.opacity = '';
    el.style.transform = '';
  });
}, 2500);

if (typeof gsap === 'undefined') {
  console.warn('GSAP failed to load — animations disabled, static layout still functional.');
} else {

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduceMotion) gsap.globalTimeline.timeScale(50);

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Preloader-free entrance ---------- */
  gsap.to('body', { opacity: 1, duration: 0.6, ease: 'power2.out' });

  /* ---------- Nav scroll state ---------- */
  const nav = document.querySelector('.nav');
  ScrollTrigger.create({
    start: 'top -80',
    end: 99999,
    toggleClass: { targets: nav, className: 'scrolled' }
  });

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      toggle.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  /* ---------- Custom cursor ---------- */
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (dot && ring && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    window.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });
    gsap.ticker.add(() => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
    });
    document.querySelectorAll('a, button, .card, .filter-btn').forEach(el => {
      el.addEventListener('mouseenter', () => ring.style.width = ring.style.height = '64px');
      el.addEventListener('mouseleave', () => ring.style.width = ring.style.height = '38px');
    });
  }

  /* ---------- Magnetic buttons ---------- */
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      gsap.to(el, { x: x * 0.35, y: y * 0.35, duration: 0.5, ease: 'power3.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    });
  });

  /* ---------- Hero entrance ---------- */
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  if (document.querySelector('.hero')) {
    heroTl
      .from('.hero .eyebrow', { y: 20, opacity: 0, duration: 0.6 })
      .from('.hero h1', { y: 50, opacity: 0, duration: 0.9 }, '-=0.4')
      .from('.hero .lead', { y: 30, opacity: 0, duration: 0.8 }, '-=0.6')
      .from('.hero-actions', { y: 30, opacity: 0, duration: 0.8 }, '-=0.6')
      .from('.hero-stats > *', { y: 20, opacity: 0, duration: 0.6, stagger: 0.12 }, '-=0.4')
      .from('.blob', { scale: 0, opacity: 0, duration: 1.4, stagger: 0.15, ease: 'power2.out' }, 0);
  } else if (document.querySelector('.page-header')) {
    gsap.from('.page-header .breadcrumb', { y: 16, opacity: 0, duration: 0.5 });
    gsap.from('.page-header .eyebrow', { y: 20, opacity: 0, duration: 0.6, delay: 0.1 });
    gsap.from('.page-header h1', { y: 40, opacity: 0, duration: 0.8, delay: 0.15 });
    gsap.from('.page-header .lead', { y: 30, opacity: 0, duration: 0.8, delay: 0.25 });
  }

  /* ---------- Scroll reveals ---------- */
  gsap.utils.toArray('.reveal').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  gsap.utils.toArray('.reveal-group').forEach(group => {
    const items = group.querySelectorAll('.reveal-item');
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: { trigger: group, start: 'top 85%' }
    });
  });

  /* ---------- Animated counters ---------- */
  gsap.utils.toArray('.stat-num[data-count]').forEach(el => {
    const end = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const decimals = el.getAttribute('data-decimals') ? parseInt(el.getAttribute('data-decimals')) : 0;
    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: end,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => { el.textContent = obj.val.toFixed(decimals) + suffix; }
        });
      }
    });
  });

  /* ---------- Testimonial slider ---------- */
  const track = document.querySelector('.testimonial-track');
  if (track) {
    const slides = track.querySelectorAll('.testimonial');
    const dotsWrap = document.querySelector('.dots');
    let idx = 0;
    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    });
    function goTo(i) {
      idx = i;
      gsap.to(track, { xPercent: -100 * idx, duration: 0.7, ease: 'power3.inOut' });
      dotsWrap.querySelectorAll('.dot').forEach((d, di) => d.classList.toggle('active', di === idx));
    }
    setInterval(() => goTo((idx + 1) % slides.length), 5500);
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = null;
        }
      });
      item.classList.toggle('open', !isOpen);
      a.style.maxHeight = !isOpen ? a.scrollHeight + 'px' : null;
    });
  });

  /* ---------- Work filter ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.getAttribute('data-filter');
        workCards.forEach(card => {
          const cats = (card.getAttribute('data-category') || '').split(' ');
          const match = f === 'all' || cats.includes(f);
          gsap.to(card, {
            opacity: match ? 1 : 0,
            scale: match ? 1 : 0.9,
            duration: 0.35,
            onComplete: () => { card.style.display = match ? '' : 'none'; }
          });
        });
      });
    });
  }

  /* ---------- Contact form (Formspree AJAX) ---------- */
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = document.querySelector('#form-status');
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (res.ok) {
          form.reset();
          status.textContent = "Thanks — we'll be in touch within one business day.";
          status.style.color = 'var(--lime)';
        } else {
          status.textContent = 'Something went wrong. Please email us directly.';
          status.style.color = '#ff6b6b';
        }
      } catch (err) {
        status.textContent = 'Network error — please email us directly.';
        status.style.color = '#ff6b6b';
      }
      btn.textContent = originalText;
    });
  }

});

}
