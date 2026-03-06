
const fs = require('fs');
const path = require('path');

module.exports = async function seed(strapi) {
  console.log('🚀 Starting PRODUCTION SEED with Multi-Document CCM Support (Locale: en)...');

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

  // 2. LINES OF BUSINESS (LOB)
  const lobMoto = await strapi.documents('api::line-of-business.line-of-business').create({ 
    data: { name: 'Motor Insurance', identifier: 'MOTO', slug: 'motor-insurance' },
    status: 'published',
    locale: 'en'
  });

  // 3. COVERAGE REGISTRY
  console.log('📦 Populating Coverage Registry...');
  const sorCoverages = [
    { code: 'LLTP_FLAG', name: 'Legal Liability to Third Party', type: 'default', pdfName: 'Legal Liability to Third Parties', wording: 'The Company will indemnify the insured...' },
    { code: 'PAOD_FLAG', name: 'CPA to owner driver', type: 'default', pdfName: 'Compulsory PA Cover', wording: 'The Company undertakes to pay...' },
    { code: 'ZERO_DEP', name: 'Zero Depreciation', type: 'addon', pdfName: 'Depreciation Waiver Clause', wording: 'We shall not deduct any amount...' }
  ];

  const coverageMap = {};
  for (const c of sorCoverages) {
    const created = await strapi.documents('api::coverage.coverage').create({ 
      data: { 
        name: c.name, 
        identifier: c.code, 
        type: c.type, 
        pdfDisplayName: c.pdfName,
        pdfLegalWording: c.wording
      },
      status: 'published',
      locale: 'en'
    });
    coverageMap[c.code] = created.id;
  }

  // 4. PRODUCTS (4W)
  const product4W = await strapi.documents('api::insurance-product.insurance-product').create({
    data: { productName: 'Car Insurance', identifier: '4W', slug: 'car-insurance', lineOfBusiness: lobMoto.id },
    status: 'published',
    locale: 'en'
  });

  // 5. PLANS (PACKAGE)
  const planComp = await strapi.documents('api::insurance-plan.insurance-plan').create({
    data: { name: 'Comprehensive Package', identifier: 'PACKAGE', slug: 'comprehensive-package', insuranceProducts: [product4W.id], coverages: Object.values(coverageMap) },
    status: 'published',
    locale: 'en'
  });

  // 6. CCM PDF BUILDER (Multiple Document Types)
  console.log('📄 Creating PDF Templates...');
  
  const docTypes = ['policy_schedule', 'proposal_pdf', 'quote_pdf', 'premium_receipt', 'e_card'];
  
  for (const type of docTypes) {
    const created = await strapi.documents('api::ccm-config.ccm-config').create({
      data: {
        templateName: `Motor Template: ${type}`,
        documentType: type,
        sor_lob: 'MOTO',
        sor_sublob: 'FOURWHEELER',
        sor_product_id: 35001,
        sor_package: 'PACKAGE',
        linkedPlan: planComp.id,
        sections: [
          { sectionTitle: 'Header Section', xmlTag: 'HEADER', content: [{ type: 'paragraph', children: [{ type: 'text', text: `This is a ${type} document.` }] }] },
          { sectionTitle: 'Dynamic Coverages', xmlTag: 'COVERAGES', isDynamicCoverages: true }
        ],
        footerText: 'Registered Office: Mumbai.'
      },
      status: 'published',
      locale: 'en'
    });
    console.log(`[Seed] Created ${type}: ${created.documentId} (PID: 35001, PKG: PACKAGE)`);
  }

  console.log('✨ SUCCESS: ALL DOCUMENT TYPES HYDRATED AND PUBLISHED.');
}
