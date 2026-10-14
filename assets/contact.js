/*
 * DavinSane contact, the single source for how people reach the site owner.
 * - CONTACT_EMAIL is defined once here and read by the footer, the dialog and the closing blocks.
 * - [data-contact-open]   opens the contact dialog (native <dialog>).
 * - [data-contact-copy]   copies the email (dialog button or icon button).
 * - [data-contact-mailto] gets href="mailto:<email>?subject=<translated subject>".
 * - [data-contact-email]  gets the email as text.
 * Copy lives in each page's `translations` (ct_* keys); language follows <html lang>.
 */
(function () {
  var CONTACT_EMAIL = 'santiago.op7.morales@gmail.com';
  window.CONTACT_EMAIL = CONTACT_EMAIL;

  var dialog, opener, live;

  function t(key) {
    var lang = document.documentElement.lang === 'es' ? 'es' : 'en';
    return (typeof translations !== 'undefined' && translations[lang] && translations[lang][key]) || '';
  }

  function mailto() {
    var subject = t('ct_subject') || 'Project from your portfolio';
    return 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject);
  }

  function refresh() {
    var href = mailto();
    document.querySelectorAll('[data-contact-mailto]').forEach(function (a) { a.setAttribute('href', href); });
    document.querySelectorAll('[data-contact-email]').forEach(function (el) {
      if (el.dataset.ctDone) return;
      el.dataset.ctDone = '1';
      var at = CONTACT_EMAIL.indexOf('@') + 1;
      // <wbr> after the @ gives a clean line break on very narrow screens
      el.append(CONTACT_EMAIL.slice(0, at), document.createElement('wbr'), CONTACT_EMAIL.slice(at));
    });
    document.querySelectorAll('[data-contact-copy][data-copy-icon]').forEach(function (b) {
      if (!b.classList.contains('is-copied')) b.setAttribute('aria-label', t('ct_copy_aria'));
    });
    var close = dialog && dialog.querySelector('.ct-dialog__close');
    if (close) close.setAttribute('aria-label', t('ct_close'));
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
    }
    return legacyCopy(text);
  }

  function legacyCopy(text) {
    return new Promise(function (resolve, reject) {
      var input = document.createElement('input');
      input.value = text;
      input.setAttribute('readonly', '');
      input.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none;';
      (dialog && dialog.open ? dialog : document.body).appendChild(input);
      input.select();
      input.setSelectionRange(0, text.length);
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      input.remove();
      ok ? resolve() : reject();
    });
  }

  function flash(btn) {
    var label = btn.querySelector('[data-copy-label]');
    var icon = btn.querySelector('.material-symbols-outlined');
    clearTimeout(btn._ctTimer);
    if (label) label.textContent = t('ct_copied');
    if (btn.hasAttribute('data-copy-icon')) {
      btn.classList.add('is-copied');
      btn.setAttribute('aria-label', t('ct_copied'));
      if (icon) icon.textContent = 'check';
    }
    live.textContent = '';
    setTimeout(function () { live.textContent = t('ct_copied'); }, 30);
    btn._ctTimer = setTimeout(function () {
      if (label) label.textContent = t('ct_copy');
      if (btn.hasAttribute('data-copy-icon')) {
        btn.classList.remove('is-copied');
        btn.setAttribute('aria-label', t('ct_copy_aria'));
        if (icon) icon.textContent = 'content_copy';
      }
      live.textContent = '';
    }, 2000);
  }

  function openDialog(from) {
    opener = from || document.activeElement;
    refresh();
    document.documentElement.style.overflow = 'hidden';
    dialog.showModal();
    dialog.querySelector('[data-contact-copy]').focus();
  }

  function build() {
    dialog = document.createElement('dialog');
    dialog.className = 'ct-dialog';
    dialog.setAttribute('aria-labelledby', 'ct-title');
    dialog.innerHTML =
      '<div class="ct-dialog__inner">' +
        '<h2 id="ct-title" class="ct-dialog__title" data-i18n="ct_title">Write to me</h2>' +
        '<p class="ct-dialog__note" data-i18n="ct_note">I reply by email.</p>' +
        '<p class="ct-dialog__email" data-contact-email></p>' +
        '<div class="ct-dialog__actions">' +
          '<button type="button" class="ct-pill ct-pill--light" data-contact-copy><span data-copy-label data-i18n="ct_copy" aria-live="polite">Copy</span></button>' +
          '<a class="ct-pill ct-pill--dark" data-contact-mailto href="#"><span data-i18n="ct_write">Write an email ↗</span></a>' +
        '</div>' +
        '<button type="button" class="ct-dialog__close" aria-label="Close"><span class="material-symbols-outlined" aria-hidden="true">close</span></button>' +
      '</div>';
    document.body.appendChild(dialog);

    live = document.createElement('div');
    live.className = 'sr-only';
    live.setAttribute('aria-live', 'polite');
    document.body.appendChild(live);

    dialog.querySelector('.ct-dialog__close').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', function () {
      document.documentElement.style.overflow = '';
      if (opener && opener.focus) opener.focus();
      opener = null;
    });
  }

  function init() {
    build();
    refresh();
    document.addEventListener('click', function (e) {
      var open = e.target.closest('[data-contact-open]');
      if (open) { e.preventDefault(); openDialog(open); return; }
      var copy = e.target.closest('[data-contact-copy]');
      if (copy) copyText(CONTACT_EMAIL).then(function () { flash(copy); }, function () {});
    });
    new MutationObserver(refresh).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }

  // Loaded at the end of <body>, so build now: the page's applyLang() runs after this and fills the data-i18n text.
  if (document.body) init();
  else document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('load', function () { if (dialog) refresh(); });
})();
