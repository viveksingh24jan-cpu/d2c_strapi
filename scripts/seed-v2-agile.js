'use strict';

/**
 * 🥝 KIWI D2C AGILE MATRIX SEED (v2.0)
 * LOB > Product > Plan > Coverage | Shadowing & Fallback
 */

function blocks(text) {
  return [{ type: 'paragraph', children: [{ type: 'text', text }] }];
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

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';

  console.log('\n🚀 SEEDING AGILE D2C MATRIX...\n');

  try {
    const collections = [
      'api::line-of-business.line-of-business',
      'api::insurance-product.insurance-product',
      'api::insurance-plan.insurance-plan',
      'api::coverage.coverage'
    ];
    for (const uid of collections) await deleteAll(uid);

    // 1. MASTER COVERAGE REGISTRY (The Source of Truth)
    console.log('  -> Master Coverage Registry');
    const c_zerodep = await createEntry('api::coverage.coverage', {
      name: 'Zero Depreciation',
      identifiers: ['ZERO_DEP_FLAG', 'ZD_ADDON'],
      type: 'addon',
      heading: 'Zero Depreciation Cover',
      benefitHeadline: '100% payout on parts replacement',
      infoTooltip: 'Avoid depreciation cuts during claims.',
      limitValue: 'Unlimited',
      unitLabel: 'times',
      isRecommended: true,
      badge: 'Best Seller',
      seo: { metaTitle: 'Zero Dep Insurance Cover', metaDescription: 'Get 100% claim payout.' },
      comparisonGrid: { gridLabel: 'Zero Dep', showInGrid: true, displayValue: 'Included' }
    });

    const c_volded = await createEntry('api::coverage.coverage', {
      name: 'Voluntary Deductible',
      identifiers: ['VOLDED_FLAG', 'VOL_DED_5000'],
      type: 'discount',
      heading: 'Voluntary Deductible',
      benefitHeadline: 'Lower your premium instantly',
      infoTooltip: 'Opt to pay a small amount during claims to save on premium.',
      addonCostLabel: 'Save up to ₹2,500',
      comparisonGrid: { gridLabel: 'Discount', showInGrid: true, displayValue: 'Save Premium' }
    });

    // 2. LINE OF BUSINESS (LOB)
    console.log('  -> Line of Business');
    const lobMotor = await createEntry('api::line-of-business.line-of-business', {
      name: 'Motor Insurance',
      identifier: 'MOTOR',
      slug: 'motor-insurance',
      heroHeading: 'Drive with Confidence',
      heroDescription: 'Instant policies for 4W, 2W and CV.',
      seo: { metaTitle: 'Motor Insurance India', metaDescription: 'Buy car and bike insurance online.' },
      cta: { labelText: 'Get Quote', actionUrl: '/motor/quote' }
    });

    // 3. INSURANCE PRODUCTS (Vehicle Master)
    console.log('  -> Insurance Products (4W & 2W)');
    const p_4w = await createEntry('api::insurance-product.insurance-product', {
      productName: '4 Wheeler Insurance',
      identifier: '4W',
      slug: 'car-insurance',
      lineOfBusiness: { connect: [{ documentId: lobMotor.documentId }] },
      cardHeading: 'Protect Your Car',
      cardDescription: 'Comprehensive plans for private cars.',
      heroHeading: 'The Ultimate Car Cover',
      seo: { metaTitle: 'Car Insurance Online', metaDescription: 'Save 85% on car insurance premiums.' },
      uiConfig: { isVisibleOnHomepage: true, sortOrder: 1 }
    });

    const p_2w = await createEntry('api::insurance-product.insurance-product', {
      productName: '2 Wheeler Insurance',
      identifier: '2W',
      slug: 'bike-insurance',
      lineOfBusiness: { connect: [{ documentId: lobMotor.documentId }] },
      cardHeading: 'Protect Your Bike',
      cardDescription: 'Affordable plans for your two-wheeler.',
      heroHeading: 'Bike Insurance Made Simple',
      uiConfig: { isVisibleOnHomepage: true, sortOrder: 2 }
    });

    // 4. INSURANCE PLANS (Tenure & Policy)
    console.log('  -> Insurance Plans (1+3, 1+5)');
    await createEntry('api::insurance-plan.insurance-plan', {
      name: 'Comprehensive 1+3',
      identifier: '4W_COMP_1_3',
      slug: 'comp-1-3',
      odTerm: 1,
      tpTerm: 3,
      insuranceProducts: { connect: [{ documentId: p_4w.documentId }] },
      badge: 'Best for New Cars',
      mainHeading: 'Elite Protection for 1+3 Years',
      benefitSummary: '1 year Own Damage + 3 years Third Party coverage.',
      inclusions: [
        { coverage: { connect: [{ documentId: c_zerodep.documentId }] }, isIncluded: true }
      ],
      discounts: [
        { coverage: { connect: [{ documentId: c_volded.documentId }] }, isIncluded: false, titleOverride: 'Smart Savings' }
      ],
      cta: { labelText: 'Select Elite Plan', actionUrl: '/checkout/4w/comp-1-3' }
    });

    await createEntry('api::insurance-plan.insurance-plan', {
      name: 'Bike Comp 1+5',
      identifier: '2W_COMP_1_5',
      slug: 'bike-comp-1-5',
      odTerm: 1,
      tpTerm: 5,
      insuranceProducts: { connect: [{ documentId: p_2w.documentId }] },
      badge: 'Mandatory for New Bikes',
      mainHeading: 'Full Cover for 5 Years',
      benefitSummary: 'Worry-free riding for half a decade.',
      addons: [
        { coverage: { connect: [{ documentId: c_zerodep.documentId }] }, isIncluded: false }
      ],
      cta: { labelText: 'Select Bike Plan', actionUrl: '/checkout/2w/comp-1-5' }
    });

    // 5. PERMISSIONS (Public Access)
    console.log('  -> Setting API Permissions');
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
    const apis = ['line-of-business', 'insurance-product', 'insurance-plan', 'coverage'];
    for (const api of apis) {
      for (const action of ['find', 'findOne']) {
        await strapi.query('plugin::users-permissions.permission').create({
          data: { action: `api::${api}.${api}.${action}`, role: publicRole.id }
        });
      }
    }

    console.log('\n✅ SEEDING COMPLETE! Your Agile Matrix is live.\n');
  } catch (err) { console.error('\n❌ Seed failed:', err); }

  await app.destroy();
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
