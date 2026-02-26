async function test() {
  try {
    const page = await strapi.documents('api::page.page').create({
      data: {
        title: 'Architecture Test Page',
        slug: 'arch-test',
        template: 'home',
        hero: {
          title: 'Testing the New CMS Architecture',
          subtitle: 'It is alive and optimized'
        },
        blocks: [
          {
            __component: 'shared.rich-text',
            content: 'Verification Successful'
          }
        ],
        publishedAt: new Date(),
      }
    });
    console.log('✅ TEST_SUCCESS: Page created with ID:', page.documentId || page.id);
  } catch (err) {
    console.error('❌ TEST_FAILURE:', err);
    process.exit(1);
  }
  process.exit(0);
}

test();
