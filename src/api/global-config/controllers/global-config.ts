/**
 *  global-config controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::global-config.global-config', ({ strapi }) => ({
  async bootstrap(ctx) {
    try {
      // 1. Fetch Global Config
      const config = await strapi.documents('api::global-config.global-config').findFirst({
        populate: {
          favicon: true,
          headerLogo: true,
          footerLogo: true,
          defaultSeo: { populate: '*' },
          socialLinks: true,
          appLinks: true,
          trustMetrics: true,
        },
      });

      // 2. Fetch Navigation Menus (Full Tree)
      const menus = await strapi.documents('api::navigation-menu.navigation-menu').findMany({
        filters: { parent: { id: { $null: true } } }, // Top level only
        sort: 'displayOrder:asc',
        populate: {
          children: {
            populate: {
              children: true
            }
          }
        }
      });

      // 3. Optional: Fetch Homepage metadata or light version
      const homepage = await strapi.documents('api::page.page').findFirst({
        filters: { slug: 'home' },
        fields: ['title', 'slug', 'template'],
        populate: { hero: true }
      });

      return {
        data: {
          config,
          menus,
          homepage
        }
      };
    } catch (err) {
      ctx.body = err;
    }
  }
}));
