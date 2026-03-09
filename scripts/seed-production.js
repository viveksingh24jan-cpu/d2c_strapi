
const fs = require('fs');
const path = require('path');

module.exports = async function seed(strapi) {
  console.log('🚀 Starting PRODUCTION SEED (Nodal Officer Registry Upgrade)...');

  // 1. CLEANUP
  const collections = [
    'api::page.page', 'api::navigation-menu.navigation-menu', 'api::insurance-product.insurance-product',
    'api::insurance-plan.insurance-plan', 'api::coverage.coverage', 'api::line-of-business.line-of-business',
    'api::ccm-config.ccm-config', 'api::state.state', 'api::nodal-officer.nodal-officer'
  ];
  for (const uid of collections) {
    try {
      const docs = await strapi.documents(uid).findMany({ locale: 'en', status: 'published' });
      for (const doc of docs) await strapi.documents(uid).delete({ documentId: doc.documentId, locale: 'en' });
      const draftDocs = await strapi.documents(uid).findMany({ locale: 'en', status: 'draft' });
      for (const doc of draftDocs) await strapi.documents(uid).delete({ documentId: doc.documentId, locale: 'en' });
    } catch (e) { }
  }

  // 2. STATE REGISTRY
  console.log('🇮🇳 Populating States...');
  const states = [
    { name: 'Maharashtra', code: 'MH', isUT: false },
    { name: 'Delhi', code: 'DL', isUT: true },
    { name: 'Karnataka', code: 'KA', isUT: false }
  ];
  const stateMap = {};
  for (const s of states) {
    const created = await strapi.documents('api::state.state').create({
      data: { name: s.name, code: s.code, isUT: s.isUT },
      status: 'published', locale: 'en'
    });
    stateMap[s.code] = created.id;
  }

  // 3. NODAL OFFICERS
  console.log('👮 Adding Nodal Officers...');
  const officers = [
    { name: 'Arun Kumar', state: 'MH', email: 'nodal.mh@kiwi.com', phone: '022-1234567', addr: 'Lotus Business Park, Mumbai', juris: 'All Maharashtra except Pune' },
    { name: 'Sanjay Patil', state: 'MH', email: 'nodal.pune@kiwi.com', phone: '020-7654321', addr: 'Shivaji Nagar, Pune', juris: 'Pune District' },
    { name: 'Meenakshi Sharma', state: 'DL', email: 'nodal.dl@kiwi.com', phone: '011-9988776', addr: 'Connaught Place, New Delhi', juris: 'Delhi NCR' }
  ];
  for (const o of officers) {
    await strapi.documents('api::nodal-officer.nodal-officer').create({
      data: {
        name: o.name,
        email: o.email,
        phone: o.phone,
        address: o.addr,
        jurisdiction: o.juris,
        state: stateMap[o.state]
      },
      status: 'published', locale: 'en'
    });
  }

  // 4. LOB & COVERAGES (Minimal for logic check)
  const lobMoto = await strapi.documents('api::line-of-business.line-of-business').create({ 
    data: { name: 'Motor Insurance', identifier: 'MOTO', slug: 'motor-insurance' },
    status: 'published', locale: 'en'
  });

  const createdCov = await strapi.documents('api::coverage.coverage').create({ 
    data: { name: 'Zero Depreciation', identifier: 'ZERO_DEP', type: 'addon', pdfDisplayName: 'Depreciation Waiver', pdfLegalWording: 'Full wording...' },
    status: 'published', locale: 'en'
  });

  const product4W = await strapi.documents('api::insurance-product.insurance-product').create({
    data: { productName: 'Car Insurance', identifier: 'FOURWHEELER', slug: 'car-insurance', lineOfBusiness: lobMoto.id },
    status: 'published', locale: 'en'
  });

  const planComp = await strapi.documents('api::insurance-plan.insurance-plan').create({
    data: { name: 'Comprehensive Package', identifier: 'PACKAGE', slug: 'comprehensive-package', insuranceProducts: [product4W.id], coverages: [createdCov.id] },
    status: 'published', locale: 'en'
  });

  // 5. CCM PDF BUILDER
  await strapi.documents('api::ccm-config.ccm-config').create({
    data: {
      templateName: 'Motor Policy Schedule',
      documentType: 'policy_schedule',
      sor_lob: 'MOTO',
      sor_sublob: 'FOURWHEELER',
      sor_package: 'PACKAGE',
      linkedPlan: planComp.id,
      sections: [{ sectionTitle: 'Coverages', xmlTag: 'COVERAGES', isDynamicCoverages: true }],
      footerText: 'Kiwi Insurance'
    },
    status: 'published', locale: 'en'
  });

  console.log('✨ SUCCESS: NODAL OFFICERS MAPPED TO STATES.');
}
