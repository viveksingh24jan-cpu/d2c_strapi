import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    // Best in Class: Custom Branding
    auth: {
      logo: '/favicon.png',
    },
    menu: {
      logo: '/favicon.png',
    },
    head: {
      favicon: '/favicon.png',
    },
    theme: {
      light: {
        colors: {
          primary100: '#f6ecfc',
          primary200: '#eaf5ff',
          primary500: '#007bff',
          primary600: '#0056b3',
          primary700: '#004085',
          danger700: '#b72b1a',
        },
      },
    },
    locales: [
      'en',
    ],
    translations: {
      en: {
        'app.components.LeftMenu.navbrand.title': 'Kiwi CMS',
        'app.components.LeftMenu.navbrand.workplace': 'Content Workspace',
      },
    },
  },
  bootstrap(app: StrapiApp) {
    console.log('Kiwi CMS Admin initialized');
  },
};
