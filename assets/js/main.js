// ===== SLS SHARED JAVASCRIPT =====

document.addEventListener('DOMContentLoaded', function () {

  // ---------- Active nav link ----------
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-sls .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html') || (page === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ---------- Preloader ----------
  const preloader = document.getElementById('preloader');
  if (preloader) {
    const hidePreloader = () => preloader.classList.add('loaded');
    // Hide once everything (images/fonts) has loaded, with a safety timeout
    // so a slow asset never traps the visitor behind the loader.
    window.addEventListener('load', hidePreloader);
    setTimeout(hidePreloader, 2500);
  }

  // ---------- Scroll animations ----------
  const fadeEls = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  fadeEls.forEach(el => observer.observe(el));

  // ---------- Counter animation ----------
  const counters = document.querySelectorAll('[data-count]');
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        let count = 0;
        const step = Math.max(1, Math.floor(target / 60));
        const timer = setInterval(() => {
          count = Math.min(count + step, target);
          el.textContent = count + suffix;
          if (count >= target) clearInterval(timer);
        }, 20);
        countObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => countObs.observe(el));

  // ---------- WhatsApp toggle ----------
  const waBtn = document.getElementById('waMainBtn');
  const waPopup = document.getElementById('waPopup');
  const waClose = document.getElementById('waClose');

  if (waBtn && waPopup) {
    waBtn.addEventListener('click', () => {
      waPopup.classList.toggle('open');
    });
    if (waClose) {
      waClose.addEventListener('click', () => waPopup.classList.remove('open'));
    }
    document.addEventListener('click', e => {
      if (!e.target.closest('.wa-fab')) waPopup.classList.remove('open');
    });
  }

  // ---------- Back to top ----------
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) backToTop.classList.add('show');
      else backToTop.classList.remove('show');
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Quote form(s) ----------
  document.querySelectorAll('form.quote-form, #quoteForm').forEach(initQuoteForm);

  // ---------- Gallery lightbox ----------
  initGalleryLightbox();

});

/**
 * Wires up validation + Google Apps Script submission for a quote form.
 * Field mapping is driven by each input's `name` attribute, so this works
 * for both the full contact.html form and the shorter homepage form.
 */
function initQuoteForm(form) {
  if (!form || form.dataset.wired) return;
  form.dataset.wired = 'true';

  const successBox = form.parentElement.querySelector('.form-success') ||
                      document.getElementById('formSuccess');
  let errorBox = form.querySelector('.form-error');
  if (!errorBox) {
    errorBox = document.createElement('div');
    errorBox.className = 'form-error';
    errorBox.setAttribute('role', 'alert');
    form.prepend(errorBox);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    errorBox.classList.remove('show');

    // ---- Validate required fields ----
    let firstInvalid = null;
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      field.classList.remove('field-invalid');
      const isEmpty = !field.value || !field.value.trim();
      const isBadEmail = field.type === 'email' && field.value &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
      if (isEmpty || isBadEmail) {
        field.classList.add('field-invalid');
        valid = false;
        if (!firstInvalid) firstInvalid = field;
      }
    });

    if (!valid) {
      errorBox.textContent = 'Please fill in all required fields with valid details before submitting.';
      errorBox.classList.add('show');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // ---- Collect data by name attribute ----
    const data = { page: window.location.pathname.split('/').pop() || 'index.html' };
    new FormData(form).forEach((value, key) => { data[key] = value; });

    const scriptUrl = (window.SLS_CONFIG && window.SLS_CONFIG.GOOGLE_SCRIPT_URL) || '';
    const btn = form.querySelector('.btn-submit');
    const originalBtnText = btn ? btn.textContent : '';
    if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }

    const showSuccess = () => {
      form.style.display = 'none';
      if (successBox) successBox.style.display = 'block';
      successBox && successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const showError = () => {
      if (btn) { btn.textContent = originalBtnText; btn.disabled = false; }
      errorBox.textContent = 'Something went wrong sending your enquiry. Please try again, or reach us directly on WhatsApp / phone.';
      errorBox.classList.add('show');
    };

    if (!scriptUrl || scriptUrl.indexOf('PASTE_YOUR') !== -1) {
      // No backend configured yet — fall back to a local success state
      // so the site still demos correctly, but warn in the console.
      console.warn('SLS: Google Apps Script URL is not configured yet (assets/js/config.js). Form data was not sent anywhere:', data);
      setTimeout(showSuccess, 800);
      return;
    }

    fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors', // Apps Script web apps don't return CORS headers
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data)
    })
      .then(showSuccess)
      .catch(showError);
  });
}

/**
 * Builds and wires a simple lightbox for the gallery grid. Since the
 * gallery currently uses icon+caption placeholder tiles (no photos have
 * been supplied yet), the lightbox enlarges that same placeholder content.
 * Once real photos are dropped into assets/img/gallery/, replace the
 * placeholder <div class="gallery-placeholder-img"> contents with an
 * <img> tag — the lightbox will automatically pick up an image if present.
 */
function initGalleryLightbox() {
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  if (!items.length) return;

  let overlay = document.getElementById('lightboxOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.id = 'lightboxOverlay';
    overlay.innerHTML = `
      <div class="lightbox-inner">
        <button class="lightbox-close" aria-label="Close">&times;</button>
        <button class="lightbox-nav lightbox-prev" aria-label="Previous">&#10094;</button>
        <button class="lightbox-nav lightbox-next" aria-label="Next">&#10095;</button>
        <div class="lightbox-visual"></div>
        <div class="lightbox-caption"></div>
      </div>`;
    document.body.appendChild(overlay);
  }

  const visual = overlay.querySelector('.lightbox-visual');
  const caption = overlay.querySelector('.lightbox-caption');
  let currentIndex = 0;

  function render(index) {
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];
    const img = item.querySelector('img');
    const icon = item.querySelector('.gallery-placeholder-img i');
    const overlayText = item.querySelector('.gallery-overlay span');
    const captionText = overlayText ? overlayText.textContent : '';

    if (img) {
      visual.innerHTML = `<img src="${img.src}" alt="${img.alt || captionText}" style="max-width:100%;max-height:70vh;border-radius:10px;display:block;">`;
    } else {
      const iconClass = icon ? icon.className : 'fas fa-image';
      visual.innerHTML = `<i class="${iconClass}"></i><h5>${captionText}</h5>`;
    }
    caption.textContent = captionText;
  }

  items.forEach((item, index) => {
    item.style.cursor = 'zoom-in';
    item.addEventListener('click', () => {
      render(index);
      overlay.classList.add('open');
    });
  });

  overlay.querySelector('.lightbox-close').addEventListener('click', () => overlay.classList.remove('open'));
  overlay.querySelector('.lightbox-prev').addEventListener('click', () => render(currentIndex - 1));
  overlay.querySelector('.lightbox-next').addEventListener('click', () => render(currentIndex + 1));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('open'); });
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') overlay.classList.remove('open');
    if (e.key === 'ArrowLeft') render(currentIndex - 1);
    if (e.key === 'ArrowRight') render(currentIndex + 1);
  });
}
