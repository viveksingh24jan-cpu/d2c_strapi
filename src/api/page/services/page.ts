/**
 *  page service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::page.page', ({ strapi }) => ({
  /**
   * Returns a fully populated page based on slug or ID
   */
  async getPopulatedPage(idOrSlug: string, query = {}) {
    // 1. Try by documentId first (Strapi 5 standard)
    try {
      const entry = await strapi.documents('api::page.page').findOne({
        documentId: idOrSlug,
        ...query,
        populate: this.getCommonPopulation() as any,
      });
      if (entry) return entry;
    } catch (e) {
      // ignore and try by slug
    }

    // 2. Fallback to slug search
    return await strapi.documents('api::page.page').findFirst({
      ...query,
      filters: {
        slug: idOrSlug,
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
          attachmentForDownload: true,
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
