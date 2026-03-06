/**
 * article service.
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::article.article', ({ strapi }) => ({
  /**
   * Returns a fully populated article based on slug or ID
   */
  async getPopulatedArticle(idOrSlug: string, query = {}) {
    // 1. Try by documentId first
    try {
      const entry = await strapi.documents('api::article.article').findOne({
        documentId: idOrSlug,
        ...query,
        populate: this.getCommonPopulation() as any,
      });
      if (entry) return entry;
    } catch (e) {
      // ignore
    }

    // 2. Fallback to slug
    return await strapi.documents('api::article.article').findFirst({
      ...query,
      filters: {
        slug: idOrSlug,
      },
      populate: this.getCommonPopulation() as any,
    });
  },

  getCommonPopulation() {
    return {
      author: { populate: { avatar: true } },
      categories: true,
      cover: true,
      seo: { populate: { shareImage: true } },
      cta: { populate: '*' },
      blocks: {
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
          'page-builder.accordion': { populate: { items: { populate: { cta: { populate: '*' } } } } },
          'page-builder.testimonial-showcase': { populate: { manualTestimonials: { populate: { avatar: true } } } },
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
          'page-builder.cta-section': { 
            populate: { 
              ctaPrimary: { populate: '*' }, 
              ctaSecondary: { populate: '*' },
              backgroundImage: true 
            } 
          },
          'page-builder.tabs': { 
            populate: { 
              tabs: { 
                populate: {
                  content: { populate: '*' }
                } 
              } 
            } 
          },
          'page-builder.modals': true,
          'page-builder.charts': true,
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
      }
    };
  },

  async enrichArticleContent(entity: any) {
    if (entity && entity.blocks) {
      await strapi.service('api::page.page').enrichPageContent(entity, 'blocks');
    }
    return entity;
  }
}));
