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
      metadata: {
        populate: {
          attachmentForDownload: true,
        },
      },
      content: {
        on: {
          'page-builder.hero-section': { populate: '*' },
          'page-builder.text-block': { populate: '*' },
          'page-builder.card-grid': { populate: { cards: { populate: '*' } } },
          'page-builder.media-block': { populate: '*' },
          'page-builder.accordion': { populate: { items: true } },
          'page-builder.testimonial-grid': { populate: { testimonials: true } },
          'page-builder.video-block': { populate: '*' },
          'page-builder.comparison-table': { populate: '*' },
          'page-builder.app-banner': { populate: '*' },
          'page-builder.sticky-cta-bar': { populate: '*' },
          'page-builder.banner': { populate: '*' },
          'page-builder.progress-steps': { populate: { steps: true } },
          'page-builder.stats-bar': { populate: { stats: true } },
          'page-builder.product-showcase': { populate: { products: true } },
          'page-builder.featured-content': { populate: '*' },
          'page-builder.grievance-levels': { populate: '*' },
          'shared.rich-text': true,
          'shared.media': { populate: '*' },
          'shared.slider': { populate: '*' },
          'shared.alert': true,
          'shared.product-cta': { populate: '*' }
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
