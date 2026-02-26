'use strict';

/**
 * Kiwi General Insurance - FINAL ARCHITECTURAL SEED (Strapi 5)
 * Max optimization, reusability, and scalability.
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

// ─── Seed Logic ───

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';

  console.log('\n🥝 Kiwi General Insurance - FINAL PRODUCTION SEEDING...\n');

  try {
    // 1. CLEAR ALL
    const collections = [
      'api::article.article', 'api::author.author', 'api::branch.branch', 'api::category.category',
      'api::download-document.download-document', 'api::financial-disclosure.financial-disclosure',
      'api::grievance-level.grievance-level', 'api::insurance-product.insurance-product',
      'api::job-listing.job-listing', 'api::leadership-profile.leadership-profile', 'api::navigation-menu.navigation-menu',
      'api::ombudsman-office.ombudsman-office', 'api::page.page', 'api::redirect.redirect', 'api::shared-section.shared-section',
      'api::standard-product.standard-product', 'api::testimonial.testimonial', 'api::tool.tool', 'api::tool-category.tool-category'
    ];
    for (const uid of collections) await deleteAll(uid);

    // 2. SHARED SECTIONS (Reuse Pattern)
    console.log('  Seeding Shared Sections...');
    const helpSection = await createEntry('api::shared-section.shared-section', {
      title: 'Need Help? Contact Us',
      blocks: [
        { 
          __component: 'page-builder.banner', 
          title: 'We are here to help 24/7',
          description: 'Call us at 1800-123-4567 or email care@kiwiinsurance.in',
          cta: { label: 'Contact Support', url: '/contact', variant: 'outline' }
        }
      ]
    });

    // 3. PRODUCTS (Source of Truth)
    console.log('  Seeding Products Registry...');
    const carProd = await createEntry('api::insurance-product.insurance-product', {
      productName: 'Comprehensive Car Insurance',
      tagline: 'Zero-depreciation cover for your car',
      startingPrice: 2094, isActive: true, sortOrder: 1, ctaText: 'Get Quote', ctaUrl: '/car-insurance'
    });
    const healthProd = await createEntry('api::insurance-product.insurance-product', {
      productName: 'Health Assurance Plus',
      tagline: 'Cashless treatment at 10,000+ hospitals',
      startingPrice: 5000, isActive: true, sortOrder: 2, ctaText: 'Check Premium', ctaUrl: '/health-insurance'
    });

    // 4. PAGES (Atomic Design)
    console.log('  Seeding Dynamic Pages...');
    const home = await createEntry('api::page.page', {
      title: 'Home', slug: 'home', template: 'home',
      content: [
        { __component: 'page-builder.hero-section', title: 'Insurance Simple. Fast. Reliable.', subtitle: 'India\'s digital-first insurer.' },
        { __component: 'page-builder.stats-bar', stats: [{ label: 'Claim Ratio', value: '99.2%' }, { label: 'Settled', value: '50L+' }] },
        { 
          __component: 'page-builder.insurance-product-cta', 
          product: { connect: [{ documentId: carProd.documentId }] },
          variant: 'card'
        },
        { 
          __component: 'shared.section-reference', 
          shared_section: { connect: [{ documentId: helpSection.documentId }] }
        }
      ]
    });

    // 5. NAVIGATION (Hierarchical)
    console.log('  Seeding Navigation Hierarchy...');
    const header = await createEntry('api::navigation-menu.navigation-menu', { label: 'Products', location: 'header', displayOrder: 1 });
    await createEntry('api::navigation-menu.navigation-menu', { 
      label: 'Car Insurance', url: '/car-insurance', parent: { connect: [{ documentId: header.documentId }] } 
    });

    // 6. INFRASTRUCTURE & DISCLOSURES
    console.log('  Seeding Infrastructure...');
    await createEntry('api::branch.branch', { branchName: 'Mumbai HO', branchType: 'head-office', city: 'Mumbai' });
    await createEntry('api::ombudsman-office.ombudsman-office', { city: 'Mumbai', email: 'mumbai@ombudsman.in' });
    await createEntry('api::financial-disclosure.financial-disclosure', {
      title: 'Annual Report 2024', disclosureType: 'annual-report', financialYear: '2023-24'
    });

    // 7. MISC (Tools, Jobs, Articles)
    console.log('  Seeding Misc Collections...');
    const techCat = await createEntry('api::category.category', { name: 'Tech', slug: 'tech' });
    const author = await createEntry('api::author.author', { name: 'Vivek Singh' });
    await createEntry('api::article.article', {
      title: 'The Future of Digital Insurance', slug: 'future-digital-insurance',
      author: { connect: [{ documentId: author.documentId }] },
      categories: { connect: [{ documentId: techCat.documentId }] }
    });

    // 8. GLOBAL CONFIG
    console.log('  Seeding Global Config...');
    await updateSingle('api::global-config.global-config', {
      siteName: 'Kiwi Insurance',
      siteDescription: 'Simple. Fast. Reliable.',
      irdaiRegNumber: '190',
      registeredAddress: 'BKC, Mumbai',
      footerCopyright: '© 2026 Kiwi General Insurance.'
    });

    // 9. SET PERMISSIONS
    console.log('  Setting public permissions...');
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
    for (const uid of collections) {
      const [apiName, contentType] = uid.split('::')[1].split('.');
      for (const action of ['find', 'findOne']) {
        await strapi.query('plugin::users-permissions.permission').create({
          data: { action: `api::${apiName}.${apiName}.${action}`, role: publicRole.id }
        });
      }
    }

    console.log('\n✅ Production Seed complete!\n');
  } catch (err) { console.error('\n❌ Seed failed:', err); }

  await app.destroy();
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
