/**
 *  page controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::page.page', ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;
    const { query } = ctx;

    const entity = await strapi.service('api::page.page').getPopulatedPage(id, query);

    if (!entity) {
      return ctx.notFound();
    }

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    
    // Enrich automated components with real data
    await strapi.service('api::page.page').enrichPageContent(sanitizedEntity);

    return this.transformResponse(sanitizedEntity);
  },
}));
