async function cleanup() {
  console.log('🧹 Cleaning up old data...');
  const types = [
    'api::category.category',
    'api::article.article',
    'api::insurance-product.insurance-product',
    'api::tool-category.tool-category',
    'api::tool.tool',
    'api::page.page',
    'api::global-config.global-config',
    'api::grievance-level.grievance-level'
  ];

  for (const type of types) {
    try {
      const documents = await strapi.documents(type).findMany();
      for (const doc of documents) {
        await strapi.documents(type).delete({ documentId: doc.documentId });
      }
    } catch (e) {}
  }
}

async function seed() {
  try {
    await cleanup();
    console.log('🌱 Starting full database seed...');

    // 1. Categories
    const catHealth = await strapi.documents('api::category.category').create({ data: { name: 'Health Insurance', slug: 'health-insurance' }, status: 'published' });
    const catCar = await strapi.documents('api::category.category').create({ data: { name: 'Car Insurance', slug: 'car-insurance' }, status: 'published' });
    console.log('✅ Categories created');

    // 2. Articles
    await strapi.documents('api::article.article').create({
      data: {
        title: 'How to choose the best health insurance',
        slug: 'best-health-insurance-guide',
        excerpt: 'A comprehensive guide to picking the right plan for your family.',
        authorName: 'Kiwi Expert',
        readTime: 5,
        categories: [catHealth.id],
        blocks: [{ __component: 'shared.rich-text', content: 'Detailed health insurance advice...' }]
      },
      status: 'published'
    });
    console.log('✅ Articles created');

    // 3. Insurance Products
    await strapi.documents('api::insurance-product.insurance-product').create({
      data: {
        productName: 'Kiwi Care Health',
        tagline: 'Comprehensive coverage for your family',
        startingPrice: 500,
        ctaText: 'Get Quote',
        ctaUrl: '/health/quote',
        isActive: true,
        sortOrder: 1,
        isFeatured: true
      },
      status: 'published'
    });
    console.log('✅ Insurance Products created');

    // 4. Tools
    const toolCat = await strapi.documents('api::tool-category.tool-category').create({ data: { name: 'Calculators', slug: 'calculators' } });
    await strapi.documents('api::tool.tool').create({
      data: {
        name: 'Premium Calculator',
        slug: 'premium-calc',
        tool_category: toolCat.id,
        isActive: true
      },
      status: 'published'
    });
    console.log('✅ Tools created');

    // 5. Grievance Levels
    await strapi.documents('api::grievance-level.grievance-level').create({
        data: {
            levelNumber: 1,
            levelName: 'Customer Support',
            email: 'support@kiwi.com',
            phone: '1800-KIWI-1'
        }
    });
    console.log('✅ Grievance Levels created');

    // 6. Unified Pages
    await strapi.documents('api::page.page').create({
      data: {
        title: 'Home',
        slug: 'home',
        template: 'home',
        hero: { title: 'Insurance made simple', subtitle: 'Fast, fair, and friendly' },
        blocks: []
      },
      status: 'published'
    });

    await strapi.documents('api::page.page').create({
      data: {
        title: 'About Us',
        slug: 'about-us',
        template: 'about',
        hero: { title: 'Driven by technology' },
        blocks: []
      },
      status: 'published'
    });

    await strapi.documents('api::page.page').create({
      data: {
        title: 'Privacy Policy',
        slug: 'privacy-policy',
        template: 'legal',
        hero: { title: 'Privacy Policy' },
        metadata: { isMandatory: true },
        blocks: []
      },
      status: 'published'
    });

    await strapi.documents('api::page.page').create({
      data: {
        title: 'Grievance Redressal',
        slug: 'grievance',
        template: 'grievance',
        hero: { title: 'Grievance Redressal' },
        metadata: { bimaBharosaLink: 'https://bimabharosa.irdai.gov.in/' },
        blocks: []
      },
      status: 'published'
    });

    console.log('✅ Unified Pages created');

    // 7. Global Config
    await strapi.documents('api::global-config.global-config').create({
      data: {
        siteName: 'Kiwi Insurance',
        siteDescription: 'Fastest insurance in the world',
        irdaiRegNumber: '123456',
        registeredAddress: '123 Kiwi Lane, Tech City'
      }
    });
    console.log('✅ Global Config created');

    console.log('🚀 SEEDING COMPLETE');
    process.exit(0);
  } catch (err) {
    console.error('❌ SEEDING FAILED:', err);
    if (err.details) console.log('Errors:', JSON.stringify(err.details, null, 2));
    process.exit(1);
  }
}

seed();
