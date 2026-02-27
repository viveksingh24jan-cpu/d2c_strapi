'use strict';

/**
 * Kiwi General Insurance - UNIFIED TOOLS SEED (Strapi 5)
 * Consolidating Tools and Categories for simple, scalable management.
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

  console.log('\n🚀 KIWI GENERAL INSURANCE - MASTER UNIFIED SEEDING...\n');

  try {
    const collections = [
      'api::article.article', 'api::author.author', 'api::branch.branch', 'api::category.category',
      'api::download-document.download-document', 'api::financial-disclosure.financial-disclosure',
      'api::insurance-product.insurance-product', 'api::leadership-profile.leadership-profile', 'api::navigation-menu.navigation-menu',
      'api::page.page', 'api::redirect.redirect', 'api::shared-section.shared-section',
      'api::testimonial.testimonial', 'api::tool.tool',
      'api::transparency-report.transparency-report', 'api::campaign.campaign', 'api::partner.partner'
    ];
    for (const uid of collections) await deleteAll(uid);

    // 1. UNIFIED TOOLS (The "Everything in One" Registry)
    console.log('  -> Seeding Unified Tools');
    await createEntry('api::tool.tool', {
      name: 'Premium Calculator',
      slug: 'premium-calculator',
      category: 'calculator',
      type: 'motor',
      shortDescription: 'Calculate your car insurance premium in 60 seconds.',
      isActive: true,
      area: 'public-site',
      cta: { label: 'Calculate Now', url: '/tools/premium-calc', variant: 'primary' },
      badge: 'Popular'
    });

    await createEntry('api::tool.tool', {
      name: 'Challan Checker',
      slug: 'challan-checker',
      category: 'checker',
      type: 'motor',
      shortDescription: 'Check pending traffic challans for your vehicle.',
      isActive: true,
      area: 'customer-portal',
      cta: { label: 'Check Status', url: '/tools/challan', variant: 'secondary' },
      badge: 'Free'
    });

    // 2. TESTIMONIAL REGISTRY (SSOT)
    console.log('  -> Seeding Testimonial Registry');
    await createEntry('api::testimonial.testimonial', {
      customerName: 'Amit Shah', customerTitle: 'Car Policyholder',
      quote: blocks('The claims experience was fantastic. 20-minute settlement is real!'),
      rating: 5, category: 'motor'
    });

    // 3. PRODUCTS
    const carProd = await createEntry('api::insurance-product.insurance-product', {
      productName: 'Car Insurance', tagline: 'Comprehensive Cover', startingPrice: 2094, isActive: true, sortOrder: 1, ctaText: 'Get Quote', ctaUrl: '/car'
    });

    // 4. PAGES
    console.log('  -> Seeding Home Page');
    await createEntry('api::page.page', {
      title: 'Home', slug: 'home', template: 'home',
      content: [
        { __component: 'page-builder.hero-section', title: 'Insurance for Digital India', subtitle: 'Simple. Honest. Fast.' },
        { 
          __component: 'page-builder.testimonial-showcase', 
          title: 'Trusted by Thousands',
          mode: 'automated-by-category',
          category: 'all',
          layout: 'grid'
        },
        {
          __component: 'page-builder.comparison-table',
          title: 'Plan Comparison',
          columns: ['Feature', 'Standard', 'Comprehensive'],
          rows: [['Accident', 'Yes', 'Yes'], ['Theft', 'No', 'Yes']],
          highlightColumn: 2
        }
      ]
    });

    // 5. NAVIGATION & GLOBAL
    await updateSingle('api::global-config.global-config', { siteName: 'Kiwi Insurance' });
    const n1 = await createEntry('api::navigation-menu.navigation-menu', { label: 'Products', location: 'header' });
    
    async function createNav(label, parentId) {
      return await createEntry('api::navigation-menu.navigation-menu', { label, parent: { connect: [{ documentId: parentId }] } });
    }
    await createNav('Motor', n1.documentId);

    // 6. PERMISSIONS
    console.log('  -> Setting permissions');
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
    for (const uid of collections) {
      const apiName = uid.split('::')[1].split('.')[0];
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
