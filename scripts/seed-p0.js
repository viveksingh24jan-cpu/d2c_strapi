
const fs = require('fs');
const path = require('path');

module.exports = async function seed(strapi) {
  console.log('🚀 Starting ULTIMATE PRODUCTION-GRADE SEED (All Mandatory Pages)...');

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
    siteDescription: 'Simple, Scalable, Fast, and Agile Insurance.',
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
  console.log('📦 Populating Registries...');
  
  // Coverages
  const coverageIds = [];
  for (let i = 1; i <= 30; i++) {
    const c = await strapi.documents('api::coverage.coverage').create({ data: { name: `Coverage Block ${i}`, identifier: `COV_${i}`, type: 'addon', heading: `Heading ${i}`, status: 'published' } });
    coverageIds.push(c.id);
  }

  // Insurance Engine
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
  for (const p of products) {
    const createdProduct = await strapi.documents('api::insurance-product.insurance-product').create({
      data: { productName: p.name, identifier: p.iden, slug: p.name.toLowerCase().replace(/ /g, '-'), lineOfBusiness: lobIds[p.lob], productLabel: 'Best Seller', isVisibleOnHomepage: true, sortOrder: 1, status: 'published' }
    });
    await strapi.documents('api::insurance-plan.insurance-plan').create({
      data: { name: `${p.name} Platinum`, identifier: `${p.iden}_PLAT`, slug: `${p.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-platinum`, insuranceProducts: [createdProduct.id], coverages: coverageIds.slice(0, 5), status: 'published' }
    });
  }

  // 4. UNIFIED PUBLIC DISCLOSURES (Mandatory)
  console.log('🏛️ Populating Mandatory Documents...');
  
  const mandatoryPolicies = [
    { title: 'AML Policy', cat: 'Regulatory' }, { title: 'Code of Conduct', cat: 'Governance' },
    { title: 'Anti-Bribery Policy', cat: 'Governance' }, { title: 'Whistle Blower Policy', cat: 'Governance' },
    { title: 'Stewardship Policy', cat: 'Governance' }, { title: 'Underwriting Policy', cat: 'Regulatory' },
    { title: 'Policyholder Protection Policy', cat: 'Regulatory' }, { title: 'Annual Report 2025', cat: 'Financial' }
  ];
  for (const p of mandatoryPolicies) {
    await strapi.documents('api::download-document.download-document').create({
      data: {
        title: p.title, slug: p.title.toLowerCase().replace(/ /g, '-'),
        category: p.cat, disclosureType: 'single_document', actionType: 'pdf_viewer',
        publishDate: new Date().toISOString(), status: 'published'
      }
    });
  }

  // Quarterly NL Sets
  const nlItems = [];
  for (let i = 1; i <= 47; i++) nlItems.push({ title: `NL-${i}`, actionType: 'pdf_viewer' });
  await strapi.documents('api::download-document.download-document').create({
    data: {
      title: 'Mandatory Disclosures - Q1 2026-27', slug: 'q1-2026-27-nl-set', category: 'Financial',
      disclosureType: 'quarterly_nl_set', financialYear: '2026-27', quarter: 'Q1', nestedSchedules: nlItems,
      publishDate: new Date().toISOString(), status: 'published'
    }
  });

  // 5. CORPORATE ENTITIES
  console.log('👔 Adding Leadership & Branches...');
  const leaders = [
    { name: 'Vikram Aditya', slug: 'vikram-aditya', role: 'CEO', cat: 'KMP' },
    { name: 'Sunita Rao', slug: 'sunita-rao', role: 'CFO', cat: 'KMP' },
    { name: 'Amitabh Kant', slug: 'amitabh-kant', role: 'Chairman', cat: 'Board' }
  ];
  for (const l of leaders) await strapi.documents('api::leadership-profile.leadership-profile').create({ data: { name: l.name, slug: l.slug, designation: l.role, category: l.cat, status: 'published' } });
  
  await strapi.documents('api::branch.branch').create({ data: { branchName: 'Mumbai HQ', slug: 'mumbai-hq', branchType: 'head-office', city: 'Mumbai', status: 'published' } });
  
  // 6. ALL MANDATORY PAGES (Based on Schema Capabilities)
  console.log('📄 Assembling All Mandatory Pages...');
  const pageList = [
    { title: 'Home', slug: 'index', template: 'home' },
    { title: 'About Us', slug: 'about-us', template: 'about' },
    { title: 'Board of Directors', slug: 'board-of-directors', template: 'about' },
    { title: 'Key Management Personnel', slug: 'kmp', template: 'about' },
    { title: 'Our Products', slug: 'products', template: 'product-landing' },
    { title: 'Customer Service', slug: 'customer-service', template: 'default' },
    { title: 'Branch List', slug: 'branch-list', template: 'default' },
    { title: 'Grievance Redressal', slug: 'grievance-redressal', template: 'grievance' },
    { title: 'Ombudsman List', slug: 'ombudsman-list', template: 'legal' },
    { title: 'News & Media', slug: 'news-media', template: 'default' },
    { title: 'Public Disclosures', slug: 'public-disclosures', template: 'legal' },
    { title: 'Corporate Governance', slug: 'corporate-governance', template: 'legal' },
    { title: 'Investor Relations', slug: 'investor-relations', template: 'legal' },
    { title: 'Compliance Hub', slug: 'compliance', template: 'legal' }
  ];

  for (const p of pageList) {
    let content = [{ __component: 'page-builder.hero-section', title: p.title, layout: 'centered' }];
    
    if (p.slug === 'index') {
      content.push({ __component: 'page-builder.product-grid', title: 'Featured Products', mode: 'automated' });
    }
    
    if (p.slug === 'public-disclosures') {
      content.push({ __component: 'page-builder.document-listing', title: 'Regulatory Disclosures', category: 'Regulatory', viewType: 'list' });
      content.push({ __component: 'page-builder.document-listing', title: 'Financial Reports', category: 'Financial', viewType: 'list' });
    }

    if (p.slug === 'compliance') {
      content.push({ __component: 'page-builder.document-listing', title: 'Compliance Policies', category: 'Regulatory', viewType: 'grid' });
    }

    if (p.slug === 'grievance-redressal') {
      content.push({
        __component: 'page-builder.accordion', title: 'Escalation Matrix',
        items: [
          { title: 'Level 1: Support', content: [{ type: 'paragraph', children: [{ type: 'text', text: 'Email hello@kiwi.com' }] }] },
          { title: 'Level 2: GRO', content: [{ type: 'paragraph', children: [{ type: 'text', text: 'Contact our Grievance Officer' }] }] },
          { title: 'Level 3: Ombudsman', content: [{ type: 'paragraph', children: [{ type: 'text', text: 'Escalate to IRDAI Bima Bharosa' }] }] }
        ]
      });
    }

    await strapi.documents('api::page.page').create({ data: { ...p, content, status: 'published' } });
  }

  // 7. NAVIGATION
  console.log('🍴 Building Navigation...');
  const headerItems = ['Home', 'Products', 'Customer Service', 'About Us', 'Public Disclosures'];
  for (let i = 0; i < headerItems.length; i++) {
    const slug = pageList.find(ap => ap.title.includes(headerItems[i]))?.slug || 'index';
    await strapi.documents('api::navigation-menu.navigation-menu').create({ data: { label: headerItems[i], url: i === 0 ? '/' : `/${slug}`, location: 'header', displayOrder: i + 1, status: 'published' } });
  }

  const footers = [
    { loc: 'footer_products', title: 'Products', links: ['Car Insurance', 'Bike Insurance', 'Health Insurance'] },
    { loc: 'footer_company', title: 'Company', links: ['About Us', 'Leadership', 'News'] },
    { loc: 'footer_resources', title: 'Resources', links: ['Disclosures', 'Grievance', 'Branches'] },
    { loc: 'footer_legal', title: 'Legal', links: ['Privacy Policy', 'Terms of Use', 'AML Policy'] }
  ];
  for (const f of footers) {
    const parent = await strapi.documents('api::navigation-menu.navigation-menu').create({ data: { label: f.title, location: f.loc, status: 'published' } });
    for (const l of f.links) await strapi.documents( 'api::navigation-menu.navigation-menu').create({ data: { label: l, url: '/', parent: parent.id, status: 'published' } });
  }

  console.log('✨ SUCCESS: ALL MANDATORY PAGES & DATA ARE LIVE.');
}
