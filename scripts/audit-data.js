
const strapi = require('@strapi/strapi');

async function audit() {
  const app = await strapi.createStrapi({ distDir: './dist' }).load();
  console.log('🔍 Starting CMS Data Audit...');

  const collections = [
    'api::page.page', 'api::navigation-menu.navigation-menu', 'api::insurance-product.insurance-product',
    'api::insurance-plan.insurance-plan', 'api::coverage.coverage', 'api::line-of-business.line-of-business',
    'api::branch.branch', 'api::leadership-profile.leadership-profile',
    'api::download-document.download-document',
    'api::article.article', 'api::author.author', 'api::category.category', 'api::campaign.campaign',
    'api::testimonial.testimonial', 'api::shared-section.shared-section', 'api::tool.tool'
  ];

  const results = {};

  for (const uid of collections) {
    try {
      if (!app.documents(uid)) continue;
      const count = await app.documents(uid).count();
      const publishedCount = await app.documents(uid).count({ status: 'published' });
      const draftCount = count - publishedCount;
      results[uid] = { total: count, published: publishedCount, draft: draftCount };
    } catch (e) {
      // results[uid] = { error: e.message };
    }
  }

  // Check Global Config
  try {
    const gc = await app.documents('api::global-config.global-config').findFirst();
    results['api::global-config.global-config'] = gc ? 'Populated' : 'Empty';
  } catch (e) {
    results['api::global-config.global-config'] = { error: e.message };
  }

  console.log('📊 Audit Results:');
  console.table(results);

  process.exit(0);
}

audit().catch((err) => {
  console.error(err);
  process.exit(1);
});
