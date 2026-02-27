'use strict';

/**
 * Kiwi General Insurance - MAXIMUM VOLUME SEED (Strapi 5)
 * Populates EVERY section with FULL realistic data.
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

  console.log('\n🥝 Kiwi General Insurance - MAXIMUM VOLUME SEEDING...\n');

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

    // 1. Authors & Categories
    console.log('  -> Authors & Categories');
    const a1 = await createEntry('api::author.author', { name: 'Vikram Seth', bio: 'Actuarial Expert', slug: 'vikram-seth' });
    const a2 = await createEntry('api::author.author', { name: 'Priya Sharma', bio: 'Claims Specialist', slug: 'priya-sharma' });
    const c1 = await createEntry('api::category.category', { name: 'Motor Insurance', slug: 'motor-insurance' });
    const c2 = await createEntry('api::category.category', { name: 'Health & Wellness', slug: 'health-insurance' });

    // 2. Shared Sections
    console.log('  -> Shared Sections');
    const globalHelp = await createEntry('api::shared-section.shared-section', {
      title: 'Global Help Support',
      blocks: [{ __component: 'page-builder.banner', title: 'Need help?', description: 'Call 1800-123-4567 for 24/7 support.' }]
    });

    // 3. Insurance Product Registry
    console.log('  -> Product Registry');
    const p1 = await createEntry('api::insurance-product.insurance-product', {
      productName: 'Comprehensive Car Insurance', tagline: 'Drive with peace of mind.', startingPrice: 2094, isActive: true, sortOrder: 1, ctaText: 'Get Quote', ctaUrl: '/car'
    });
    const p2 = await createEntry('api::insurance-product.insurance-product', {
      productName: 'Health Assurance Plus', tagline: 'Best in class health cover.', startingPrice: 5500, isActive: true, sortOrder: 2, ctaText: 'Buy Now', ctaUrl: '/health'
    });
    const p3 = await createEntry('api::insurance-product.insurance-product', {
      productName: 'Two Wheeler Shield', tagline: 'Protect your bike.', startingPrice: 499, isActive: true, sortOrder: 3, ctaText: 'Renew Now', ctaUrl: '/bike'
    });

    // 4. Standard Products
    console.log('  -> Standard Products');
    await createEntry('api::standard-product.standard-product', { productName: 'Arogya Sanjeevani', productType: 'arogya-sanjeevani', isActive: true });
    await createEntry('api::standard-product.standard-product', { productName: 'Saral Suraksha Bima', productType: 'saral-suraksha-bima', isActive: true });
    await createEntry('api::standard-product.standard-product', { productName: 'Bharat Griha Raksha', productType: 'bharat-griha-raksha', isActive: true });

    // 5. Pages & Full Component Usage
    console.log('  -> Dynamic Pages (Max Component Usage)');
    await createEntry('api::page.page', {
      title: 'Home', slug: 'home', template: 'home',
      content: [
        { __component: 'page-builder.hero-section', title: 'Future-Proof your Life', subtitle: 'Simple. Digital. Fast.', layout: 'left-right' },
        { __component: 'page-builder.stats-bar', title: 'India\'s Rising Insurer', stats: [{ label: 'Users', value: '50L+' }, { label: 'Ratio', value: '99.2%' }] },
        { __component: 'page-builder.insurance-product-cta', product: { connect: [{ documentId: p1.documentId }] }, variant: 'card' },
        { __component: 'page-builder.accordion', title: 'FAQs', items: [{ question: 'Cashless hospital?', answer: blocks('Yes, 10k+ hospitals.') }] },
        { __component: 'page-builder.progress-steps', title: '3 Steps to Insure', items: [{ title: 'Quote', stepNumber: 1 }, { title: 'Pay', stepNumber: 2 }, { title: 'Policy', stepNumber: 3 }] },
        { __component: 'page-builder.app-banner', title: 'Download Kiwi App', description: 'Available on iOS and Android.' },
        { __component: 'shared.section-reference', shared_section: { connect: [{ documentId: globalHelp.documentId }] } }
      ]
    });

    // 6. Blog Articles
    console.log('  -> Articles');
    await createEntry('api::article.article', { title: 'How IDV affects your premium', slug: 'idv-guide', author: { connect: [{ documentId: a1.documentId }] }, categories: { connect: [{ documentId: c1.documentId }] } });
    await createEntry('api::article.article', { title: 'Tax savings u/s 80D', slug: '80d-savings', author: { connect: [{ documentId: a2.documentId }] }, categories: { connect: [{ documentId: c2.documentId }] } });

    // 7. Corporate Infrastructure
    console.log('  -> Infrastructure (Branches, Ombudsman, Grievance)');
    await createEntry('api::branch.branch', { branchName: 'Mumbai HO', city: 'Mumbai', branchType: 'head-office', pincode: '400051' });
    await createEntry('api::branch.branch', { branchName: 'Delhi RO', city: 'Delhi', branchType: 'regional-office', pincode: '110001' });
    await createEntry('api::ombudsman-office.ombudsman-office', { city: 'Ahmedabad', email: 'ahmedabad@cio.in' });
    await createEntry('api::ombudsman-office.ombudsman-office', { city: 'Bengaluru', email: 'bengaluru@cio.in' });
    await createEntry('api::grievance-level.grievance-level', { levelNumber: 1, levelName: 'Customer Service' });
    await createEntry('api::grievance-level.grievance-level', { levelNumber: 2, levelName: 'Grievance Officer' });
    await createEntry('api::leadership-profile.leadership-profile', { name: 'Dr. Ramesh Kumar', designation: 'CEO', category: 'KMP', displayOrder: 1 });

    // 8. Finance & Compliance
    console.log('  -> Financials & Compliance');
    await createEntry('api::financial-disclosure.financial-disclosure', { title: 'NL-1 Schedule Q1', disclosureType: 'public-disclosure', financialYear: '2024-25', quarter: 'Q1' });
    await createEntry('api::download-document.download-document', { title: 'Motor Claim Form', documentType: 'claim-form', productCategory: 'motor' });

    // 9. Misc (Tools, Jobs, Redirects, Testimonials)
    console.log('  -> Misc (Tools, Jobs, Redirects, Testimonials)');
    const tcat = await createEntry('api::tool-category.tool-category', { name: 'Vehicle Tools', slug: 'v-tools' });
    await createEntry('api::tool.tool', { name: 'Challan Checker', slug: 'challan', tool_category: { connect: [{ documentId: tcat.documentId }] }, isActive: true });
    await createEntry('api::job-listing.job-listing', { jobTitle: 'UX Designer', department: 'Product', location: 'Bengaluru', isActive: true });
    await createEntry('api::redirect.redirect', { fromPath: '/old-link', toPath: '/home', type: 'permanent' });
    await createEntry('api::testimonial.testimonial', { 
      customerName: 'Amit S.', 
      testimonialContent: blocks('Great experience!'),
      blocks: [
        {
          __component: 'page-builder.testimonial-item',
          quote: 'The claims process was seamless and incredibly fast.',
          authorName: 'Amit S.',
          authorTitle: 'Private Car Policyholder',
          rating: 5
        },
        {
          __component: 'page-builder.testimonial-grid',
          title: 'What Others Say',
          testimonials: [
            { quote: 'Best digital experience!', authorName: 'Priya R.', rating: 5 },
            { quote: 'Affordable and reliable.', authorName: 'Rahul K.', rating: 4 }
          ]
        }
      ]
    });

    // 10. Global Config
    console.log('  -> Global Config');
    await updateSingle('api::global-config.global-config', {
      siteName: 'Kiwi General Insurance', siteDescription: 'India\'s Best Digital Insurer', irdaiRegNumber: '190', registeredAddress: 'BKC, Mumbai'
    });

    // 11. Navigation (4-Level Nesting)
    console.log('  -> Navigation Hierarchies (4 Levels Deep)');
    
    async function createNav(label, url, location, parentId) {
      return await createEntry('api::navigation-menu.navigation-menu', {
        label, url, location, 
        parent: parentId ? { connect: [{ documentId: parentId }] } : null
      });
    }

    // --- HEADER (4 Levels) ---
    const h1 = await createNav('Products', null, 'header'); // Level 1
    const h2 = await createNav('Motor Insurance', null, null, h1.documentId); // Level 2
    const h3 = await createNav('Private Car', '/car', null, h2.documentId); // Level 3
    await createNav('Comprehensive Policy', '/car/comprehensive', null, h3.documentId); // Level 4
    await createNav('Third Party Cover', '/car/tp', null, h3.documentId); // Level 4

    const h2_health = await createNav('Health Insurance', null, null, h1.documentId); // Level 2
    const h3_family = await createNav('Family Plans', '/health/family', null, h2_health.documentId); // Level 3
    await createNav('Floater Plus', '/health/floater', null, h3_family.documentId); // Level 4

    // --- FOOTER (4 Levels) ---
    const f1 = await createNav('Company', null, 'footer_company'); // Level 1
    const f2 = await createNav('About Kiwi', '/about', null, f1.documentId); // Level 2
    const f3 = await createNav('Our Journey', '/about/story', null, f2.documentId); // Level 3
    await createNav('Founding Year 2024', '/about/2024', null, f3.documentId); // Level 4

    const f1_legal = await createNav('Legal', null, 'footer_legal'); // Level 1
    const f2_policy = await createNav('Policies', null, null, f1_legal.documentId); // Level 2
    const f3_data = await createNav('Data Privacy', '/privacy', null, f2_policy.documentId); // Level 3
    await createNav('GDPR Compliance', '/privacy/gdpr', null, f3_data.documentId); // Level 4

    // 12. Permissions
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

    console.log('\n✅ MAXIMUM VOLUME SEED COMPLETE!\n');
  } catch (err) { console.error('\n❌ Seed failed:', err); }

  await app.destroy();
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
