
const fs = require('fs');
const path = require('path');

module.exports = async function seed(strapi) {
  console.log('🚀 Starting PRODUCTION SEED (UI Metadata Only)...');

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
    status: 'published'
  };
  const gc = await strapi.documents('api::global-config.global-config').findFirst();
  if (gc) await strapi.documents('api::global-config.global-config').update({ documentId: gc.documentId, data: gcData });
  else await strapi.documents('api::global-config.global-config').create({ data: gcData });

  // 3. LINES OF BUSINESS (LOB)
  const lobMoto = await strapi.documents('api::line-of-business.line-of-business').create({ 
    data: { name: 'Motor Insurance', identifier: 'MOTO', slug: 'motor-insurance', status: 'published' } 
  });

  // 4. COVERAGE REGISTRY (UI Metadata Only)
  // These map to the SOR via the 'identifier' field
  console.log('📦 Populating Coverage Metadata Registry...');
  const sorCoverages = [
    { code: 'LLTP_FLAG', name: 'Legal Liability to Third Party', type: 'default' },
    { code: 'PAOD_FLAG', name: 'CPA to owner driver', type: 'default' },
    { code: 'EMERTS_FLAG', name: 'Emergency Travel & Stay', type: 'addon' },
    { code: 'KEYREP_FLAG', name: 'Lost Key Replacement Cover', type: 'addon' },
    { code: 'EMERMED_FLAG', name: 'Emergency Medical expenses', type: 'addon' },
    { code: 'RSABASIC_FLAG', name: '24x7 Roadside Help', type: 'addon' },
    { code: 'TPBODYINJURY_FLAG', name: 'Third Party Bodily Injury', type: 'default' },
    { code: 'LOSSPERSBELONG_FLAG', name: 'Personal Belongings Protection', type: 'addon' },
    { code: 'ZERO_DEP', name: 'Zero Depreciation', type: 'addon' }
  ];

  const coverageMap = {};
  for (const c of sorCoverages) {
    const created = await strapi.documents('api::coverage.coverage').create({ 
      data: { 
        name: c.name, 
        identifier: c.code, 
        type: c.type, 
        heading: c.name,
        description: `Marketing description for ${c.name}`,
        status: 'published' 
      } 
    });
    coverageMap[c.code] = created.id;
  }

  // 5. PRODUCTS (4W & 2W)
  const product4W = await strapi.documents('api::insurance-product.insurance-product').create({
    data: { 
      productName: 'Car Insurance', identifier: '4W', slug: 'car-insurance', 
      lineOfBusiness: lobMoto.id, status: 'published' 
    }
  });

  const product2W = await strapi.documents('api::insurance-product.insurance-product').create({
    data: { 
      productName: 'Bike Insurance', identifier: '2W', slug: 'bike-insurance', 
      lineOfBusiness: lobMoto.id, status: 'published' 
    }
  });

  // 6. PLANS (PACKAGE & LIABILITY)
  // Comprehensive (PACKAGE)
  await strapi.documents('api::insurance-plan.insurance-plan').create({
    data: { 
      name: 'Comprehensive Package', identifier: 'PACKAGE', slug: 'comprehensive-package', 
      insuranceProducts: [product4W.id, product2W.id], 
      coverages: Object.values(coverageMap),
      status: 'published' 
    }
  });

  // Third Party (LIABILITY)
  await strapi.documents('api::insurance-plan.insurance-plan').create({
    data: { 
      name: 'Third Party Liability Only', identifier: 'LIABILITY', slug: 'third-party-liability', 
      insuranceProducts: [product4W.id, product2W.id], 
      coverages: [
        coverageMap['LLTP_FLAG'],
        coverageMap['TPBODYINJURY_FLAG'],
        coverageMap['PAOD_FLAG']
      ],
      status: 'published' 
    }
  });

  console.log('✨ SUCCESS: CMS CLEANED OF TECHNICAL DATA. NOW UI METADATA ONLY.');
}
