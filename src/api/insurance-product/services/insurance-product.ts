/**
 * insurance-product service
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::insurance-product.insurance-product', ({ strapi }) => ({
  /**
   * Returns a fully populated product based on slug or ID
   */
  async getPopulatedProduct(idOrSlug: string, query = {}) {
    // 1. Try by documentId first
    try {
      const entry = await strapi.documents('api::insurance-product.insurance-product').findOne({
        documentId: idOrSlug,
        ...query,
        populate: this.getCommonPopulation() as any,
      });
      if (entry) return entry;
    } catch (e) {
      // ignore
    }

    // 2. Fallback to slug
    return await strapi.documents('api::insurance-product.insurance-product').findFirst({
      ...query,
      filters: {
        slug: idOrSlug,
      },
      populate: this.getCommonPopulation() as any,
    });
  },

  getCommonPopulation() {
    // Re-use the deep population logic from Page service, adapted for product fields
    return {
      lineOfBusiness: true,
      insurancePlans: true,
      cardIcon: true,
      keyBenefits: true,
      cta: { populate: '*' },
      seo: { populate: { shareImage: true } },
      pageBuilder: {
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

  async enrichProductContent(entity: any) {
    // Delegate to the page service's recursive enricher
    // We just need to point it to 'pageBuilder' field
    if (entity && entity.pageBuilder) {
      await strapi.service('api::page.page').enrichPageContent(entity, 'pageBuilder');
    }
    return entity;
  }
}));
