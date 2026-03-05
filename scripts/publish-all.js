
const strapi = require('@strapi/strapi');

async function main() {
  const app = await strapi.createStrapi({ distDir: './dist' }).load();
  
  console.log('🚀 Starting Global Publish Sync...');

  const contentTypes = Object.keys(app.contentTypes).filter(uid => uid.startsWith('api::'));

  for (const uid of contentTypes) {
    const contentType = app.contentTypes[uid];
    if (contentType.options?.draftAndPublish) {
      console.log(`Publishing all entries for: ${uid}`);
      try {
        const entries = await app.documents(uid).findMany({ status: 'draft' });
        for (const entry of entries) {
          await app.documents(uid).publish({ documentId: entry.documentId });
        }
        console.log(`✅ Finished publishing ${entries.length} items in ${uid}`);
      } catch (err) {
        console.error(`❌ Error publishing ${uid}:`, err.message);
      }
    }
  }

  console.log('✨ All content successfully published.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
