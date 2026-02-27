'use strict';

/**
 * Kiwi General Insurance - ARCHITECT AUDIT SYNC SEED (Strapi 5)
 * Standardizing bios, adding social links, and geolocation.
 */

// ─── Helpers ─────────────────────────────────────────────────────────────────

function blocks(text) {
  return [{ type: 'paragraph', children: [{ type: 'text', text }] }];
}

function blocksMulti(...lines) {
  return lines.map((line) => ({ type: 'paragraph', children: [{ type: 'text', text: line }] }));
}

async function deleteAll(uid) {
  try { await strapi.db.query(uid).deleteMany({ where: {} }); } catch (e) {}
}

async function createEntry(uid, data) {
  try { return await strapi.documents(uid).create({ data, status: 'published' }); } catch (e) {
    console.error(`Error creating ${uid}:`, e.message);
    return null;
  }
}

async function updateSingle(uid, data) {
  try {
    let entry = await strapi.documents(uid).findMany({ status: 'published' });
    if (entry.length > 0) return await strapi.documents(uid).update({ documentId: entry[0].documentId, data });
    return await strapi.documents(uid).create({ data, status: 'published' });
  } catch (e) { console.error(`Error updating single ${uid}:`, e.message); return null; }
}

// ─── Main Logic ───

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';

  console.log('\n🥝 Kiwi General Insurance - ARCHITECT AUDIT SEEDING...\n');

  try {
    const collections = [
      'api::article.article', 'api::author.author', 'api::branch.branch', 'api::category.category',
      'api::download-document.download-document', 'api::financial-disclosure.financial-disclosure',
      'api::grievance-level.grievance-level', 'api::insurance-product.insurance-product',
      'api::job-listing.job-listing', 'api::leadership-profile.leadership-profile', 'api::navigation-menu.navigation-menu',
      'api::ombudsman-office.ombudsman-office', 'api::page.page', 'api::redirect.redirect', 'api::shared-section.shared-section',
      'api::standard-product.standard-product', 'api::testimonial.testimonial', 'api::tool.tool', 'api::tool-category.tool-category'
    ];
    for (const uid of collections) await deleteAll(uid);

    // 1. Authors (Now with Blocks & Social Components)
    console.log('  -> Standardizing Authors');
    const author = await createEntry('api::author.author', { 
      name: 'Vikram Seth', 
      bio: blocks('Expert in Motor Insurance underwriting.'),
      socialLinks: [{ platform: 'twitter', url: 'https://twitter.com/vseth' }, { platform: 'linkedin', url: 'https://linkedin.com/in/vseth' }]
    });

    // 2. Leadership (Now with Social Components)
    console.log('  -> Standardizing Leadership');
    await createEntry('api::leadership-profile.leadership-profile', {
      name: 'Dr. Ramesh Kumar',
      designation: 'MD & CEO',
      category: 'KMP',
      bio: blocks('25 years of industry leadership.'),
      socialLinks: [{ platform: 'linkedin', url: 'https://linkedin.com/in/rkumar' }],
      displayOrder: 1
    });

    // 3. Branches (Now with Geolocation)
    console.log('  -> Adding Geolocation to Branches');
    await createEntry('api::branch.branch', { 
      branchName: 'Mumbai Head Office', city: 'Mumbai', branchType: 'head-office', 
      latitude: 19.0760, longitude: 72.8777 
    });
    await createEntry('api::branch.branch', { 
      branchName: 'Delhi Regional Office', city: 'New Delhi', branchType: 'regional-office', 
      latitude: 28.6139, longitude: 77.2090 
    });

    // 4. Products
    console.log('  -> Products Registry');
    const carProd = await createEntry('api::insurance-product.insurance-product', {
      productName: 'Car Insurance', tagline: 'Best in Class Protection', startingPrice: 2094, isActive: true, sortOrder: 1, ctaText: 'Get Quote', ctaUrl: '/car'
    });

    // 5. Pages
    console.log('  -> Dynamic Pages');
    await createEntry('api::page.page', {
      title: 'Home', slug: 'home', template: 'home',
      content: [
        { __component: 'page-builder.hero-section', title: 'Smart Insurance', subtitle: 'Simple. Digital. Fast.' },
        { __component: 'page-builder.insurance-product-cta', product: { connect: [{ documentId: carProd.documentId }] }, variant: 'card' }
      ]
    });

    // 6. Navigation (4 Levels)
    console.log('  -> 4-Level Navigation');
    const h1 = await createEntry('api::navigation-menu.navigation-menu', { label: 'Products', location: 'header' });
    const h2 = await createEntry('api::navigation-menu.navigation-menu', { label: 'Motor', parent: { connect: [{ documentId: h1.documentId }] } });
    const h3 = await createEntry('api::navigation-menu.navigation-menu', { label: 'Car', parent: { connect: [{ documentId: h2.documentId }] } });
    await createEntry('api::navigation-menu.navigation-menu', { label: 'Comprehensive', parent: { connect: [{ documentId: h3.documentId }] } });

    // 7. Permissions
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
    for (const uid of collections) {
      const parts = uid.split('::')[1].split('.');
      const apiName = parts[0];
      for (const action of ['find', 'findOne']) {
        await strapi.query('plugin::users-permissions.permission').create({
          data: { action: `api::${apiName}.${apiName}.${action}`, role: publicRole.id }
        });
      }
    }

    console.log('\n✅ ARCHITECT AUDIT SEED COMPLETE!\n');
  } catch (err) { console.error('\n❌ Seed failed:', err); }

  await app.destroy();
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
