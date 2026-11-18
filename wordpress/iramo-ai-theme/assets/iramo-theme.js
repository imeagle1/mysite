/**
 * iRamoAi Theme Interactive Vanilla JS
 * Handles: Light/Dark Theme, Mobile Drawer, FAQ Accordion, AI Tools Live Filter,
 * Product Demo Sandbox, Copy Sample Prompt, Voting & REST Forms.
 */
(function () {
  'use strict';

  var cfg = window.iramoThemeData || {
    restUrl: '/wp-json/iramo/v1/',
    nonce: '',
    toolsArchive: '/ai-tools/',
    defaultTheme: 'light'
  };

  // 1. Light / Dark Theme Toggle
  function applyTheme(mode) {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('iramo_theme_mode', mode);
    } catch (e) {}
  }

  document.addEventListener('click', function (e) {
    var themeBtn = e.target.closest('[data-iramo-theme-toggle]');
    if (themeBtn) {
      var isDark = document.documentElement.classList.contains('dark');
      applyTheme(isDark ? 'light' : 'dark');
      return;
    }

    // 2. Mobile Nav Drawer
    var menuBtn = e.target.closest('[data-iramo-menu-toggle]');
    if (menuBtn) {
      var drawer = document.querySelector('[data-iramo-mobile-drawer]');
      if (drawer) {
        var open = drawer.classList.toggle('is-open');
        menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
      return;
    }

    // 3. FAQ Accordion
    var faqBtn = e.target.closest('[data-iramo-faq-toggle]');
    if (faqBtn) {
      var item = faqBtn.closest('.iramo-faq-item');
      if (item) {
        item.classList.toggle('is-open');
      }
      return;
    }

    // 4. Copy Sample Prompt
    var copyBtn = e.target.closest('[data-iramo-copy-prompt]');
    if (copyBtn) {
      var text = copyBtn.getAttribute('data-iramo-copy-prompt') || '';
      if (navigator.clipboard && text) {
        navigator.clipboard.writeText(text).then(function () {
          var prev = copyBtn.textContent;
          copyBtn.textContent = 'کپی شد ✓';
          setTimeout(function () {
            copyBtn.textContent = prev;
          }, 1800);
        });
      }
      return;
    }

    // 5. AI Tool Like / Dislike Vote
    var voteBtn = e.target.closest('[data-iramo-tool-vote]');
    if (voteBtn && cfg.restUrl) {
      var toolId = voteBtn.getAttribute('data-tool-id');
      var voteType = voteBtn.getAttribute('data-iramo-tool-vote');
      var countEl = voteBtn.querySelector('[data-vote-count]');
      voteBtn.disabled = true;
      fetch(cfg.restUrl + 'tools/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': cfg.nonce || ''
        },
        body: JSON.stringify({ post_id: toolId, vote: voteType })
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && res.success && countEl) {
            countEl.textContent = voteType === 'like' ? res.likes : res.dislikes;
          }
        })
        .catch(function () {})
        .finally(function () {
          voteBtn.disabled = false;
        });
      return;
    }
  });

  // 6. AI Tools Live Filter (runs on archive-iramo_ai_tool & Elementor grid widget)
  function initToolsFilter() {
    var root = document.querySelector('[data-iramo-tools-filter-root]');
    if (!root) return;

    var searchEl = root.querySelector('[data-filter-search]');
    var taskEl = root.querySelector('[data-filter-task]');
    var pricingEl = root.querySelector('[data-filter-pricing]');
    var inputEl = root.querySelector('[data-filter-input]');
    var outputEl = root.querySelector('[data-filter-output]');
    var countEl = root.querySelector('[data-filter-count]');
    var cards = Array.prototype.slice.call(root.querySelectorAll('[data-tool-item]'));
    var emptyEl = root.querySelector('[data-filter-empty]');

    function applyFilter() {
      var q = (searchEl ? searchEl.value : '').trim().toLowerCase();
      var task = taskEl ? taskEl.value : '';
      var pricing = pricingEl ? pricingEl.value : '';
      var inp = inputEl ? inputEl.value : '';
      var out = outputEl ? outputEl.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var cTitle = card.getAttribute('data-title') || '';
        var cTask = card.getAttribute('data-task') || '';
        var cPricing = card.getAttribute('data-pricing') || '';
        var cInput = card.getAttribute('data-input') || '';
        var cOutput = card.getAttribute('data-output') || '';

        var match =
          (!q || cTitle.indexOf(q) !== -1) &&
          (!task || cTask === task) &&
          (!pricing || cPricing === pricing) &&
          (!inp || cInput === inp) &&
          (!out || cOutput === out);

        if (match) {
          card.classList.remove('iramo-hidden');
          visible++;
        } else {
          card.classList.add('iramo-hidden');
        }
      });

      if (countEl) countEl.textContent = String(visible);
      if (emptyEl) {
        if (visible === 0) emptyEl.classList.remove('iramo-hidden');
        else emptyEl.classList.add('iramo-hidden');
      }
    }

    [searchEl, taskEl, pricingEl, inputEl, outputEl].forEach(function (el) {
      if (!el) return;
      el.addEventListener('input', applyFilter);
      el.addEventListener('change', applyFilter);
    });

    root.addEventListener('click', function (e) {
      var chip = e.target.closest('[data-quick-task]');
      if (chip && taskEl) {
        taskEl.value = chip.getAttribute('data-quick-task') || '';
        root.querySelectorAll('[data-quick-task]').forEach(function (c) {
          c.classList.toggle('is-active', c === chip);
        });
        applyFilter();
      }
    });

    applyFilter();
  }

  // 7. Interactive Product Sandbox Simulator
  function initProductSandbox() {
    var boxes = document.querySelectorAll('[data-iramo-sandbox]');
    boxes.forEach(function (box) {
      var input = box.querySelector('[data-sandbox-input]');
      var btn = box.querySelector('[data-sandbox-run]');
      var out = box.querySelector('[data-sandbox-output]');
      if (!input || !btn || !out) return;

      btn.addEventListener('click', function () {
        var val = (input.value || '').trim();
        out.innerHTML = '<div style="padding:12px;border-radius:12px;background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.3);font-size:13px;">' +
          '<strong>پردازش آزمایشی انجام شد ✓</strong><br/>' +
          'ورودی دریافتی: «' + val.replace(/</g, '&lt;') + '»<br/>' +
          'وضعیت خروجی: آماده انتقال مستقیم به هسته نرم‌افزار، صدور گزارش و ارسال خودکار به ربات تلگرام/بله.' +
          '</div>';
      });
    });
  }

  // 8. REST Newsletter & Consultation Forms
  function initForms() {
    document.querySelectorAll('[data-iramo-newsletter]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = form.querySelector('input[name="handle"]');
        var msgEl = form.parentElement.querySelector('[data-iramo-newsletter-msg]');
        if (!input || !input.value.trim()) return;
        var val = input.value.trim();
        var channel = val.indexOf('@') > 0 ? 'email' : (/^(?:\+?98|0)?9\d{9}$/.test(val.replace(/[\s-]/g, '')) ? 'bale' : 'telegram');
        fetch(cfg.restUrl + 'newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': cfg.nonce || '' },
          body: JSON.stringify({ channel: channel, handle: val })
        })
          .then(function (r) { return r.json(); })
          .then(function () {
            if (msgEl) msgEl.textContent = 'عضویت شما در خبرنامه iRamoAi با موفقیت ثبت شد ✓';
            input.value = '';
          })
          .catch(function () {
            if (msgEl) msgEl.textContent = 'خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.';
          });
      });
    });

    document.querySelectorAll('[data-iramo-consultation]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var msgEl = form.querySelector('[data-consultation-msg]');
        var data = {
          name: (form.querySelector('[name="name"]') || {}).value || '',
          contact: (form.querySelector('[name="contact"]') || {}).value || '',
          serviceType: (form.querySelector('[name="serviceType"]') || {}).value || 'bot',
          details: (form.querySelector('[name="details"]') || {}).value || ''
        };
        fetch(cfg.restUrl + 'consultation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': cfg.nonce || '' },
          body: JSON.stringify(data)
        })
          .then(function (r) { return r.json(); })
          .then(function (res) {
            if (res && res.success) {
              if (msgEl) msgEl.textContent = 'درخواست مشاوره شما ثبت و مستقیماً برای تیم مهندسی iRamoAi ارسال شد ✓';
              form.reset();
            } else if (msgEl) {
              msgEl.textContent = (res && res.message) ? res.message : 'لطفاً فیلدهای الزامی را تکمیل کنید.';
            }
          })
          .catch(function () {
            if (msgEl) msgEl.textContent = 'خطا در ارسال فرم.';
          });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initToolsFilter();
    initProductSandbox();
    initForms();
  });
})();
