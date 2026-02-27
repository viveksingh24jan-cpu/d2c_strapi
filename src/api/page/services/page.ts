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
   * Expertly tuned for performance and depth.
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
          'page-builder.hero-section': { 
            populate: {
              backgroundImage: true,
              heroImage: true,
              ctaPrimary: { populate: '*' },
              ctaSecondary: { populate: '*' }
            }
          },
          'page-builder.text-block': true,
          'page-builder.card-grid': { 
            populate: { 
              cards: { 
                populate: {
                  image: true,
                  link: { populate: '*' }
                } 
              } 
            } 
          },
          'page-builder.media-block': { populate: { file: true } },
          'page-builder.accordion': { populate: { items: true } },
          'page-builder.testimonial-grid': { 
            populate: { 
              testimonials: { populate: { avatar: true } } 
            } 
          },
          'page-builder.video-block': { populate: { thumbnail: true } },
          'page-builder.comparison-table': true,
          'page-builder.banner': { populate: { ctaButton: { populate: '*' }, appLinks: { populate: '*' } } },
          'page-builder.progress-steps': { populate: { steps: true } },
          'page-builder.stats-bar': { populate: { stats: true } },
          'page-builder.insurance-product-cta': { 
            populate: { 
              product: { populate: { icon: true } } 
            } 
          },
          'page-builder.sticky-cta-bar': { populate: { ctaButton: { populate: '*' } } },
          'page-builder.featured-content': { populate: '*' },
          'shared.section-reference': { 
            populate: { 
              shared_section: { 
                populate: {
                  blocks: { populate: '*' }
                }
              }
            } 
          }
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
