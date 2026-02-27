'use strict';

/**
 * Kiwi General Insurance - UNIFIED PRODUCT REGISTRY SEED (Strapi 5)
 * Consolidated InsuranceProduct + StandardProduct into one collection.
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

  console.log('\n🥝 Kiwi General Insurance - UNIFIED MASTER SEEDING...\n');

  try {
    const collections = [
      'api::article.article', 'api::author.author', 'api::branch.branch', 'api::category.category',
      'api::download-document.download-document', 'api::financial-disclosure.financial-disclosure',
      'api::grievance-level.grievance-level', 'api::insurance-product.insurance-product',
      'api::job-listing.job-listing', 'api::leadership-profile.leadership-profile', 'api::navigation-menu.navigation-menu',
      'api::ombudsman-office.ombudsman-office', 'api::page.page', 'api::redirect.redirect', 'api::shared-section.shared-section',
      'api::testimonial.testimonial', 'api::tool.tool', 'api::tool-category.tool-category'
    ];
    for (const uid of collections) await deleteAll(uid);

    // 1. Meta
    const author = await createEntry('api::author.author', { name: 'Vikram Seth', bio: blocks('Expert.') });

    // 2. UNIFIED PRODUCT REGISTRY
    console.log('  -> Seeding Unified Insurance Products');
    const p1 = await createEntry('api::insurance-product.insurance-product', {
      productName: 'Car Insurance', tagline: 'Comprehensive Cover', startingPrice: 2094, isActive: true, sortOrder: 1, ctaText: 'Get Quote', ctaUrl: '/car',
      isStandard: false
    });
    
    // Mandated Standard Product
    const p2 = await createEntry('api::insurance-product.insurance-product', {
      productName: 'Arogya Sanjeevani', tagline: 'IRDAI Standard Health Plan', startingPrice: 3500, isActive: true, sortOrder: 2, ctaText: 'Buy Standard Plan', ctaUrl: '/health/arogya',
      isStandard: true,
      productType: 'arogya-sanjeevani',
      complianceFeatures: blocks('Standard hospitalisation cover as per IRDAI.')
    });

    const p3 = await createEntry('api::insurance-product.insurance-product', {
      productName: 'Bharat Griha Raksha', tagline: 'Standard Home Insurance', startingPrice: 499, isActive: true, sortOrder: 3, ctaText: 'Secure Home', ctaUrl: '/home/standard',
      isStandard: true,
      productType: 'bharat-griha-raksha'
    });

    // 3. Pages (Identifying Standard Products)
    console.log('  -> Seeding Home Page with Product Identification');
    await createEntry('api::page.page', {
      title: 'Home', slug: 'home', template: 'home',
      content: [
        { __component: 'page-builder.hero-section', title: 'Insurance Made Simple', subtitle: 'Digital First.' },
        { 
          __component: 'page-builder.insurance-product-cta', 
          product: { connect: [{ documentId: p1.documentId }] }, 
          variant: 'card' 
        },
        { 
          __component: 'page-builder.insurance-product-cta', 
          product: { connect: [{ documentId: p2.documentId }] }, 
          variant: 'card',
          customTitle: 'Standard: Arogya Sanjeevani',
          customSubtitle: 'Government Mandated Standard Health Plan'
        },
        { 
          __component: 'page-builder.insurance-product-cta', 
          product: { connect: [{ documentId: p3.documentId }] }, 
          variant: 'minimal',
          isFeatured: true
        }
      ]
    });

    // 4. Infrastructure & Navigation
    await createEntry('api::branch.branch', { branchName: 'Mumbai HO', branchType: 'head-office', city: 'Mumbai', latitude: 19.0760, longitude: 72.8777 });
    const n1 = await createEntry('api::navigation-menu.navigation-menu', { label: 'Products', location: 'header' });
    await createEntry('api::navigation-menu.navigation-menu', { label: 'Car Insurance', parent: { connect: [{ documentId: n1.documentId }] } });

    // 5. Permissions
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

    console.log('\n✅ UNIFIED MASTER SEED COMPLETE!\n');
  } catch (err) { console.error('\n❌ Seed failed:', err); }

  await app.destroy();
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
