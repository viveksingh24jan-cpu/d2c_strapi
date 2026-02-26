/**
 *  page service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::page.page', ({ strapi }) => ({
  /**
   * Returns a fully populated page based on slug or ID
   */
  async getPopulatedPage(idOrSlug: string, query = {}) {
    const isSlug = isNaN(Number(idOrSlug));
    
    return await strapi.documents('api::page.page').findFirst({
      ...query,
      filters: {
        ...(isSlug ? { slug: idOrSlug } : { id: idOrSlug }),
      },
      populate: this.getCommonPopulation() as any,
    });
  },

  /**
   * Centralized population object for reuse across Page and Bootstrap services
   */
  getCommonPopulation() {
    return {
      hero: {
        populate: {
          image: true,
        },
      },
      metadata: {
        populate: {
          attachment: true,
        },
      },
      blocks: {
        on: {
          'shared.media': { populate: '*' },
          'shared.slider': { populate: '*' },
          'shared.quote': true,
          'shared.rich-text': true,
          'shared.faq-item': true,
          'shared.process-step': true,
          'shared.award': { populate: '*' },
          'shared.lottie': true,
          'shared.alert': true,
          'shared.modal': true,
          'shared.product-cta': { populate: '*' },
          'shared.dynamic-comparison': { populate: '*' },
          'shared.compliance-banner': true,
          'shared.section-reference': { populate: '*' },
          'shared.featured-tools': {
            populate: {
              tools: true,
            },
          },
          'shared.comparison-table': true,
          'shared.stats': true,
          'shared.promo-card': { populate: '*' },
        },
      },
      seo: {
        populate: {
          shareImage: true
        }
      },
    };
  }
}));
