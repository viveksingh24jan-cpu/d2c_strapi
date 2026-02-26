async function test() {
  try {
    await strapi.documents('api::page.page').create({
      data: {
        title: 'Test',
        slug: 'test-' + Date.now(),
        template: 'home',
        hero: {
          title: 'Hello'
        }
      }
    });
    console.log('Success');
  } catch (err) {
    console.log('Error Details:', JSON.stringify(err.details, null, 2));
  }
  process.exit(0);
}
test();
