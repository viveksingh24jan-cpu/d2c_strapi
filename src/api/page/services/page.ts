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
      },
      seo: {
        populate: {
          shareImage: true
        }
      },
    };
  },

  /**
   * Enriches the page content by fetching data for automated components.
   * Modifies the page object in place.
   * Now Recursive!
   */
  async enrichPageContent(entity: any, field = 'content') {
    if (!entity || !entity[field] || !Array.isArray(entity[field])) return entity;

    // Helper to process a single component list (Dynamic Zone or Array of Components)
    const processComponentList = async (components: any[]) => {
      for (const component of components) {
        const type = component.__component;

        // --- RECURSION ---
        // 1. Tabs: Dive into each tab's content
        if (type === 'page-builder.tabs' && component.tabs) {
          for (const tab of component.tabs) {
             // 'content' is the name of the dynamic zone in tab-item
             if (tab.content) {
               await this.enrichPageContent(tab, 'content');
             }
          }
        }

        // 2. Shared Section Reference: Dive into the referenced section's blocks
        if (type === 'shared.section-reference' && component.shared_section && component.shared_section.blocks) {
          await this.enrichPageContent(component.shared_section, 'blocks');
        }

        // --- AUTOMATION ---
        // 3. Branch Locator
        if (type === 'page-builder.branch-locator') {
          const filters: any = {};
          if (component.filterType && component.filterType !== 'all') {
            filters.branchType = component.filterType;
          }

          component.data = await strapi.documents('api::branch.branch').findMany({
            filters,
            populate: '*', // Populate address blocks
          });
        }

        // 4. Leadership Grid
        if (type === 'page-builder.leadership-grid') {
          const filters: any = {};
          if (component.category && component.category !== 'All') {
            filters.category = component.category;
          }

          component.data = await strapi.documents('api::leadership-profile.leadership-profile').findMany({
            filters,
            sort: 'displayOrder:asc',
            populate: {
              photo: true,
              socialLinks: true,
            } as any,
          });
        }

        // 5. Document Listing
        if (type === 'page-builder.document-listing') {
          const filters: any = {};
          if (component.category) {
            filters.category = component.category;
          }

          component.data = await strapi.documents('api::download-document.download-document').findMany({
            filters,
            sort: 'publishDate:desc',
            populate: {
              fileAsset: true,
              internalLink: true,
              nestedSchedules: {
                populate: {
                  fileAsset: true,
                  internalLink: true, // Also populate links in schedules
                }
              }
            } as any,
          });
        }

        // 6. Product Grid (Automated Mode)
        if (type === 'page-builder.product-grid' && component.mode === 'automated') {
          component.data = await strapi.documents('api::insurance-product.insurance-product').findMany({
            filters: {
              isVisibleOnHomepage: true,
            },
            sort: 'sortOrder:asc',
            populate: {
              cardIcon: true,
              cta: true,
              keyBenefits: true,
            } as any,
          });
        }
      }
    };

    await processComponentList(entity[field]);
    return entity;
  }
}));
