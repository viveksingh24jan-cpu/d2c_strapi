async function testAdvanced() {
  console.log('--- STARTING ADVANCED TESTS ---');
  try {
    // 1. PRODUCTS
    const products = await strapi.documents('api::insurance-product.insurance-product').findMany({
      filters: { isActive: true },
      sort: 'startingPrice:asc',
      fields: ['productName', 'startingPrice']
    });
    console.log('[PRODUCTS] Found:', products.length);
    if (products.length) console.log('[PRODUCTS] First:', products[0].productName);

    // 2. ARTICLES (Pagination)
    const articles = await strapi.documents('api::article.article').findMany({
      pagination: { page: 1, pageSize: 1 },
      fields: ['title']
    });
    console.log('[ARTICLES] Page 1 Count:', articles.length);

    // 3. PAGE (Deep Populate)
    const page = await strapi.documents('api::page.page').findFirst({
      filters: { slug: 'home' },
      populate: { hero: true }
    });
    console.log('[PAGE] Home Title:', page ? page.title : 'NOT FOUND');
    console.log('[PAGE] Hero:', page && page.hero ? page.hero.title : 'NO HERO');

    // 4. RELATIONS
    const relArticles = await strapi.documents('api::article.article').findMany({
      filters: { categories: { slug: 'health-insurance' } }
    });
    console.log('[RELATION] Health Articles:', relArticles.length);

  } catch (e) {
    console.error('ERROR:', e);
  }
  process.exit(0);
}
testAdvanced();
