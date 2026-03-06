
const fs = require('fs');
const path = require('path');

module.exports = async function seed(strapi) {
  console.log('🚀 Starting PRODUCTION SEED with CCM PDF Mapping...');

  // 1. CLEANUP
  const collections = [
    'api::page.page', 'api::navigation-menu.navigation-menu', 'api::insurance-product.insurance-product',
    'api::insurance-plan.insurance-plan', 'api::coverage.coverage', 'api::line-of-business.line-of-business',
    'api::ccm-config.ccm-config'
  ];
  for (const uid of collections) {
    try {
      const docs = await strapi.documents(uid).findMany();
      for (const doc of docs) await strapi.documents(uid).delete({ documentId: doc.documentId });
    } catch (e) { }
  }

  // 2. LINES OF BUSINESS (LOB)
  const lobMoto = await strapi.documents('api::line-of-business.line-of-business').create({ 
    data: { name: 'Motor Insurance', identifier: 'MOTO', slug: 'motor-insurance', status: 'published' } 
  });

  // 3. COVERAGE REGISTRY (With PDF Metadata)
  console.log('📦 Populating Coverage Metadata for PDF...');
  const sorCoverages = [
    { code: 'LLTP_FLAG', name: 'Legal Liability to Third Party', type: 'default', pdfName: 'Legal Liability to Third Parties', wording: 'The Company will indemnify the insured against all sums which the insured shall become legally liable to pay...' },
    { code: 'PAOD_FLAG', name: 'CPA to owner driver', type: 'default', pdfName: 'Compulsory PA Cover for Owner-Driver', wording: 'The Company undertakes to pay compensation as per the following scale for bodily injury/death sustained by the owner-driver...' },
    { code: 'ZERO_DEP', name: 'Zero Depreciation', type: 'addon', pdfName: 'Depreciation Waiver Clause', wording: 'In consideration of the payment of additional premium, it is hereby agreed that the Company shall not deduct any amount for depreciation...' }
  ];

  const coverageMap = {};
  for (const c of sorCoverages) {
    const created = await strapi.documents('api::coverage.coverage').create({ 
      data: { 
        name: c.name, 
        identifier: c.code, 
        type: c.type, 
        pdfDisplayName: c.pdfName,
        pdfLegalWording: c.wording,
        status: 'published' 
      } 
    });
    coverageMap[c.code] = created.id;
  }

  // 4. PRODUCTS (4W)
  const product4W = await strapi.documents('api::insurance-product.insurance-product').create({
    data: { 
      productName: 'Car Insurance', identifier: '4W', slug: 'car-insurance', 
      lineOfBusiness: lobMoto.id, status: 'published' 
    }
  });

  // 5. PLANS (PACKAGE)
  const planComp = await strapi.documents('api::insurance-plan.insurance-plan').create({
    data: { 
      name: 'Comprehensive Package', identifier: 'PACKAGE', slug: 'comprehensive-package', 
      insuranceProducts: [product4W.id], 
      coverages: Object.values(coverageMap),
      status: 'published' 
    }
  });

  // 6. CCM PDF BUILDER (The Mapping Engine)
  console.log('📄 Creating PDF Template Mapping for SOR...');
  await strapi.documents('api::ccm-config.ccm-config').create({
    data: {
      templateName: 'Motor Private Car Policy Schedule',
      sor_lob: 'MOTO',
      sor_sublob: 'FOURWHEELER',
      sor_product_id: 35001,
      sor_package: 'PACKAGE',
      linkedPlan: planComp.id,
      sections: [
        { sectionTitle: 'Preamble', xmlTag: 'PREAMBLE', content: [{ type: 'paragraph', children: [{ type: 'text', text: 'Whereas the insured by a proposal and declaration which shall be the basis of this contract...' }] }] },
        { sectionTitle: 'Policy Schedule', xmlTag: 'SCHEDULE' },
        { sectionTitle: 'Coverages & Endorsements', xmlTag: 'COVERAGES', isDynamicCoverages: true },
        { sectionTitle: 'Signatures', xmlTag: 'SIGNATURES', showSignature: true }
      ],
      footerText: 'Registered Office: Mumbai. IRDAI Reg No: 123.',
      status: 'published'
    }
  });

  console.log('✨ SUCCESS: PDF BUILDER AREA CONFIGURED AND MAPPED.');
}
