'use strict';

/**
 * 🥝 Kiwi General Insurance Limited - MASTER PRODUCTION SEED
 * Role: CMS Architect | SEO Expert | Marketing Lead
 * Focus: High-Conversion, IRDAI Compliance, Strategic Linking
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

  console.log('\n🥝 KIWI GENERAL INSURANCE - ENTERPRISE STRATEGIC SEEDING...\n');

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

    // 1. CORPORATE LEADERSHIP (The Board)
    console.log('  -> Seeding Executive Board...');
    const board = [
      { name: 'Neelesh Garg', designation: 'Director', category: 'Board', bio: 'Veteran insurance leader with over 2 decades of experience.' },
      { name: 'Sumir Chadha', designation: 'Director', category: 'Board', bio: 'Visionary investor and co-founder of WestBridge Capital.' },
      { name: 'Thomson Kadantot Thomas', designation: 'Director', category: 'Board', bio: 'Technology and operations expert in financial services.' },
      { name: 'Sumit Bose', designation: 'Director', category: 'Board', bio: 'Former Finance Secretary, Government of India.' },
      { name: 'Bhama Krishnamurthy', designation: 'Director', category: 'Board', bio: 'Renowned expert in Indian banking and insurance regulation.' },
      { name: 'Deepak Ramineedi', designation: 'Director', category: 'Board', bio: 'Specialist in growth-stage financial technology investments.' }
    ];
    for (const member of board) {
      await createEntry('api::leadership-profile.leadership-profile', {
        ...member, bio: blocks(member.bio), 
        socialLinks: [{ platform: 'linkedin', url: `https://linkedin.com/in/${member.name.toLowerCase().replace(/\s+/g, '')}` }]
      });
    }

    // 2. PRODUCT REGISTRY (Marketing & Compliance Unified)
    console.log('  -> Seeding Unified Product Registry (SSOT)...');
    const p_car = await createEntry('api::insurance-product.insurance-product', {
      productName: 'Comprehensive Car Insurance', tagline: 'Protect your pride and joy', 
      startingPrice: 2094, isActive: true, sortOrder: 1, ctaText: 'Get Free Quote', ctaUrl: '/car-insurance',
      isStandard: false, productType: 'generic'
    });
    const p_arogya = await createEntry('api::insurance-product.insurance-product', {
      productName: 'Arogya Sanjeevani', tagline: 'Government-mandated standard health cover', 
      startingPrice: 3500, isActive: true, sortOrder: 2, ctaText: 'View Standard Plan', ctaUrl: '/health/arogya',
      isStandard: true, productType: 'arogya-sanjeevani',
      complianceFeatures: blocks('Sum Insured up to 10 Lakhs. 5% Cumulative bonus for claim-free years.')
    });
    const p_home = await createEntry('api::insurance-product.insurance-product', {
      productName: 'Bharat Griha Raksha', tagline: 'Standard protection for your home', 
      startingPrice: 499, isActive: true, sortOrder: 3, ctaText: 'Protect Home', ctaUrl: '/home/standard',
      isStandard: true, productType: 'bharat-griha-raksha'
    });

    // 3. SHARED ATOMIC SECTIONS (Reusability)
    console.log('  -> Creating Atomic Shared Sections...');
    const helpSec = await createEntry('api::shared-section.shared-section', {
      title: 'Global Help & Claims Support',
      blocks: [
        { 
          __component: 'page-builder.banner', 
          title: 'Claims Assistance 24/7',
          description: 'Call us at 1800-123-4567 or email care@kiwiinsurance.in for lightning-fast settlements.',
          cta: { label: 'File a Claim', url: '/claims/file', variant: 'primary' }
        }
      ]
    });

    // 4. DYNAMIC LANDING PAGES (SEO Optimized)
    console.log('  -> Seeding SEO-Optimized Landing Pages...');
    const homePage = await createEntry('api::page.page', {
      title: 'Kiwi General Insurance - India\'s New-Age Insurer',
      slug: 'home',
      template: 'home',
      seo: { meta_title: 'Kiwi General Insurance | Simple, Smart, Digital Insurance', meta_description: 'Get instant quotes for Car, Health, and Home insurance with Kiwi. India\'s most transparent insurer.' },
      content: [
        { __component: 'page-builder.hero-section', title: 'Insuring India,\nOne Family at a Time', subtitle: 'Experience paperless insurance with 99.2% claim settlement ratio.', layout: 'left-right' },
        { __component: 'page-builder.stats-bar', title: 'Why Indians Trust Kiwi', stats: [{ label: 'Happy Customers', value: '50L+' }, { label: 'Claim Ratio', value: '99.2%' }, { label: 'Network Hospitals', value: '10K+' }] },
        { 
          __component: 'page-builder.card-grid', 
          title: 'Our Featured Products',
          cards: [
            { title: 'Car Insurance', description: 'Zero-depreciation cover.', icon: 'car', link: { label: 'Learn More', url: '/car' } },
            { title: 'Health Insurance', description: 'Tax benefits u/s 80D.', icon: 'heart', link: { label: 'Learn More', url: '/health' } }
          ]
        },
        { 
          __component: 'page-builder.insurance-product-cta', 
          product: { connect: [{ documentId: p_car.documentId }] }, 
          variant: 'card' 
        },
        { 
          __component: 'page-builder.insurance-product-cta', 
          product: { connect: [{ documentId: p_arogya.documentId }] }, 
          variant: 'banner',
          customTitle: 'Standard Policy: Arogya Sanjeevani',
          customSubtitle: 'Government Mandated Essential Health Cover'
        },
        { 
          __component: 'shared.section-reference', 
          shared_section: { connect: [{ documentId: helpSec.documentId }] } 
        }
      ]
    });

    // 5. INFRASTRUCTURE & GEO-LOCATION
    console.log('  -> Seeding Bangalore HQ & Regional Offices...');
    await createEntry('api::branch.branch', { 
      branchName: 'Kiwi Corporate HQ - Bangalore', 
      branchType: 'head-office', 
      city: 'Bangalore', 
      address: blocks('Koramangala 8th Block, Bangalore South, Karnataka, India - 560095'),
      latitude: 12.9352, longitude: 77.6245,
      email: 'hq@kiwiinsurance.in', phone: '080-6600-XXXX'
    });

    // 6. GLOBAL BRAIN (Compliance & SEO SSOT)
    console.log('  -> Updating Global Config (CIN & Regulatory)...');
    await updateSingle('api::global-config.global-config', {
      siteName: 'Kiwi General Insurance',
      siteDescription: 'Kiwi General Insurance Limited | Corporate Identification Number (CIN): U65120KA2024PLC194560',
      irdaiRegNumber: 'Applied / In-Process',
      cinNumber: 'U65120KA2024PLC194560',
      registeredAddress: 'Koramangala 8th Block, Bangalore South, Karnataka, India',
      headerPhoneNumber: '1800-123-4567',
      footerCopyright: `© ${new Date().getFullYear()} Kiwi General Insurance Limited. All rights reserved.`,
      section41Warning: blocks('Section 41 of the Insurance Act, 1938: Prohibition of Rebates.')
    });

    // 7. NAVIGATION (4-Level Architecture)
    console.log('  -> Seeding 4-Level Navigation...');
    const n1 = await createEntry('api::navigation-menu.navigation-menu', { label: 'Insurance Plans', location: 'header' });
    const n2 = await createEntry('api::navigation-menu.navigation-menu', { label: 'Health', parent: { connect: [{ documentId: n1.documentId }] } });
    const n3 = await createEntry('api::navigation-menu.navigation-menu', { label: 'Family Floater', parent: { connect: [{ documentId: n2.documentId }] } });
    await createEntry('api::navigation-menu.navigation-menu', { label: 'Assurance Plus', url: '/health/plus', parent: { connect: [{ documentId: n3.documentId }] } });

    // 8. SET PUBLIC PERMISSIONS
    console.log('  -> Setting Production Permissions...');
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

    console.log('\n✅ KIWI GENERAL INSURANCE - PRODUCTION SEED COMPLETE!\n');
  } catch (err) { console.error('\n❌ Seed failed:', err); }

  await app.destroy();
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
