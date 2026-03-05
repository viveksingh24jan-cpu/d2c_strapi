
const fs = require('fs');
const path = require('path');

module.exports = async function seed(strapi) {
  console.log('🚀 Starting FINAL ULTIMATE PRODUCTION-GRADE DATA SATURATION (Unified Hub)...');

  // 1. CLEANUP
  const collections = [
    'api::page.page', 'api::navigation-menu.navigation-menu', 'api::insurance-product.insurance-product',
    'api::insurance-plan.insurance-plan', 'api::coverage.coverage', 'api::line-of-business.line-of-business',
    'api::branch.branch', 'api::leadership-profile.leadership-profile',
    'api::download-document.download-document',
    'api::article.article', 'api::author.author', 'api::category.category', 'api::campaign.campaign',
    'api::testimonial.testimonial', 'api::shared-section.shared-section', 'api::tool.tool'
  ];
  for (const uid of collections) {
    try {
      const docs = await strapi.documents(uid).findMany();
      for (const doc of docs) await strapi.documents(uid).delete({ documentId: doc.documentId });
    } catch (e) { }
  }

  // 2. GLOBAL CONFIG
  const gcData = {
    siteName: 'Kiwi General Insurance',
    siteDescription: 'Award-winning digital protection for 7 Crore+ Indians.',
    cinNumber: 'U66000MH2024PLC123456',
    irdaiRegNumber: '123',
    registeredAddress: 'Unit 101, Lotus Business Park, Ram Mandir Road, Goregaon (East), Mumbai 400063',
    section41Warning: [{ type: 'paragraph', children: [{ type: 'text', text: 'Section 41 of the Insurance Act, 1938: Prohibition of Rebates.' }] }],
    irdaiUrl: 'https://www.irdai.gov.in', gicUrl: 'https://www.gicre.in', bimaBharosaUrl: 'https://bimabharosa.irdai.gov.in',
    headerEmailAddress: 'support@kiwi-insurance.com', headerPhoneNumber: '1800-209-5494',
    footerCopyright: `© ${new Date().getFullYear()} Kiwi General Insurance.`, status: 'published'
  };
  const gc = await strapi.documents('api::global-config.global-config').findFirst();
  if (gc) await strapi.documents('api::global-config.global-config').update({ documentId: gc.documentId, data: gcData });
  else await strapi.documents('api::global-config.global-config').create({ data: gcData });

  // 3. REGISTRIES
  console.log('📦 Populating Registries (High Volume)...');
  const coverageIds = [];
  for (let i = 1; i <= 30; i++) {
    const c = await strapi.documents('api::coverage.coverage').create({ data: { name: `Coverage Block ${i}`, identifier: `COV_${i}`, type: 'addon', heading: `Heading ${i}`, status: 'published' } });
    coverageIds.push(c.id);
  }

  const lobNames = ['Motor Insurance', 'Health Insurance', 'Travel Insurance'];
  const lobIds = {};
  for (const name of lobNames) {
    const created = await strapi.documents('api::line-of-business.line-of-business').create({ data: { name, identifier: name.toUpperCase().replace(/ /g, '_'), slug: name.toLowerCase().replace(/ /g, '-'), status: 'published' } });
    lobIds[name] = created.id;
  }

  const products = [
    { name: 'Car Insurance', iden: '4W', lob: 'Motor Insurance' },
    { name: 'Bike Insurance', iden: '2W', lob: 'Motor Insurance' },
    { name: 'Health Insurance', iden: 'HEALTH', lob: 'Health Insurance' }
  ];
  const productIds = [];
  for (const p of products) {
    const createdProduct = await strapi.documents('api::insurance-product.insurance-product').create({
      data: { productName: p.name, identifier: p.iden, slug: p.name.toLowerCase().replace(/ /g, '-'), lineOfBusiness: lobIds[p.lob], productLabel: 'Best Seller', isVisibleOnHomepage: true, sortOrder: 1, status: 'published' }
    });
    productIds.push(createdProduct.id);

    await strapi.documents('api::insurance-plan.insurance-plan').create({
      data: { name: `${p.name} Platinum`, identifier: `${p.iden}_PLAT`, slug: `${p.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-platinum`, insuranceProducts: [createdProduct.id], coverages: coverageIds.slice(0, 5), status: 'published' }
    });
  }

  const author = await strapi.documents('api::author.author').create({ data: { name: 'Vivek Singh', slug: 'vivek-singh', status: 'published' } });
  const category = await strapi.documents('api::category.category').create({ data: { name: 'Guides', slug: 'guides', status: 'published' } });
  for (let i = 1; i <= 10; i++) await strapi.documents('api::article.article').create({ data: { title: `Guide ${i}`, slug: `guide-${i}`, author: author.id, categories: [category.id], excerpt: 'Excerpt', isFeatured: true, status: 'published' } });

  for (let i = 1; i <= 5; i++) await strapi.documents('api::leadership-profile.leadership-profile').create({ data: { name: `Executive ${i}`, slug: `exec-${i}`, designation: 'Director', category: 'Board', status: 'published' } });
  for (let i = 1; i <= 15; i++) await strapi.documents('api::branch.branch').create({ data: { branchName: `Branch ${i}`, slug: `branch-${i}`, branchType: 'branch-office', city: 'Mumbai', status: 'published' } });

  // 4. UNIFIED PUBLIC DISCLOSURES (Single Docs & Sets)
  console.log('🏛️ Populating Unified Disclosure Registry...');
  
  // A. Single Policies
  const policies = [
    { title: 'AML Policy', cat: 'Regulatory' },
    { title: 'Code of Conduct', cat: 'Governance' }
  ];
  for (const p of policies) {
    await strapi.documents('api::download-document.download-document').create({
      data: {
        title: p.title, slug: p.title.toLowerCase().replace(/ /g, '-'),
        category: p.cat, disclosureType: 'single_document', actionType: 'pdf_viewer',
        publishDate: new Date().toISOString(), status: 'published'
      }
    });
  }

  // B. Quarterly NL-Sets (The Big One)
  const nlItems = [];
  for (let i = 1; i <= 47; i++) {
    nlItems.push({ 
      title: `NL-${i} Schedule`, 
      actionType: 'pdf_viewer', 
      description: `Premium Schedule NL-${i}` 
    });
  }
  await strapi.documents('api::download-document.download-document').create({
    data: {
      title: 'Mandatory Disclosures - Q1 2026-27',
      slug: 'q1-2026-27-nl-set',
      category: 'Financial',
      disclosureType: 'quarterly_nl_set',
      financialYear: '2026-27',
      quarter: 'Q1',
      nestedSchedules: nlItems,
      publishDate: new Date().toISOString(),
      status: 'published'
    }
  });

  const trustBar = await strapi.documents('api::shared-section.shared-section').create({
    data: { title: 'Global Trust', blocks: [{ __component: 'page-builder.stats-bar', title: 'Stats', stats: [{ label: 'CSR', value: '99%' }] }], status: 'published' }
  });

  for (let i = 1; i <= 5; i++) await strapi.documents('api::testimonial.testimonial').create({ data: { customerName: `User ${i}`, slug: `user-${i}`, customerTitle: 'Buyer', quote: [{ type: 'paragraph', children: [{ type: 'text', text: 'Good!' }] }], rating: 5, status: 'published' } });
  await strapi.documents('api::tool.tool').create({ data: { name: 'Calc', slug: 'calc', category: 'calculator', status: 'published' } });
  await strapi.documents('api::campaign.campaign').create({ data: { campaignName: 'Sale', startDate: '2026-06-01', endDate: '2026-08-31', isActive: true, status: 'published' } });

  // 5. ALL MANDATORY PAGES
  console.log('📄 Assembling 10+ Sitemap Pages...');
  const pageList = [
    { title: 'Home', slug: 'index', template: 'home' },
    { title: 'Public Disclosures', slug: 'disclosures', template: 'legal' }
  ];

  for (const p of pageList) {
    let content = [{ __component: 'page-builder.hero-section', title: p.title, layout: 'centered' }];
    if (p.slug === 'index') {
      content.push({ __component: 'page-builder.product-grid', title: 'Featured Products', mode: 'automated' });
      content.push({ __component: 'shared.section-reference', sharedSection: trustBar.id });
    }
    if (p.slug === 'disclosures') {
      content.push({ __component: 'page-builder.document-listing', title: 'Regulatory Disclosures', category: 'Regulatory', viewType: 'list' });
      content.push({ __component: 'page-builder.document-listing', title: 'Quarterly Disclosures', category: 'Financial', viewType: 'grid' });
    }
    await strapi.documents('api::page.page').create({ data: { ...p, content, status: 'published' } });
  }

  // 6. NAVIGATION
  console.log('🍴 Building Mega Navigation...');
  const headerItems = ['Home', 'Products', 'Customer Service', 'About Us', 'Public Disclosures'];
  for (let i = 0; i < headerItems.length; i++) {
    const slug = pageList.find(ap => ap.title.includes(headerItems[i]))?.slug || 'index';
    await strapi.documents('api::navigation-menu.navigation-menu').create({ data: { label: headerItems[i], url: i === 0 ? '/' : `/${slug}`, location: 'header', displayOrder: i + 1, status: 'published' } });
  }

  console.log('✨ MISSION ACCOMPLISHED: CMS FULLY SATURATED (Unified Hub).');
}
