/*
 * DavinSane global footer.
 * Renders into <footer data-site-footer></footer> on every page.
 * Language follows <html lang>, which each page's applyLang() keeps updated.
 * Edit SOCIALS / CONTACT below to change links; an empty url renders as "#".
 */
(function () {
  var script = document.currentScript;
  var root = new URL('..', script.src).href; // site root, works from any folder depth

  var CONTACT = {
    email: '',            // e.g. 'hola@davinsane.com'
    location: 'Colombia'
  };

  var SOCIALS = [
    { name: 'Instagram', url: '', icon: '<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><path d="M17.5 6.5h.01"/>' },
    { name: 'YouTube',   url: '', icon: '<path d="M2.5 17a24.1 24.1 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.1 24.1 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>' },
    { name: 'LinkedIn',  url: '', icon: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>' },
    { name: 'Facebook',  url: '', icon: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>' },
    { name: 'TikTok',    url: '', icon: '<path d="M9 12a4 4 0 1 0 4 4V2.5c.6 2.6 2.6 4.6 5.5 5"/>' }
  ];

  var STRINGS = {
    en: {
      tagline: 'Designing digital products that work for the business and for the people who use them.',
      nav_title: 'Navigation', contact_title: 'Contact',
      home: 'Home', projects: 'Projects', blog: 'Blog', contact: 'Contact me',
      locale: 'Colombia (English)',
      locale_aria: 'Switch to Spanish',
      copy: '© 2026 Santiago Morales. All rights reserved.'
    },
    es: {
      tagline: 'Diseñando productos digitales que funcionan para el negocio y para quienes los usan.',
      nav_title: 'Navegación', contact_title: 'Contacto',
      home: 'Inicio', projects: 'Proyectos', blog: 'Blog', contact: 'Contáctame',
      locale: 'Colombia (Español)',
      locale_aria: 'Cambiar a inglés',
      copy: '© 2026 Santiago Morales. Todos los derechos reservados.'
    }
  };

  function svg(inner, size) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
  }
  var MAIL = '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>';
  var GLOBE = '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>';

  function render(el) {
    var t = STRINGS[document.documentElement.lang === 'es' ? 'es' : 'en'];
    var socials = SOCIALS.map(function (s) {
      return '<a href="' + (s.url || '#') + '" aria-label="' + s.name + '"' + (s.url ? ' target="_blank" rel="noopener"' : '') + '>' + svg(s.icon, 20) + '</a>';
    }).join('');
    var email = CONTACT.email
      ? '<a href="mailto:' + CONTACT.email + '" class="site-footer__mail">' + svg(MAIL, 16) + '<span>' + CONTACT.email + '</span></a>'
      : '';

    el.innerHTML =
      '<div class="site-footer__inner">' +
        '<div class="site-footer__top">' +
          '<div class="site-footer__brand">' +
            '<img src="' + root + 'img/SantiagoMorales.png" alt="" class="site-footer__avatar" width="56" height="56"/>' +
            '<div>' +
              '<p class="site-footer__name">Santiago Morales</p>' +
              '<p class="site-footer__tagline">' + t.tagline + '</p>' +
              '<div class="site-footer__socials">' + socials + '</div>' +
            '</div>' +
          '</div>' +
          '<nav class="site-footer__col" aria-label="' + t.nav_title + '">' +
            '<p class="site-footer__heading">' + t.nav_title + '</p>' +
            '<a href="' + root + 'index.html">' + t.home + '</a>' +
            '<a href="' + root + 'index.html#projects">' + t.projects + '</a>' +
            '<a href="' + root + 'blog.html">' + t.blog + '</a>' +
            '<a href="' + root + 'index.html#contact">' + t.contact + '</a>' +
          '</nav>' +
          '<div class="site-footer__col">' +
            '<p class="site-footer__heading">' + t.contact_title + '</p>' +
            email +
            '<span>' + CONTACT.location + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="site-footer__bottom">' +
          '<button type="button" class="site-footer__locale" aria-label="' + t.locale_aria + '">' + svg(GLOBE, 16) + '<span>' + t.locale + '</span></button>' +
          '<p>' + t.copy + '</p>' +
        '</div>' +
      '</div>';

    el.querySelector('.site-footer__locale').addEventListener('click', function () {
      if (typeof window.toggleLang === 'function') window.toggleLang();
    });
  }

  function init() {
    var el = document.querySelector('[data-site-footer]');
    if (!el) return;
    render(el);
    new MutationObserver(function () { render(el); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
