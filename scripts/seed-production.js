
const fs = require('fs');
const path = require('path');

module.exports = async function seed(strapi) {
  console.log('🚀 Starting ULTIMATE PRODUCTION-GRADE SEED (Full UI Saturation)...');

  // 1. CLEANUP (Standard)
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

  // 2. GLOBAL CONFIG & SHARED ASSETS
  console.log('🌍 Setting Global Config...');
  const gcData = {
    siteName: 'Kiwi General Insurance',
    siteDescription: 'Simple, Scalable, Fast, and Agile Insurance.',
    cinNumber: 'U66000MH2024PLC123456',
    irdaiRegNumber: '123',
    registeredAddress: 'Unit 101, Lotus Business Park, Ram Mandir Road, Goregaon (East), Mumbai 400063',
    section41Warning: [{ type: 'paragraph', children: [{ type: 'text', text: 'Section 41 of the Insurance Act, 1938: Prohibition of Rebates.' }] }],
    irdaiUrl: 'https://www.irdai.gov.in', gicUrl: 'https://www.gicre.in', bimaBharosaUrl: 'https://bimabharosa.irdai.gov.in',
    headerEmailAddress: 'support@kiwi-insurance.com', headerPhoneNumber: '1800-209-5494',
    footerCopyright: `© ${new Date().getFullYear()} Kiwi General Insurance.`, 
    status: 'published',
    uiConfig: {
      showBreadcrumbs: true,
      themeColor: '#FF4500' // Kiwi Orange
    }
  };
  
  const gc = await strapi.documents('api::global-config.global-config').findFirst();
  if (gc) await strapi.documents('api::global-config.global-config').update({ documentId: gc.documentId, data: gcData });
  else await strapi.documents('api::global-config.global-config').create({ data: gcData });

  // 3. REGISTRIES (The Foundation)
  console.log('📦 Populating Master Registries...');
  
  // Coverages (Technical Keywords for Quote Engine)
  const coverageIds = [];
  const coverageList = [
    { name: 'Zero Depreciation', code: 'ZERO_DEP', type: 'addon', desc: 'Get full claim amount without deduction for depreciation.' },
    { name: 'Engine Protection', code: 'ENG_PROT', type: 'addon', desc: 'Covers damage to engine due to water ingression.' },
    { name: 'Roadside Assistance', code: 'RSA', type: 'addon', desc: '24/7 breakdown support anywhere in India.' },
    { name: 'Return to Invoice', code: 'RTI', type: 'addon', desc: 'Get full invoice value in case of total loss.' },
    { name: 'Consumables Cover', code: 'CONSUMABLES', type: 'addon', desc: 'Covers cost of nuts, bolts, oil, etc.' },
    { name: 'Personal Accident', code: 'PA_COVER', type: 'inclusion', desc: 'Mandatory coverage for owner-driver.' },
    { name: 'Third Party Liability', code: 'TP_COVER', type: 'inclusion', desc: 'Covers damages to third-party property/life.' },
    { name: 'Own Damage', code: 'OD_COVER', type: 'inclusion', desc: 'Covers damages to your own vehicle.' }
  ];

  for (const c of coverageList) {
    const created = await strapi.documents('api::coverage.coverage').create({ 
      data: { 
        name: c.name, 
        identifier: c.code, 
        type: c.type, 
        heading: c.name, 
        description: c.desc,
        status: 'published' 
      } 
    });
    coverageIds.push(created.id);
  }

  // Lines of Business
  const lobNames = ['Motor Insurance', 'Health Insurance', 'Travel Insurance', 'Home Insurance'];
  const lobIds = {};
  for (const name of lobNames) {
    const created = await strapi.documents('api::line-of-business.line-of-business').create({ 
      data: { 
        name, 
        identifier: name.toUpperCase().replace(/ /g, '_'), 
        slug: name.toLowerCase().replace(/ /g, '-'), 
        status: 'published' 
      } 
    });
    lobIds[name] = created.id;
  }

  // Insurance Products (The "Heroes")
  const productMap = {};
  const products = [
    { name: 'Car Insurance', iden: '4W', lob: 'Motor Insurance', label: 'Best Seller' },
    { name: 'Bike Insurance', iden: '2W', lob: 'Motor Insurance', label: 'Tax Saving' },
    { name: 'Health Insurance', iden: 'HEALTH', lob: 'Health Insurance', label: 'Recommended' },
    { name: 'Travel Insurance', iden: 'TRAVEL', lob: 'Travel Insurance', label: 'New' }
  ];

  for (const p of products) {
    // 1. Create Product
    const createdProduct = await strapi.documents('api::insurance-product.insurance-product').create({
      data: { 
        productName: p.name, 
        identifier: p.iden, 
        slug: p.name.toLowerCase().replace(/ /g, '-'), 
        lineOfBusiness: lobIds[p.lob], 
        productLabel: p.label, 
        isVisibleOnHomepage: true, 
        sortOrder: 1, 
        heroHeading: `Protect your ${p.name.split(' ')[0]} starting @ ₹2/day`,
        heroDescription: 'Zero paperwork. 100% digital claims. Trusted by 2 million+ Indians.',
        pageBuilder: [
            { __component: 'page-builder.hero-section', title: p.name, layout: 'split-image-right' },
            { __component: 'page-builder.stats-bar', stats: [{ label: 'Happy Customers', value: '2M+' }, { label: 'Claims Settled', value: '98%' }, { label: 'Cashless Garages', value: '5000+' }] },
            { __component: 'page-builder.comparison-table', title: 'Why Choose Kiwi?', columns: ['Feature', 'Kiwi', 'Others'], rows: [['Paperless', 'Yes', 'No'], ['Claims Speed', 'Instant', 'Days']] },
            { __component: 'page-builder.accordion', title: 'Frequently Asked Questions', items: [{ title: 'Is inspection required?', content: [{ type: 'paragraph', children: [{ type: 'text', text: 'No, for renewals inspection is not required.' }] }] }] },
            { __component: 'page-builder.sticky-cta-bar', ctaButton: { label: 'Get Quote', href: '/quote', variant: 'primary' } }
        ],
        status: 'published' 
      }
    });
    productMap[p.iden] = createdProduct.id;

    // 2. Create Plans (1 Year, 3 Year, etc.)
    await strapi.documents('api::insurance-plan.insurance-plan').create({
      data: { 
        name: `${p.name} Comprehensive`, 
        identifier: `${p.iden}_COMP_1YR`, 
        slug: `${p.name.toLowerCase().replace(/ /g, '-')}-comprehensive`, 
        insuranceProducts: [createdProduct.id], 
        coverages: coverageIds, 
        isPopular: true,
        status: 'published' 
      }
    });
    
    // 3. Create a Long Term Plan
    if (p.iden === '4W' || p.iden === '2W') {
        await strapi.documents('api::insurance-plan.insurance-plan').create({
            data: { 
              name: `${p.name} 3 Year Bundle`, 
              identifier: `${p.iden}_COMP_3YR`, 
              slug: `${p.name.toLowerCase().replace(/ /g, '-')}-3-year`, 
              insuranceProducts: [createdProduct.id], 
              coverages: coverageIds, 
              isPopular: false,
              status: 'published' 
            }
          });
    }
  }

  // 4. RICH CONTENT REGISTRIES
  console.log('💎 Adding Rich Content (Branches, Docs, People)...');
  
  // Leadership
  const leaders = [
    { name: 'Vikram Aditya', slug: 'vikram-aditya', role: 'CEO', cat: 'KMP', bio: '20+ years in InsurTech.' },
    { name: 'Sunita Rao', slug: 'sunita-rao', role: 'CFO', cat: 'KMP', bio: 'Ex-Goldman Sachs.' },
    { name: 'Amitabh Kant', slug: 'amitabh-kant', role: 'Chairman', cat: 'Board', bio: 'Policy veteran.' },
    { name: 'Dr. R. Singh', slug: 'r-singh', role: 'Independent Director', cat: 'Board', bio: 'Expert in Risk.' }
  ];
  for (const l of leaders) await strapi.documents('api::leadership-profile.leadership-profile').create({ data: { name: l.name, slug: l.slug, designation: l.role, category: l.cat, status: 'published' } });
  
  // Branches
  const branches = [
    { name: 'Mumbai HQ', type: 'head-office', city: 'Mumbai', state: 'Maharashtra' },
    { name: 'Delhi Regional', type: 'regional-office', city: 'New Delhi', state: 'Delhi' },
    { name: 'Bangalore Tech Hub', type: 'branch-office', city: 'Bangalore', state: 'Karnataka' },
    { name: 'Pune Service Center', type: 'branch-office', city: 'Pune', state: 'Maharashtra' },
    { name: 'Hyderabad Claims', type: 'branch-office', city: 'Hyderabad', state: 'Telangana' }
  ];
  for (const b of branches) await strapi.documents('api::branch.branch').create({ data: { branchName: b.name, slug: b.name.toLowerCase().replace(/ /g, '-'), branchType: b.type, city: b.city, state: b.state, status: 'published' } });

  // Documents
  const docs = [
    { title: 'AML Policy', cat: 'Regulatory' }, { title: 'Code of Conduct', cat: 'Governance' },
    { title: 'Anti-Bribery Policy', cat: 'Governance' }, { title: 'Whistle Blower Policy', cat: 'Governance' },
    { title: 'Annual Report 2024-25', cat: 'Financial' }, { title: 'Public Disclosure Q1 2025', cat: 'Financial' }
  ];
  for (const d of docs) {
    await strapi.documents('api::download-document.download-document').create({
        data: {
          title: d.title, slug: d.title.toLowerCase().replace(/ /g, '-'),
          category: d.cat, disclosureType: 'single_document', actionType: 'pdf_viewer',
          publishDate: new Date().toISOString(), status: 'published'
        }
      });
  }

  // Articles
  const categories = ['News', 'Guides', 'Tech', 'Claims'];
  const catIds = [];
  for (const c of categories) {
      const created = await strapi.documents('api::category.category').create({ data: { name: c, slug: c.toLowerCase(), status: 'published' } });
      catIds.push(created.id);
  }
  
  const authors = [{ name: 'Kiwi Editor', email: 'editor@kiwi.com' }, { name: 'Risk Expert', email: 'risk@kiwi.com' }];
  const authorIds = [];
  for (const a of authors) {
      const created = await strapi.documents('api::author.author').create({ data: { name: a.name, email: a.email, status: 'published' } });
      authorIds.push(created.id);
  }

  await strapi.documents('api::article.article').create({
      data: {
          title: 'How to Save Tax with Health Insurance',
          slug: 'save-tax-health-insurance',
          author: authorIds[1],
          categories: [catIds[1]],
          blocks: [
              { __component: 'page-builder.text-block', content: '## Section 80D Explained\nDid you know you can save up to ₹75,000?' },
              { __component: 'page-builder.insurance-product-cta', product: productMap['HEALTH'], title: 'Check Premium' }
          ],
          status: 'published'
      }
  });

  // 5. COMPLEX PAGE BUILDING (The Showstopper)
  console.log('🎨 Assembling High-Fidelity UI Pages...');

  // Home Page (Bento Grid + Products)
  await strapi.documents('api::page.page').create({
      data: {
          title: 'Home', slug: 'index', template: 'home',
          content: [
              { __component: 'page-builder.hero-section', title: 'Insurance, Simplified.', subtitle: 'Zero paperwork. Instant claims.', layout: 'centered', ctaPrimary: { label: 'View Products', href: '/products', variant: 'primary' } },
              { __component: 'page-builder.product-grid', title: 'Our Products', mode: 'automated' },
              { __component: 'page-builder.card-grid', title: 'Why Kiwi?', layout: 'bento-grid', cards: [
                  { title: 'Super Fast', description: 'Claims in 20 mins', icon: 'zap', colSpan: 2, rowSpan: 2 },
                  { title: 'Low Cost', description: 'Direct to consumer prices', icon: 'tag', colSpan: 1, rowSpan: 1 },
                  { title: '24/7 Support', description: 'Always here for you', icon: 'phone', colSpan: 1, rowSpan: 1 }
              ]},
              { __component: 'page-builder.testimonial-showcase', title: 'What People Say', layout: 'carousel', manualTestimonials: [
                  { name: 'Rahul D.', role: 'Customer', quote: 'Best experience ever!', rating: 5 },
                  { name: 'Priya S.', role: 'Customer', quote: 'Got my claim in minutes.', rating: 5 }
              ]},
              { __component: 'page-builder.cta-section', title: 'Ready to switch?', description: 'Join 2 million happy customers.', ctaPrimary: { label: 'Get Started', href: '/signup', variant: 'primary' }, variant: 'centered' }
          ],
          status: 'published'
      }
  });

  // About Us (Tabs + Leadership)
  await strapi.documents('api::page.page').create({
    data: {
        title: 'About Us', slug: 'about-us', template: 'about',
        content: [
            { __component: 'page-builder.hero-section', title: 'About Kiwi', layout: 'simple' },
            { __component: 'page-builder.tabs', title: 'Our Organization', tabs: [
                { label: 'Leadership', content: [{ __component: 'page-builder.leadership-grid', title: 'Meet the Leaders', category: 'KMP' }] },
                { label: 'Board', content: [{ __component: 'page-builder.leadership-grid', title: 'Board of Directors', category: 'Board' }] },
                { label: 'Careers', content: [{ __component: 'page-builder.text-block', content: '## Join Us\nWe are hiring!' }] }
            ]},
            { __component: 'page-builder.stats-bar', stats: [{ label: 'Years', value: '5' }, { label: 'Employees', value: '500+' }] }
        ],
        status: 'published'
    }
});

  // Public Disclosures (Nested Docs)
  await strapi.documents('api::page.page').create({
    data: {
        title: 'Public Disclosures', slug: 'public-disclosures', template: 'legal',
        content: [
            { __component: 'page-builder.hero-section', title: 'Transparency Hub', layout: 'simple' },
            { __component: 'page-builder.document-listing', title: 'Financial Reports', category: 'Financial', viewType: 'list' },
            { __component: 'page-builder.document-listing', title: 'Regulatory Policies', category: 'Regulatory', viewType: 'grid' },
            { __component: 'page-builder.branch-locator', title: 'Ombudsman Offices', filterType: 'ombudsman-office' }
        ],
        status: 'published'
    }
});

  // Contact Us (Branches + Modal)
  await strapi.documents('api::page.page').create({
    data: {
        title: 'Contact Us', slug: 'contact', template: 'default',
        content: [
            { __component: 'page-builder.hero-section', title: 'We are here to help', layout: 'simple' },
            { __component: 'page-builder.branch-locator', title: 'Find a Branch Near You', filterType: 'all', viewLayout: 'map' },
            { __component: 'page-builder.accordion', title: 'Support FAQs', items: [
                { title: 'How to claim?', content: [{ type: 'paragraph', children: [{ type: 'text', text: 'Use the app.' }] }] },
                { title: 'Helpline Number?', content: [{ type: 'paragraph', children: [{ type: 'text', text: '1800-209-5494' }] }] }
            ]},
            { __component: 'page-builder.modals', modalId: 'callback-modal', title: 'Request Callback', triggerOnLoad: true, content: [{ __component: 'page-builder.text-block', content: 'Our team will call you back in 5 mins.' }] }
        ],
        status: 'published'
    }
});

  // 6. NAVIGATION (The Skeleton)
  console.log('🍴 Building Navigation Tree...');
  
  // Header
  const headerLinks = [
      { label: 'Home', url: '/' },
      { label: 'Products', url: '/products' },
      { label: 'Claims', url: '/claims' },
      { label: 'Renew', url: '/renew' },
      { label: 'About', url: '/about-us' }
  ];
  for (let i = 0; i < headerLinks.length; i++) {
      await strapi.documents('api::navigation-menu.navigation-menu').create({ data: { label: headerLinks[i].label, url: headerLinks[i].url, location: 'header', displayOrder: i + 1, status: 'published' } });
  }

  // Footer
  const footers = [
      { loc: 'footer_products', title: 'Products', links: ['Car Insurance', 'Bike Insurance', 'Health Insurance', 'Travel Insurance'] },
      { loc: 'footer_company', title: 'Company', links: ['About Us', 'Careers', 'Contact', 'Blog'] },
      { loc: 'footer_legal', title: 'Legal', links: ['Public Disclosures', 'Privacy Policy', 'Terms of Use', 'Grievance Redressal'] }
  ];
  for (const f of footers) {
      const parent = await strapi.documents('api::navigation-menu.navigation-menu').create({ data: { label: f.title, location: f.loc, status: 'published' } });
      for (const l of f.links) {
          const slug = l.toLowerCase().replace(/ /g, '-');
          await strapi.documents('api::navigation-menu.navigation-menu').create({ data: { label: l, url: `/${slug}`, parent: parent.id, status: 'published' } });
      }
  }

  console.log('✨ SUCCESS: PRODUCTION ENVIRONMENT FULLY HYDRATED.');
  console.log('   - 5 Pages Created (Home, About, Contact, Disclosures, Product Landing)');
  console.log('   - 4 Major Products Linked (Car, Bike, Health, Travel)');
  console.log('   - Full Registry Populated (Branches, Docs, Leaders)');
  console.log('   - Navigation Tree Built');
}
