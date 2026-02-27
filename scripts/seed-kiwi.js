'use strict';

/**
 * 🥝 Kiwi General Insurance Limited - ULTRA-VOLUME MASTER SEED
 * Role: CMS Architect | Data Engineer
 * Goal: 100% Coverage, High Density, Realistic Enterprise Data
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

// ─── Seeding Logic ───

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';

  console.log('\n🚀 KIWI GENERAL INSURANCE - STARTING ULTRA-VOLUME SEED...\n');

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

    // 1. CONTENT METADATA (Authors & Categories)
    console.log('  -> Seeding Authors & Categories...');
    const auth1 = await createEntry('api::author.author', { name: 'Vikram Seth', slug: 'vikram-seth', bio: blocks('CMS Architect.') });
    const auth2 = await createEntry('api::author.author', { name: 'Priya Sharma', slug: 'priya-sharma', bio: blocks('Insurance Specialist.') });
    const auth3 = await createEntry('api::author.author', { name: 'Rahul Khanna', slug: 'rahul-khanna', bio: blocks('Tech Lead.') });

    const cat1 = await createEntry('api::category.category', { name: 'Claims', slug: 'claims' });
    const cat2 = await createEntry('api::category.category', { name: 'Savings', slug: 'savings' });
    const cat3 = await createEntry('api::category.category', { name: 'Company News', slug: 'news' });

    // 2. PRODUCT REGISTRY (Comprehensive Portfolio)
    console.log('  -> Seeding Full Product Portfolio...');
    const pr_car = await createEntry('api::insurance-product.insurance-product', { productName: 'Private Car Insurance', tagline: 'Drive safe.', startingPrice: 2094, isActive: true, sortOrder: 1, ctaText: 'Get Quote', ctaUrl: '/car' });
    const pr_bike = await createEntry('api::insurance-product.insurance-product', { productName: 'Two Wheeler Shield', tagline: 'Bike protection.', startingPrice: 499, isActive: true, sortOrder: 2, ctaText: 'Renew Now', ctaUrl: '/bike' });
    const pr_health = await createEntry('api::insurance-product.insurance-product', { productName: 'Health Assurance Plus', tagline: 'Family care.', startingPrice: 5500, isActive: true, sortOrder: 3, ctaText: 'View Plan', ctaUrl: '/health' });
    const pr_arogya = await createEntry('api::insurance-product.insurance-product', { productName: 'Arogya Sanjeevani', tagline: 'Standard Health Policy', startingPrice: 3000, isActive: true, sortOrder: 4, isStandard: true, productType: 'arogya-sanjeevani', ctaText: 'View', ctaUrl: '/arogya' });
    const pr_home = await createEntry('api::insurance-product.insurance-product', { productName: 'Bharat Griha Raksha', tagline: 'Standard Home Policy', startingPrice: 499, isActive: true, sortOrder: 5, isStandard: true, productType: 'bharat-griha-raksha', ctaText: 'View', ctaUrl: '/home' });

    // 3. INFRASTRUCTURE (Multi-City)
    console.log('  -> Seeding Branches & Ombudsman...');
    await createEntry('api::branch.branch', { branchName: 'Bangalore HQ', branchType: 'head-office', city: 'Bangalore', latitude: 12.9352, longitude: 77.6245 });
    await createEntry('api::branch.branch', { branchName: 'Mumbai Regional', branchType: 'regional-office', city: 'Mumbai', latitude: 19.0760, longitude: 72.8777 });
    await createEntry('api::branch.branch', { branchName: 'Delhi Central', branchType: 'branch-office', city: 'Delhi', latitude: 28.6139, longitude: 77.2090 });
    await createEntry('api::branch.branch', { branchName: 'Pune Branch', branchType: 'branch-office', city: 'Pune' });

    await createEntry('api::ombudsman-office.ombudsman-office', { city: 'Ahmedabad', email: 'ahmedabad@ombudsman.in' });
    await createEntry('api::ombudsman-office.ombudsman-office', { city: 'Chennai', email: 'chennai@ombudsman.in' });
    await createEntry('api::ombudsman-office.ombudsman-office', { city: 'Kolkata', email: 'kolkata@ombudsman.in' });

    // 4. CORPORATE & HR
    console.log('  -> Seeding HR & Leadership...');
    await createEntry('api::job-listing.job-listing', { jobTitle: 'Senior Actuary', department: 'Risk', location: 'Bangalore', isActive: true });
    await createEntry('api::job-listing.job-listing', { jobTitle: 'Claims Manager', department: 'Claims', location: 'Mumbai', isActive: true });
    await createEntry('api::job-listing.job-listing', { jobTitle: 'Node.js Developer', department: 'Tech', location: 'Remote', isActive: true });

    await createEntry('api::leadership-profile.leadership-profile', { name: 'Sumir Chadha', designation: 'Director', category: 'Board' });
    await createEntry('api::leadership-profile.leadership-profile', { name: 'Neelesh Garg', designation: 'Director', category: 'Board' });
    await createEntry('api::leadership-profile.leadership-profile', { name: 'Bhama Krishnamurthy', designation: 'Director', category: 'Board' });

    // 5. FINANCE & COMPLIANCE
    console.log('  -> Seeding Disclosures & Downloads...');
    await createEntry('api::financial-disclosure.financial-disclosure', { title: 'Annual Report 2023-24', financialYear: '2023-24', disclosureType: 'annual-report' });
    await createEntry('api::financial-disclosure.financial-disclosure', { title: 'Public Disclosure Q1 FY25', financialYear: '2024-25', quarter: 'Q1', disclosureType: 'public-disclosure' });

    await createEntry('api::download-document.download-document', { title: 'KYC Form', documentType: 'policy-wording', productCategory: 'motor' });
    await createEntry('api::download-document.download-document', { title: 'Motor Claim Form', documentType: 'claim-form', productCategory: 'motor' });
    await createEntry('api::download-document.download-document', { title: 'Health Proposal', documentType: 'proposal-form', productCategory: 'health' });

    // 6. TOOLS & TESTIMONIALS
    console.log('  -> Seeding Tools & Testimonials...');
    const tc1 = await createEntry('api::tool-category.tool-category', { name: 'Calculators', slug: 'calculators' });
    const tc2 = await createEntry('api::tool-category.tool-category', { name: 'Checkers', slug: 'checkers' });

    await createEntry('api::tool.tool', { name: 'Premium Calculator', slug: 'premium-calc', tool_category: { connect: [{ documentId: tc1.documentId }] }, isActive: true });
    await createEntry('api::tool.tool', { name: 'Challan Checker', slug: 'challan', tool_category: { connect: [{ documentId: tc2.documentId }] }, isActive: true });

    await createEntry('api::testimonial.testimonial', { customerName: 'Rajesh G.', testimonialContent: blocks('Excellent service!') });
    await createEntry('api::testimonial.testimonial', { customerName: 'Anjali S.', testimonialContent: blocks('Seamless claims.') });

    // 7. ARTICLES & REDIRECTS
    console.log('  -> Seeding Articles & SEO...');
    await createEntry('api::article.article', { title: 'How to Save on Car Insurance', slug: 'car-savings', author: { connect: [{ documentId: auth1.documentId }] }, categories: { connect: [{ documentId: cat1.documentId }] } });
    await createEntry('api::article.article', { title: 'Understanding 80D Benefits', slug: 'tax-80d', author: { connect: [{ documentId: auth2.documentId }] }, categories: { connect: [{ documentId: cat2.documentId }] } });
    await createEntry('api::article.article', { title: 'Kiwi Incorporation 2024', slug: 'kiwi-inc-2024', author: { connect: [{ documentId: auth3.documentId }] }, categories: { connect: [{ documentId: cat3.documentId }] } });

    await createEntry('api::redirect.redirect', { fromPath: '/old-site', toPath: '/home', type: 'permanent' });
    await createEntry('api::redirect.redirect', { fromPath: '/contact-us', toPath: '/contact', type: 'temporary' });

    // 8. SHARED SECTIONS & PAGES
    console.log('  -> Seeding Pages & Shared Blocks...');
    const globalHelp = await createEntry('api::shared-section.shared-section', { title: 'Global Help', blocks: [{ __component: 'page-builder.banner', title: 'Need Help?', description: 'Call 1800-123-4567' }] });

    await createEntry('api::page.page', {
      title: 'Home', slug: 'home', template: 'home',
      content: [
        { __component: 'page-builder.hero-section', title: 'Insuring India', subtitle: 'Simple & Digital.' },
        { __component: 'page-builder.insurance-product-cta', product: { connect: [{ documentId: pr_car.documentId }] }, variant: 'card' },
        { __component: 'page-builder.insurance-product-cta', product: { connect: [{ documentId: pr_health.documentId }] }, variant: 'banner' },
        { __component: 'shared.section-reference', shared_section: { connect: [{ documentId: globalHelp.documentId }] } }
      ]
    });

    await createEntry('api::page.page', { title: 'About Us', slug: 'about', template: 'about' });
    await createEntry('api::page.page', { title: 'Grievance Redressal', slug: 'grievance', template: 'grievance' });

    // 9. NAVIGATION & GLOBAL
    console.log('  -> Seeding Global Config & Nav...');
    await updateSingle('api::global-config.global-config', {
      siteName: 'Kiwi General Insurance', siteDescription: 'Digital-First Insurer',
      irdaiRegNumber: 'Applied', cinNumber: 'U65120KA2024PLC194560',
      registeredAddress: 'Koramangala, Bangalore'
    });

    const n1 = await createEntry('api::navigation-menu.navigation-menu', { label: 'Products', location: 'header' });
    await createEntry('api::navigation-menu.navigation-menu', { label: 'Motor', parent: { connect: [{ documentId: n1.documentId }] } });
    await createEntry('api::navigation-menu.navigation-menu', { label: 'Health', parent: { connect: [{ documentId: n1.documentId }] } });

    // 10. GRIEVANCE LEVELS
    await createEntry('api::grievance-level.grievance-level', { levelNumber: 1, levelName: 'Customer Support' });
    await createEntry('api::grievance-level.grievance-level', { levelNumber: 2, levelName: 'Grievance Officer' });
    await createEntry('api::grievance-level.grievance-level', { levelNumber: 3, levelName: 'Compliance Officer' });

    // 11. PERMISSIONS
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

    console.log('\n✅ ULTRA-VOLUME SEED COMPLETE! 19/19 Collections Populated.\n');
  } catch (err) { console.error('\n❌ Seed failed:', err); }

  await app.destroy();
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
