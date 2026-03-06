/**
 * insurance-product controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::insurance-product.insurance-product', ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;
    const { query } = ctx;

    const entity = await strapi.service('api::insurance-product.insurance-product').getPopulatedProduct(id, query);

    if (!entity) {
      return ctx.notFound();
    }

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    
    // Enrich automated components
    await strapi.service('api::insurance-product.insurance-product').enrichProductContent(sanitizedEntity);

    return this.transformResponse(sanitizedEntity);
  },
}));
