
const strapi = require('@strapi/strapi');

async function run() {
  const app = await strapi.createStrapi({ distDir: './dist' }).load();
  const seed = require('./seed-production.js');
  
  try {
    await seed(app);
    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    process.exit(0);
  }
}

run();
