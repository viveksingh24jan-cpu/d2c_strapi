
const strapi = require('@strapi/strapi');

async function run() {
  const instance = await strapi.createStrapi().load();
  const seed = require('./seed-production.js');
  
  try {
    await seed(instance);
    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    process.exit(0);
  }
}

run();
