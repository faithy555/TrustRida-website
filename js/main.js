/* =========================================================
   TRUSTRIDA — SITE SCRIPTS
   Progressive enhancement only: every page remains usable
   and readable with JavaScript disabled.
   ========================================================= */

(function () {
  'use strict';

  /* -------------------------------------------------------
     Mobile navigation
     ------------------------------------------------------- */
  function initNav() {
    var header = document.querySelector('.site-header');
    var toggle = document.querySelector('.nav-toggle');
    if (!header || !toggle) return;

    function close() {
      header.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close when a link inside the panel is followed.
    header.addEventListener('click', function (event) {
      if (event.target.closest('.main-nav a, .nav-cta a')) close();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && header.classList.contains('is-open')) {
        close();
        toggle.focus();
      }
    });

    // Reset state when the layout returns to desktop width.
    var desktop = window.matchMedia('(min-width: 901px)');
    var onChange = function (event) {
      if (event.matches) close();
    };
    if (desktop.addEventListener) desktop.addEventListener('change', onChange);
    else if (desktop.addListener) desktop.addListener(onChange);
  }

  /* -------------------------------------------------------
     Accordion (FAQ)
     ------------------------------------------------------- */
  function initAccordions() {
    var triggers = document.querySelectorAll('.accordion-trigger');

    Array.prototype.forEach.call(triggers, function (trigger) {
      var item = trigger.closest('.accordion-item');
      var panel = item && item.querySelector('.accordion-panel');
      if (!panel) return;

      trigger.setAttribute('aria-expanded', item.classList.contains('is-open') ? 'true' : 'false');

      trigger.addEventListener('click', function () {
        var open = item.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
        panel.hidden = false;
      });
    });
  }

  /* -------------------------------------------------------
     Forms — client-side confirmation
     No backend is wired up yet; the form reports success
     locally and clears, rather than silently doing nothing.
     ------------------------------------------------------- */
  function initForms() {
    var forms = document.querySelectorAll('form[data-demo-form]');

    Array.prototype.forEach.call(forms, function (form) {
      var status = form.querySelector('.form-status');

      form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        if (status) {
          status.classList.add('is-visible');
          status.setAttribute('role', 'status');
          if (typeof status.scrollIntoView === 'function') {
            status.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          }
        }
        form.reset();
      });
    });
  }

  /* -------------------------------------------------------
     Footer year
     ------------------------------------------------------- */
  function initYear() {
    var nodes = document.querySelectorAll('[data-year]');
    var year = String(new Date().getFullYear());
    Array.prototype.forEach.call(nodes, function (node) {
      node.textContent = year;
    });
  }

  function init() {
    initNav();
    initAccordions();
    initForms();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
