/**
 * article controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;
    const { query } = ctx;

    const entity = await strapi.service('api::article.article').getPopulatedArticle(id, query);

    if (!entity) {
      return ctx.notFound();
    }

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    // Enrich automated components
    await strapi.service('api::article.article').enrichArticleContent(sanitizedEntity);

    return this.transformResponse(sanitizedEntity);
  },
}));

