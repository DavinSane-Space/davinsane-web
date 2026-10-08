/*
 * DavinSane design system: Tailwind config.
 * Every color points to a CSS variable defined in assets/theme.css (:root),
 * so the palette (and the --accent-* slots) can change without touching markup.
 * Legacy token names (background, on-surface, text-muted, primary...) are kept
 * and remapped to the light system so existing pages pick up the new look.
 */
(function () {
  function c(name) { return 'rgb(var(' + name + ') / <alpha-value>)'; }

  var palette = {
    // New system
    'page':        c('--c-bg'),
    'card':        c('--c-surface'),
    'title':       c('--c-title'),
    'body':        c('--c-body'),
    'secondary':   c('--c-secondary'),
    'tertiary':    c('--c-tertiary'),
    'line':        c('--c-border'),
    'ink':         c('--c-ink'),
    'panel-from':  c('--c-panel-from'),
    'panel-to':    c('--c-panel-to'),
    'accent-1':    c('--accent-1'),
    'accent-2':    c('--accent-2'),
    'accent-3':    c('--accent-3'),

    // Legacy tokens, remapped
    'background':                c('--c-bg'),
    'surface':                   c('--c-bg'),
    'surface-dim':               c('--c-bg'),
    'surface-elevated':          c('--c-surface'),
    'surface-container-lowest':  c('--c-surface'),
    'surface-container-low':     c('--c-surface'),
    'surface-container':         c('--c-subtle'),
    'surface-container-high':    c('--c-subtle'),
    'surface-container-highest': c('--c-panel-from'),
    'surface-variant':           c('--c-panel-from'),
    'surface-bright':            c('--c-panel-from'),
    'on-surface':                c('--c-title'),
    'on-background':             c('--c-title'),
    'on-surface-variant':        c('--c-body'),
    'text-muted':                c('--c-body'),
    'outline':                   c('--c-secondary'),
    'outline-variant':           c('--c-tertiary'),
    'border-low-contrast':       c('--c-border'),
    'primary':                   c('--accent-1'),
    'on-primary':                c('--c-on-ink')
  };

  window.tailwind = window.tailwind || {};
  tailwind.config = {
    darkMode: 'class',
    theme: {
      extend: {
        colors: palette,
        borderRadius: {
          'img':  '20px',
          'card': '24px',
          'btn':  '12px'
        },
        maxWidth: {
          'container': '1200px'
        },
        spacing: {
          'section-gap':    '112px',
          'gutter':         '24px',
          'element-gap':    '32px',
          'margin-desktop': '64px',
          'margin-mobile':  '20px',
          'container-max':  '1200px'
        },
        fontFamily: {
          'sans':               ['"Instrument Sans"', 'Inter', 'system-ui', 'sans-serif'],
          'serif':              ['Lora', 'Georgia', 'serif'],
          'display':            ['Lora', 'Georgia', 'serif'],
          'headline-lg':        ['Lora', 'Georgia', 'serif'],
          'headline-lg-mobile': ['Lora', 'Georgia', 'serif'],
          'headline-md':        ['"Instrument Sans"', 'Inter', 'sans-serif'],
          'headline-sm':        ['"Instrument Sans"', 'Inter', 'sans-serif'],
          'body-lg':            ['"Instrument Sans"', 'Inter', 'sans-serif'],
          'body-md':            ['"Instrument Sans"', 'Inter', 'sans-serif'],
          'label-md':           ['"Instrument Sans"', 'Inter', 'sans-serif'],
          'label-sm':           ['"Instrument Sans"', 'Inter', 'sans-serif']
        },
        fontSize: {
          'headline-lg':        ['64px', { lineHeight: '64px', letterSpacing: '-1.28px', fontWeight: '500' }],
          'headline-lg-mobile': ['40px', { lineHeight: '44px', letterSpacing: '-0.8px',  fontWeight: '500' }],
          'headline-md':        ['24px', { lineHeight: '32px', letterSpacing: '-0.48px', fontWeight: '500' }],
          'headline-sm':        ['20px', { lineHeight: '28px', letterSpacing: '-0.4px',  fontWeight: '500' }],
          'body-lg':            ['18px', { lineHeight: '28px', letterSpacing: '-0.36px', fontWeight: '400' }],
          'body-md':            ['16px', { lineHeight: '26px', letterSpacing: '-0.32px', fontWeight: '400' }],
          'label-md':           ['14px', { lineHeight: '20px', letterSpacing: '-0.14px', fontWeight: '500' }],
          'label-sm':           ['13px', { lineHeight: '18px', letterSpacing: '0',       fontWeight: '500' }]
        }
      }
    }
  };
})();
