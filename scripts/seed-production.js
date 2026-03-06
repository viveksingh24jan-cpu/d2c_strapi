
const fs = require('fs');
const path = require('path');

module.exports = async function seed(strapi) {
  console.log('🚀 Starting PRODUCTION SEED (Semantic Mapping Only - No ProductIDs)...');

  // 1. CLEANUP
  const collections = [
    'api::page.page', 'api::navigation-menu.navigation-menu', 'api::insurance-product.insurance-product',
    'api::insurance-plan.insurance-plan', 'api::coverage.coverage', 'api::line-of-business.line-of-business',
    'api::ccm-config.ccm-config'
  ];
  for (const uid of collections) {
    try {
      const docs = await strapi.documents(uid).findMany({ locale: 'en', status: 'draft' });
      for (const doc of docs) await strapi.documents(uid).delete({ documentId: doc.documentId, locale: 'en' });
      const pubDocs = await strapi.documents(uid).findMany({ locale: 'en', status: 'published' });
      for (const doc of pubDocs) await strapi.documents(uid).delete({ documentId: doc.documentId, locale: 'en' });
    } catch (e) { }
  }

  // 2. LOB
  const lobMoto = await strapi.documents('api::line-of-business.line-of-business').create({ 
    data: { name: 'Motor Insurance', identifier: 'MOTO', slug: 'motor-insurance' },
    status: 'published', locale: 'en'
  });

  // 3. COVERAGE REGISTRY
  const sorCoverages = [
    { code: 'LLTP_FLAG', name: 'Legal Liability to Third Party', type: 'default', icon: 'shield-user' },
    { code: 'PAOD_FLAG', name: 'CPA to owner driver', type: 'default', icon: 'heart-pulse' },
    { code: 'ZERO_DEP', name: 'Zero Depreciation', type: 'addon', icon: 'sparkles' }
  ];

  const coverageMap = {};
  for (const c of sorCoverages) {
    const created = await strapi.documents('api::coverage.coverage').create({ 
      data: { 
        name: c.name, 
        identifier: c.code, 
        type: c.type, 
        iconCode: c.icon,
        pdfDisplayName: c.name,
        pdfLegalWording: `Legal wording for ${c.name}`
      },
      status: 'published', locale: 'en'
    });
    coverageMap[c.code] = created.id;
  }

  // 4. PRODUCTS
  const product2W = await strapi.documents('api::insurance-product.insurance-product').create({
    data: { productName: 'Bike Insurance', identifier: 'TWOWHEELER', slug: 'bike-insurance', lineOfBusiness: lobMoto.id },
    status: 'published', locale: 'en'
  });

  const product4W = await strapi.documents('api::insurance-product.insurance-product').create({
    data: { productName: 'Car Insurance', identifier: 'FOURWHEELER', slug: 'car-insurance', lineOfBusiness: lobMoto.id },
    status: 'published', locale: 'en'
  });

  // 5. PLANS
  const planComp = await strapi.documents('api::insurance-plan.insurance-plan').create({
    data: { name: 'Comprehensive Package', identifier: 'PACKAGE', slug: 'comprehensive-package', insuranceProducts: [product2W.id, product4W.id], coverages: Object.values(coverageMap) },
    status: 'published', locale: 'en'
  });

  // 6. CCM PDF BUILDER (Semantic Mapping)
  const categories = [
    { name: 'Bike', sublob: 'TWOWHEELER' },
    { name: 'Car', sublob: 'FOURWHEELER' }
  ];

  const docTypes = ['policy_schedule', 'proposal_pdf', 'quote_pdf', 'premium_receipt', 'e_card'];

  for (const cat of categories) {
    for (const type of docTypes) {
      await strapi.documents('api::ccm-config.ccm-config').create({
        data: {
          templateName: `${cat.name} Template: ${type}`,
          documentType: type,
          sor_lob: 'MOTO',
          sor_sublob: cat.sublob,
          sor_package: 'PACKAGE',
          linkedPlan: planComp.id,
          sections: [
            { sectionTitle: 'Header', xmlTag: 'HEADER', content: [{ type: 'paragraph', children: [{ type: 'text', text: `Official ${cat.name} ${type} document.` }] }] },
            { sectionTitle: 'Coverages', xmlTag: 'COVERAGES', isDynamicCoverages: true }
          ],
          footerText: 'Kiwi Insurance Ltd.'
        },
        status: 'published', locale: 'en'
      });
    }
    console.log(`[Seed] Created full template suite for ${cat.name} (${cat.sublob})`);
  }

  console.log('✨ SUCCESS: DATA HYDRATED WITH SEMANTIC MAPPING (NO PRODUCT_ID).');
}
