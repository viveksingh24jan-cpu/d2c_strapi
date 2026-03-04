import type { StrapiApp } from '@strapi/strapi/admin';

// ─── Kiwi Brand Palette ─────────────────────────────────────────────────────
// Teal accent    : #17A0A0  (primary CTA)
// Dark charcoal  : #1A1A1A  (primary text)
// Light cyan bg  : #B3E5EF  (highlight surfaces)
// White          : #FFFFFF  (card / form backgrounds)
// Light gray     : #F5F5F5  (page backgrounds)
// Medium gray    : #757575  (secondary text)
// Dark gray      : #2D2D2D  (body text)
// ─────────────────────────────────────────────────────────────────────────────

const teal = {
  50:  '#E6F7F7',
  100: '#C5F0F0',
  200: '#8DDDDD',
  300: '#5ACCCC',
  400: '#2BBDBD',
  500: '#17A0A0',   // brand teal – main interactive
  600: '#148E8E',   // hover / pressed
  700: '#107878',   // dark variant
  800: '#0B6060',
  900: '#084848',
};

export default {
  config: {
    auth: {
      logo: '/logo.svg',
    },
    menu: {
      logo: '/logo.svg',
    },
    head: {
      favicon: '/logo.svg',
    },
    locales: ['en'],
    translations: {
      en: {
        // ── Sidebar branding ─────────────────────────────────────────────
        'app.components.LeftMenu.navbrand.title': 'KIWI CMS',
        'app.components.LeftMenu.navbrand.workplace': 'Enterprise Content Engine',

        // ── Login screen ─────────────────────────────────────────────────
        'Auth.form.welcome.title': 'Welcome back',
        'Auth.form.welcome.subtitle': 'Sign in to manage Kiwi Insurance content',
        'Auth.form.button.login': 'Sign In',
        'Auth.form.forgot-password': 'Forgot your password?',
        'Auth.link.signin': 'Back to sign in',
        'Auth.form.reset-password.button': 'Reset Password',

        // ── Global UI strings ─────────────────────────────────────────────
        'app.components.homepage.welcome': 'Good morning, Kiwi Team 🥝',
        'app.components.homepage.welcome.again': 'Welcome back to the Content Engine',
        'app.components.BlockEditor.blocks.quote': 'Highlight',
        'app.components.BlockEditor.blocks.code': 'Code Block',

        // ── Content Manager labels ────────────────────────────────────────
        'content-manager.containers.List.addAnEntry': 'Add Entry',
        'content-manager.containers.List.empty': 'No entries found. Add your first entry.',
        'content-manager.actions.publish.label': 'Publish',
        'content-manager.actions.unpublish.label': 'Unpublish',
        'content-manager.actions.save.label': 'Save Draft',
        'content-manager.header-actions.edit-the-model': 'Edit Schema',

        // ── Collection type display names ─────────────────────────────────
        // These override the machine names in the nav sidebar
        'content-type-builder.plugin.name': 'Schema Builder',

        // ── Publish/draft workflow ────────────────────────────────────────
        'content-manager.containers.Edit.warningGoBack': 'You have unsaved changes. Are you sure you want to leave?',
        'content-manager.popUpWarning.warning.publish': 'This will make the entry visible on the live website.',

        // ── Media library ─────────────────────────────────────────────────
        'upload.plugin.name': 'Media Library',
        'upload.header.actions.add-assets': 'Upload Assets',

        // ── Settings ─────────────────────────────────────────────────────
        'Settings.profile.form.section.experience.title': 'Editor Preferences',
      },
    },
    theme: {
      // ── LIGHT THEME ──────────────────────────────────────────────────────
      light: {
        colors: {
          // Primary scale → teal (replaces Strapi's default purple)
          primary50:  teal[50],
          primary100: teal[100],
          primary200: teal[200],
          primary300: teal[300],
          primary400: teal[400],
          primary500: teal[500],
          primary600: teal[600],   // used by: buttons bg, input focus ring, links
          primary700: teal[700],   // used by: button hover, active states

          // Neutral scale → white → light-gray → charcoal
          // neutral0   = white surfaces (cards, inputs, modals)
          // neutral100 = page background (very light gray)
          // neutral800+ = body text → headings
          neutral0:    '#FFFFFF',
          neutral100:  '#F8F8F8',   // page / login screen background
          neutral150:  '#F5F5F5',
          neutral200:  '#EEEEEE',   // subtle dividers
          neutral300:  '#CCCCCC',   // input borders default
          neutral400:  '#AAAAAA',   // placeholder text
          neutral500:  '#757575',   // secondary / helper text  (brand medium gray)
          neutral600:  '#666666',
          neutral700:  '#555555',
          neutral800:  '#2D2D2D',   // body text                (brand dark gray)
          neutral900:  '#1A1A1A',   // headings / labels        (brand dark charcoal)
          neutral1000: '#000000',

          // Semantic – kept accessible, not overriding brand
          danger100: '#FFEAEA',
          danger200: '#FFBDBD',
          danger500: '#EE5E52',
          danger600: '#D02B20',
          danger700: '#B72B1A',

          success100: '#EAFBF4',
          success200: '#BDEFDB',
          success500: '#27AE60',
          success600: '#1E9E52',
          success700: '#187A3F',

          warning100: '#FFF8E7',
          warning200: '#FFE9A6',
          warning500: '#F0A400',
          warning600: '#D08900',
          warning700: '#A86D00',
        },
      },

      // ── DARK THEME ───────────────────────────────────────────────────────
      // Only swap the primary scale so teal is consistent in dark mode.
      // Neutrals are intentionally left to Strapi's built-in dark defaults
      // (avoids the solid-black background you saw).
      dark: {
        colors: {
          primary50:  teal[900],
          primary100: teal[800],
          primary200: teal[700],
          primary300: teal[600],
          primary400: teal[500],
          primary500: teal[500],
          primary600: teal[400],   // brighter in dark mode for contrast
          primary700: teal[300],
        },
      },
    },
  },

  bootstrap(app: StrapiApp) {
    console.log('Kiwi Insurance CMS – admin ready');
  },
};
