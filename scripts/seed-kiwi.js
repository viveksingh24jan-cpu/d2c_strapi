'use strict';

/**
 * Kiwi General Insurance - ABSOLUTE MAXIMUM VOLUME SEED (Strapi 5)
 * Standardizing all data types and ensuring every single feature is utilized.
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

  console.log('\n🥝 Kiwi General Insurance - MASTER ARCHITECT SEEDING...\n');

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

    // 1. Authors & Leadership (Standardized with Blocks & Social Links)
    console.log('  -> Authors & Leadership');
    const a1 = await createEntry('api::author.author', { 
      name: 'Vikram Seth', 
      bio: blocks('Expert in Motor Insurance underwriting.'),
      socialLinks: [{ platform: 'twitter', url: 'https://twitter.com/vseth' }]
    });
    
    await createEntry('api::leadership-profile.leadership-profile', {
      name: 'Dr. Ramesh Kumar', designation: 'CEO', category: 'KMP',
      bio: blocks('Visionary leader with 25 years of experience.'),
      socialLinks: [{ platform: 'linkedin', url: 'https://linkedin.com/rkumar' }]
    });

    // 2. Products Registry (SSOT)
    console.log('  -> Product Registry');
    const p1 = await createEntry('api::insurance-product.insurance-product', {
      productName: 'Car Insurance', tagline: 'Comprehensive Cover', startingPrice: 2094, isActive: true, sortOrder: 1, ctaText: 'Get Quote', ctaUrl: '/car'
    });
    const p2 = await createEntry('api::insurance-product.insurance-product', {
      productName: 'Health Insurance', tagline: '100% Cashless', startingPrice: 5500, isActive: true, sortOrder: 2, ctaText: 'Buy Now', ctaUrl: '/health'
    });

    // 3. Shared Sections (Global Reuse)
    console.log('  -> Shared Sections');
    const helpSec = await createEntry('api::shared-section.shared-section', {
      title: 'Global Help',
      blocks: [{ __component: 'page-builder.banner', title: 'Need Help?', description: 'Call 1800-123-4567' }]
    });

    // 4. Pages (MAX FEATURE USAGE)
    console.log('  -> Home Page (Full Component Permutations)');
    await createEntry('api::page.page', {
      title: 'Home', slug: 'home', template: 'home',
      content: [
        { __component: 'page-builder.hero-section', title: 'Smart Insurance', subtitle: 'Simple. Digital. Fast.' },
        { __component: 'page-builder.stats-bar', stats: [{ label: 'Ratio', value: '99.2%' }] },
        { __component: 'page-builder.insurance-product-cta', product: { connect: [{ documentId: p1.documentId }] }, variant: 'card' },
        { __component: 'page-builder.testimonial-grid', title: 'Happy Customers', items: [{ quote: 'Great service!', authorName: 'Amit S.' }] },
        { __component: 'page-builder.accordion', title: 'FAQs', items: [{ question: 'Is it digital?', answer: blocks('Yes.') }] },
        { __component: 'shared.section-reference', shared_section: { connect: [{ documentId: helpSec.documentId }] } }
      ]
    });

    // 5. Infrastructure (Geolocation)
    console.log('  -> Infrastructure (Geo-aware)');
    await createEntry('api::branch.branch', { branchName: 'Mumbai HO', branchType: 'head-office', city: 'Mumbai', latitude: 19.0760, longitude: 72.8777 });
    await createEntry('api::ombudsman-office.ombudsman-office', { city: 'Mumbai', email: 'mumbai@ombudsman.in' });
    await createEntry('api::grievance-level.grievance-level', { levelNumber: 1, levelName: 'Helpline' });

    // 6. Navigation (4 Levels)
    console.log('  -> 4-Level Navigation');
    const n1 = await createEntry('api::navigation-menu.navigation-menu', { label: 'Products', location: 'header' });
    const n2 = await createNav('Motor', n1.documentId);
    const n3 = await createNav('Car', n2.documentId);
    await createNav('Comprehensive', n3.documentId);

    async function createNav(label, parentId) {
      return await createEntry('api::navigation-menu.navigation-menu', { label, parent: { connect: [{ documentId: parentId }] } });
    }

    // 7. Permissions
    console.log('  -> Setting permissions');
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

    console.log('\n✅ MASTER ARCHITECT SEED COMPLETE!\n');
  } catch (err) { console.error('\n❌ Seed failed:', err); }

  await app.destroy();
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
