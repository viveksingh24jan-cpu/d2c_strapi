
const strapi = require('@strapi/strapi');

async function main() {
  const app = await strapi.createStrapi({ distDir: './dist' }).load();
  const seed = require('./seed-p0.js');
  await seed(app);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
