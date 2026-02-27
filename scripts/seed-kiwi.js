'use strict';

/**
 * Kiwi General Insurance - DAY 0 MASTER SEED (Trimmed & Scalable)
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

// ─── Main Seeding ───

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';

  console.log('\n🚀 KIWI GENERAL INSURANCE - DAY 0 MASTER SEEDING...\n');

  try {
    const collections = [
      'api::article.article', 'api::author.author', 'api::branch.branch', 'api::category.category',
      'api::download-document.download-document', 'api::financial-disclosure.financial-disclosure',
      'api::insurance-product.insurance-product', 'api::leadership-profile.leadership-profile', 'api::navigation-menu.navigation-menu',
      'api::page.page', 'api::redirect.redirect', 'api::shared-section.shared-section',
      'api::testimonial.testimonial', 'api::tool.tool', 'api::tool-category.tool-category',
      'api::transparency-report.transparency-report', 'api::campaign.campaign', 'api::partner.partner'
    ];
    for (const uid of collections) await deleteAll(uid);

    // 1. Authors
    const a1 = await createEntry('api::author.author', { name: 'Vivek Singh', slug: 'vivek-singh', bio: blocks('CMS Architect.') });

    // 2. UNIFIED LOCATIONS (Head Office, Regional, Ombudsman)
    console.log('  -> Seeding Unified Locations (Day 0)');
    await createEntry('api::branch.branch', { branchName: 'Corporate HQ', branchType: 'head-office', city: 'Bangalore' });
    await createEntry('api::branch.branch', { branchName: 'Insurance Ombudsman', branchType: 'ombudsman-office', city: 'Mumbai', email: 'mumbai@ombudsman.in' });

    // 3. PRODUCTS (Unified Registry)
    console.log('  -> Seeding Unified Products');
    const p1 = await createEntry('api::insurance-product.insurance-product', {
      productName: 'Car Insurance', tagline: 'Comprehensive Cover', startingPrice: 2094, isActive: true, sortOrder: 1, ctaText: 'Get Quote', ctaUrl: '/car', tagline: 'Drive Safe'
    });

    // 4. PAGES (Generic Components)
    console.log('  -> Seeding Pages (Day 0 Structural Blocks)');
    await createEntry('api::page.page', {
      title: 'Home', slug: 'home', template: 'home',
      content: [
        { __component: 'page-builder.hero-section', title: 'Insure India', subtitle: 'Simple. Digital.' },
        { 
          __component: 'page-builder.banner', 
          bannerType: 'app-promotion', 
          title: 'Get the Kiwi App', 
          content: blocks('Scan to download and get 10% off.'),
          backgroundColor: '#F3F4F6'
        },
        { 
          __component: 'page-builder.accordion', 
          title: 'Grievance Redressal Escalation',
          items: [
            { question: 'Level 1: Customer Care', answer: blocks('Call 1800-XXX.') },
            { question: 'Level 2: Grievance Officer', answer: blocks('Email gro@kiwi.in') }
          ]
        },
        {
          __component: 'page-builder.media-block',
          type: 'video-external',
          title: 'How Kiwi Works',
          externalUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          caption: 'Watch our 2-minute explainer video.'
        }
      ]
    });

    // 5. GLOBAL
    await updateSingle('api::global-config.global-config', { siteName: 'Kiwi Insurance', cinNumber: 'U65120KA2024PLC194560' });

    async function createNav(label, parentId) {
      return await createEntry('api::navigation-menu.navigation-menu', { label, parent: { connect: [{ documentId: parentId }] } });
    }

    const n1 = await createEntry('api::navigation-menu.navigation-menu', { label: 'Products', location: 'header' });
    const n2 = await createNav('Motor', n1.documentId);
    const n3 = await createNav('Car', n2.documentId);
    await createNav('Comprehensive', n3.documentId);

    // 6. PERMISSIONS
    console.log('  -> Setting Permissions');
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

    console.log('\n✅ DAY 0 TRIM COMPLETE!\n');
  } catch (err) { console.error('\n❌ Seed failed:', err); }

  await app.destroy();
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
