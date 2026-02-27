'use strict';

/**
 * 🥝 KIWI GENERAL INSURANCE - MASTER ARCHITECT SEED (Production Grade)
 * 100% Coverage | High Density | Realistic Industry Data
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

  console.log('\n🚀 KIWI MASTER SEED - FINAL DATA SATURATION STARTING...\n');

  try {
    const collections = [
      'api::article.article', 'api::author.author', 'api::branch.branch', 'api::category.category',
      'api::download-document.download-document', 'api::financial-disclosure.financial-disclosure',
      'api::insurance-product.insurance-product', 'api::leadership-profile.leadership-profile', 'api::navigation-menu.navigation-menu',
      'api::page.page', 'api::shared-section.shared-section',
      'api::testimonial.testimonial', 'api::tool.tool',
      'api::transparency-report.transparency-report', 'api::campaign.campaign'
    ];
    for (const uid of collections) await deleteAll(uid);

    // 1. CONTENT METADATA
    console.log('  -> Authors & Categories');
    const vseth = await createEntry('api::author.author', { name: 'Vikram Seth', slug: 'vikram-seth', bio: blocks('CMS Architect & Insurance Expert.') });
    const psharma = await createEntry('api::author.author', { name: 'Priya Sharma', slug: 'priya-sharma', bio: blocks('Claims Resolution Specialist.') });
    
    const catMotor = await createEntry('api::category.category', { name: 'Motor Guides', slug: 'motor-guides' });
    const catHealth = await createEntry('api::category.category', { name: 'Health Wellness', slug: 'health-wellness' });

    // 2. UNIFIED PRODUCT REGISTRY (SSOT)
    console.log('  -> Unified Product Registry');
    const p_car = await createEntry('api::insurance-product.insurance-product', {
      productName: 'Car Insurance', tagline: 'Comprehensive Protection', startingPrice: 2094, isActive: true, sortOrder: 1, ctaText: 'Get Quote', ctaUrl: '/car',
      productType: 'generic', isStandard: false
    });
    const p_health = await createEntry('api::insurance-product.insurance-product', {
      productName: 'Health Assurance', tagline: 'Cashless Everywhere', startingPrice: 5500, isActive: true, sortOrder: 2, ctaText: 'Buy Now', ctaUrl: '/health',
      productType: 'generic', isStandard: false
    });
    const p_arogya = await createEntry('api::insurance-product.insurance-product', {
      productName: 'Arogya Sanjeevani', tagline: 'Standard Health Policy', startingPrice: 3000, isActive: true, sortOrder: 3, ctaText: 'View Standard Plan', ctaUrl: '/arogya',
      productType: 'arogya-sanjeevani', isStandard: true
    });

    // 3. REUSABLE SHARED SECTIONS
    console.log('  -> Global Shared Sections');
    const claimsHelp = await createEntry('api::shared-section.shared-section', {
      title: 'Global Claims Support',
      blocks: [
        { __component: 'page-builder.banner', title: 'File a Claim 24/7', content: blocks('Call 1800-XXX-XXXX for instant assistance.'), bannerType: 'info' }
      ]
    });

    // 4. TESTIMONIAL REGISTRY
    console.log('  -> Testimonial Registry');
    await createEntry('api::testimonial.testimonial', { customerName: 'Amit S.', customerTitle: 'Car Owner', quote: blocks('Claims settled in 20 mins!'), rating: 5, category: 'motor' });
    await createEntry('api::testimonial.testimonial', { customerName: 'Rajesh K.', customerTitle: 'Health Insured', quote: blocks('Seamless cashless experience.'), rating: 5, category: 'health' });

    // 5. UNIFIED TOOLS
    console.log('  -> Tools & Calculators');
    await createEntry('api::tool.tool', { name: 'Premium Calc', slug: 'premium-calc', category: 'calculator', type: 'motor', isActive: true, cta: { label: 'Calculate', url: '/tools/calc' } });
    await createEntry('api::tool.tool', { name: 'Challan Check', slug: 'challan', category: 'checker', type: 'motor', isActive: true, cta: { label: 'Check Now', url: '/tools/challan' } });

    // 6. DYNAMIC PAGES (The UI Blueprints)
    console.log('  -> Constructing Complex Pages');
    await createEntry('api::page.page', {
      title: 'Home', slug: 'home', template: 'home',
      content: [
        { __component: 'page-builder.hero-section', title: 'Smart Insurance for Smart India', subtitle: 'Simple. Digital. Honest.' },
        { __component: 'page-builder.stats-bar', stats: [{ label: 'Users', value: '50L+' }, { label: 'Ratio', value: '99.2%' }] },
        { __component: 'page-builder.insurance-product-cta', product: { connect: [{ documentId: p_car.documentId }] }, variant: 'card' },
        { __component: 'page-builder.testimonial-showcase', title: 'Customer Love', mode: 'automated-by-category', category: 'all' },
        { __component: 'page-builder.comparison-table', title: 'Plan Comparison', columns: ['Feature', 'Lite', 'Plus'], rows: [['Accident', 'Yes', 'Yes'], ['Theft', 'No', 'Yes']] },
        { 
          __component: 'page-builder.accordion', 
          title: 'Claims Process',
          items: [
            { title: 'Step 1: Intimation', content: blocks('Call us.'), icon: 'phone', badge: 'Start' },
            { title: 'Step 2: Inspection', content: blocks('Digital photo.'), icon: 'camera' }
          ]
        },
        { __component: 'shared.section-reference', shared_section: { connect: [{ documentId: claimsHelp.documentId }] } }
      ]
    });

    // 7. ARTICLES & REDIRECTS
    console.log('  -> Articles & Knowledge Hub');
    await createEntry('api::article.article', { 
      title: 'How to Save 20% on Car Insurance', 
      slug: 'save-car-insurance', 
      author: { connect: [{ documentId: vseth.documentId }] }, 
      categories: { connect: [{ documentId: catMotor.documentId }] },
      blocks: [{ __component: 'page-builder.text-block', content: blocks('1. Install ARAI devices.\n2. Claim NCB.') }]
    });
    await createEntry('api::article.article', { 
      title: 'Understanding Arogya Sanjeevani', 
      slug: 'understanding-arogya', 
      author: { connect: [{ documentId: psharma.documentId }] }, 
      categories: { connect: [{ documentId: catHealth.documentId }] },
      blocks: [{ __component: 'page-builder.text-block', content: blocks('Standardized health cover for all.') }]
    });

    // 8. INFRASTRUCTURE & COMPLIANCE
    console.log('  -> Infrastructure & Regulatory');
    await createEntry('api::branch.branch', { branchName: 'HQ Bangalore', branchType: 'head-office', city: 'Bangalore', latitude: 12.93, longitude: 77.62 });
    await createEntry('api::branch.branch', { branchName: 'Mumbai Regional', branchType: 'regional-office', city: 'Mumbai', latitude: 19.07, longitude: 72.87 });
    await createEntry('api::transparency-report.transparency-report', { reportTitle: 'Public Disclosure Q1', financialYear: '2024-25', reportType: 'public-disclosure' });

    // 8. GLOBAL CONFIG & NAVIGATION
    console.log('  -> Global System Config');
    await updateSingle('api::global-config.global-config', { siteName: 'Kiwi Insurance', cinNumber: 'U65120KA2024PLC194560' });
    
    const n1 = await createEntry('api::navigation-menu.navigation-menu', { label: 'Products', location: 'header' });
    const n2 = await createEntry('api::navigation-menu.navigation-menu', { label: 'Motor', parent: { connect: [{ documentId: n1.documentId }] } });
    await createEntry('api::navigation-menu.navigation-menu', { label: 'Car', parent: { connect: [{ documentId: n2.documentId }] } });

    // 9. PERMISSIONS
    console.log('  -> Finalizing API Access');
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
    for (const uid of collections) {
      const apiName = uid.split('::')[1].split('.')[0];
      for (const action of ['find', 'findOne']) {
        await strapi.query('plugin::users-permissions.permission').create({
          data: { action: `api::${apiName}.${apiName}.${action}`, role: publicRole.id }
        });
      }
    }

    console.log('\n✅ MASTER DATA SATURATION COMPLETE! Website Ready Stage reached.\n');
  } catch (err) { console.error('\n❌ Seed failed:', err); }

  await app.destroy();
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
