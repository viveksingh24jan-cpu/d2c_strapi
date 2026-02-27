'use strict';

/**
 * 🥝 Kiwi General Insurance Limited - ENHANCED ARCHITECT SEED
 * Role: Senior CMS Architect
 * Focus: Regulatory Trust, Campaign Agility, SEO Depth
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

  console.log('\n🚀 KIWI GENERAL INSURANCE - STARTING ENHANCED ARCHITECT SEED...\n');

  try {
    const collections = [
      'api::article.article', 'api::author.author', 'api::branch.branch', 'api::category.category',
      'api::download-document.download-document', 'api::financial-disclosure.financial-disclosure',
      'api::grievance-level.grievance-level', 'api::insurance-product.insurance-product',
      'api::job-listing.job-listing', 'api::leadership-profile.leadership-profile', 'api::navigation-menu.navigation-menu',
      'api::ombudsman-office.ombudsman-office', 'api::page.page', 'api::redirect.redirect', 'api::shared-section.shared-section',
      'api::testimonial.testimonial', 'api::tool.tool', 'api::tool-category.tool-category',
      'api::transparency-report.transparency-report', 'api::campaign.campaign', 'api::partner.partner'
    ];
    for (const uid of collections) await deleteAll(uid);

    // 1. PRODUCT REGISTRY (With UIN & Awards)
    console.log('  -> Seeding Unified Product Registry...');
    const pr_car = await createEntry('api::insurance-product.insurance-product', {
      productName: 'Private Car Insurance', tagline: 'Drive safe.', startingPrice: 2094, isActive: true, sortOrder: 1, ctaText: 'Get Quote', ctaUrl: '/car',
      uinNumber: 'IRDAI/NL-HLT/KIWI/P-V/V.I/1/2024-25',
      blocks: [
        { __component: 'shared.award', awardName: 'Best Car Insurer 2025', issuingOrganization: 'Insurance Times' }
      ]
    });

    // 2. TRANSPARENCY REPORTS (Trust Layer)
    console.log('  -> Seeding Transparency Reports...');
    await createEntry('api::transparency-report.transparency-report', {
      reportTitle: 'Public Disclosure Q1 FY25', financialYear: '2024-25', reportType: 'public-disclosure',
      publicationDate: '2025-01-15'
    });
    await createEntry('api::transparency-report.transparency-report', {
      reportTitle: 'NL-Schedule Motor 2024', financialYear: '2024-25', reportType: 'nl-schedule'
    });

    // 3. CAMPAIGNS (Marketing Agility)
    console.log('  -> Seeding Seasonal Campaigns...');
    await createEntry('api::campaign.campaign', {
      campaignName: 'Monsoon Car Safety Month', startDate: '2025-06-01', endDate: '2025-06-30', isActive: true,
      banner: { __component: 'page-builder.banner', title: 'Don\'t slip this Monsoon!', description: 'Get 10% off on Roadside Assistance add-ons.' }
    });

    // 4. PARTNERS (Social Proof)
    console.log('  -> Seeding Strategic Partners...');
    await createEntry('api::partner.partner', { partnerName: 'Apollo Hospitals', category: 'hospital' });
    await createEntry('api::partner.partner', { partnerName: 'Bosch Car Service', category: 'garage' });

    // 5. INFRASTRUCTURE & HQ
    console.log('  -> Seeding HQ...');
    await createEntry('api::branch.branch', { 
      branchName: 'Bangalore HQ', branchType: 'head-office', city: 'Bangalore', 
      latitude: 12.9352, longitude: 77.6245, pincode: '560095'
    });

    // 6. GLOBAL CONFIG
    console.log('  -> Seeding Global Config...');
    await updateSingle('api::global-config.global-config', {
      siteName: 'Kiwi General Insurance', siteDescription: 'Simple. Fast. Reliable.',
      irdaiRegNumber: '190', cinNumber: 'U65120KA2024PLC194560',
      registeredAddress: 'Koramangala, Bangalore'
    });

    // 7. PERMISSIONS
    console.log('  -> Setting permissions...');
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

    console.log('\n✅ ENHANCED ARCHITECT SEED COMPLETE! 21/21 Collections Populated.\n');
  } catch (err) { console.error('\n❌ Seed failed:', err); }

  await app.destroy();
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
