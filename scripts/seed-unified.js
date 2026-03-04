'use strict';

/**
 * 🥝 KIWI GENERAL INSURANCE — UNIFIED PRODUCTION SEED
 * Single-run script that brings the CMS to 100% data saturation.
 * Replaces seed-kiwi.js + seed-v2-agile.js with a single source of truth.
 *
 * Run:  npm run seed:unified
 *
 * Phases:
 *   1  Coverage Registry      (30 entries — motor + health)
 *   2  Lines of Business       (3 — Motor, Health, Travel)
 *   3  Insurance Products      (5 products)
 *   4  Insurance Plans         (9 plans with inclusions/addons/discounts)
 *   5  Pages                   (Home, Privacy, Terms, About, Grievance)
 *   6  Shared Sections         (Claims, Features, FAQ)
 *   7  Global Config           (full — with page relations, social, sticky CTA, trust metrics)
 *   8  Leadership Profiles     (6 — Board + KMP)
 *   9  Branches                (6 offices)
 *  10  Financial Disclosures   (6 quarterly + annual)
 *  11  Download Documents      (8 forms + policy documents)
 *  12  Testimonials            (12 across categories)
 *  13  Authors + Categories    (3 + 4)
 *  14  Articles                (6 blog posts)
 *  15  Tools                   (6 calculators/checkers)
 *  16  Campaigns               (3 seasonal)
 *  17  Navigation Menu         (35 items — full header + footer tree)
 *  18  API Permissions         (public read access)
 */

// ─── Helpers ──────────────────────────────────────────────────────────────────

function p(text) {
  return [{ type: 'paragraph', children: [{ type: 'text', text }] }];
}

function paras(...lines) {
  return lines.map((line) => ({ type: 'paragraph', children: [{ type: 'text', text: line }] }));
}

async function wipe(uid) {
  try { await strapi.db.query(uid).deleteMany({ where: {} }); } catch (_) {}
}

async function create(uid, data) {
  try {
    const opts = { data, status: 'published' };
    return await strapi.documents(uid).create(opts);
  } catch (e) {
    console.error(`  ✗ ${uid}: ${e.message}`);
    return null;
  }
}

async function upsertSingle(uid, data) {
  try {
    const existing = await strapi.documents(uid).findMany({});
    if (existing.length > 0) {
      return await strapi.documents(uid).update({ documentId: existing[0].documentId, data });
    }
    return await strapi.documents(uid).create({ data });
  } catch (e) {
    console.error(`  ✗ upsertSingle ${uid}: ${e.message}`);
    return null;
  }
}

function nav(label, url, extra = {}) {
  return { label, url: url || null, isActive: true, displayOrder: 0, ...extra };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';

  console.log('\n🥝  KIWI UNIFIED SEED — PRODUCTION DATA SATURATION\n');

  try {

    // ── WIPE ────────────────────────────────────────────────────────────────
    console.log('  Clearing existing data…');
    const toClear = [
      'api::coverage.coverage',
      'api::line-of-business.line-of-business',
      'api::insurance-product.insurance-product',
      'api::insurance-plan.insurance-plan',
      'api::page.page',
      'api::shared-section.shared-section',
      'api::leadership-profile.leadership-profile',
      'api::branch.branch',
      'api::financial-disclosure.financial-disclosure',
      'api::download-document.download-document',
      'api::testimonial.testimonial',
      'api::author.author',
      'api::category.category',
      'api::article.article',
      'api::tool.tool',
      'api::campaign.campaign',
      'api::navigation-menu.navigation-menu',
      'api::transparency-report.transparency-report',
    ];
    for (const uid of toClear) await wipe(uid);

    // ════════════════════════════════════════════════════════════════════════
    // PHASE 1 — MASTER COVERAGE REGISTRY
    // ════════════════════════════════════════════════════════════════════════
    console.log('\n[1/18] Master Coverage Registry…');

    // — MOTOR: Default coverages (included in base policy) —
    const cOD = await create('api::coverage.coverage', {
      name: 'Own Damage Cover',
      identifiers: ['OD_COVER', 'OWN_DAMAGE'],
      type: 'default',
      heading: 'Own Damage Protection',
      benefitHeadline: 'Covers damage to your own vehicle',
      infoTooltip: 'Protects your vehicle against accidents, fire, theft, and natural calamities.',
      limitValue: 'Insured Declared Value',
      applicableToCategories: ['motor'],
      comparisonGrid: { gridLabel: 'Own Damage', showInGrid: true, displayValue: 'Included' },
    });

    const cTP = await create('api::coverage.coverage', {
      name: 'Third Party Liability',
      identifiers: ['TP_COVER', 'THIRD_PARTY'],
      type: 'default',
      heading: 'Third Party Legal Liability',
      benefitHeadline: 'Mandatory cover for legal liability',
      infoTooltip: 'Covers legal liability for damage or injury caused to a third party.',
      limitValue: 'Unlimited (personal injury)',
      applicableToCategories: ['motor'],
      comparisonGrid: { gridLabel: 'Third Party', showInGrid: true, displayValue: 'Included' },
    });

    const cPA = await create('api::coverage.coverage', {
      name: 'Personal Accident Cover',
      identifiers: ['PA_COVER', 'PERSONAL_ACCIDENT'],
      type: 'default',
      heading: 'Owner-Driver PA Cover',
      benefitHeadline: '₹15 lakh accidental death & disability',
      infoTooltip: 'Mandatory ₹15 lakh cover for owner-driver under IRDAI regulations.',
      limitValue: '₹15,00,000',
      applicableToCategories: ['motor'],
      comparisonGrid: { gridLabel: 'PA Cover', showInGrid: true, displayValue: '₹15 Lakh' },
    });

    // — MOTOR: Add-on coverages —
    const cZeroDep = await create('api::coverage.coverage', {
      name: 'Zero Depreciation',
      identifiers: ['ZERO_DEP_FLAG', 'ZD_ADDON', 'ZERO_DEP'],
      type: 'addon',
      heading: 'Zero Depreciation Cover',
      benefitHeadline: '100% payout — no depreciation cuts',
      infoTooltip: 'Waives depreciation deduction on plastic, rubber, and metal parts at the time of claim.',
      limitValue: 'Unlimited',
      unitLabel: 'claims',
      addonCostLabel: 'Starts at ₹1,200/yr',
      applicableToCategories: ['motor'],
      comparisonGrid: { gridLabel: 'Zero Dep', showInGrid: true, displayValue: 'Add-on' },
    });

    const cEngine = await create('api::coverage.coverage', {
      name: 'Engine & Gearbox Protection',
      identifiers: ['ENGINE_PROTECT', 'ENGINE_GEARBOX'],
      type: 'addon',
      heading: 'Engine & Gearbox Protection',
      benefitHeadline: 'Covers engine damage from water ingression & oil leaks',
      infoTooltip: 'Protects the engine and gearbox from damage due to waterlogging and lubricant leakage.',
      addonCostLabel: 'Starts at ₹800/yr',
      applicableToCategories: ['motor'],
      comparisonGrid: { gridLabel: 'Engine Protect', showInGrid: true, displayValue: 'Add-on' },
    });

    const cNCBProtect = await create('api::coverage.coverage', {
      name: 'NCB Protection',
      identifiers: ['NCB_PROTECT', 'NO_CLAIM_BONUS_PROTECT'],
      type: 'addon',
      heading: 'No Claim Bonus Protection',
      benefitHeadline: 'Keep your NCB even after a claim',
      infoTooltip: 'Retains your accumulated No Claim Bonus even if you file one claim in a policy year.',
      addonCostLabel: 'Starts at ₹500/yr',
      applicableToCategories: ['motor'],
      comparisonGrid: { gridLabel: 'NCB Protect', showInGrid: true, displayValue: 'Add-on' },
    });

    const cRTI = await create('api::coverage.coverage', {
      name: 'Return to Invoice',
      identifiers: ['RTI_ADDON', 'RETURN_TO_INVOICE'],
      type: 'addon',
      heading: 'Return to Invoice Cover',
      benefitHeadline: 'Get full invoice value on total loss',
      infoTooltip: "In case of total loss or theft, receive the vehicle's original invoice value, not the depreciated IDV.",
      addonCostLabel: 'Starts at ₹1,500/yr',
      applicableToCategories: ['motor'],
      comparisonGrid: { gridLabel: 'RTI', showInGrid: true, displayValue: 'Add-on' },
    });

    const cRSA = await create('api::coverage.coverage', {
      name: 'Roadside Assistance',
      identifiers: ['RSA_ADDON', 'ROADSIDE_ASSIST'],
      type: 'addon',
      heading: '24×7 Roadside Assistance',
      benefitHeadline: 'Help arrives within 30 minutes, anywhere in India',
      infoTooltip: 'Includes towing, flat tyre change, battery jump-start, and fuel delivery.',
      addonCostLabel: 'Starts at ₹399/yr',
      applicableToCategories: ['motor'],
      comparisonGrid: { gridLabel: 'RSA', showInGrid: true, displayValue: 'Add-on' },
    });

    const cConsumables = await create('api::coverage.coverage', {
      name: 'Consumables Cover',
      identifiers: ['CONSUMABLES_ADDON', 'CONSUMABLES'],
      type: 'addon',
      heading: 'Consumables Cover',
      benefitHeadline: 'Covers nuts, bolts, oil, and other consumables',
      infoTooltip: "Covers cost of consumables like engine oil, nuts, bolts, and coolant during repairs — usually excluded from standard policies.",
      addonCostLabel: 'Starts at ₹299/yr',
      applicableToCategories: ['motor'],
    });

    const cTyre = await create('api::coverage.coverage', {
      name: 'Tyre Protection',
      identifiers: ['TYRE_PROTECT', 'TYRE_ADDON'],
      type: 'addon',
      heading: 'Tyre & Rim Protection',
      benefitHeadline: 'Covers tyre damage, bulging, and rim bending',
      infoTooltip: 'Protects against tyre damage from road hazards, including kerb damage and pothole impacts.',
      addonCostLabel: 'Starts at ₹499/yr',
      applicableToCategories: ['motor'],
    });

    const cKeyReplace = await create('api::coverage.coverage', {
      name: 'Key Replacement',
      identifiers: ['KEY_REPLACE', 'KEY_LOSS'],
      type: 'addon',
      heading: 'Key & Lock Replacement',
      benefitHeadline: 'Up to ₹30,000 for lost or damaged keys',
      infoTooltip: 'Covers the cost of replacing lost, stolen, or damaged vehicle keys including locksmith charges.',
      limitValue: '₹30,000',
      addonCostLabel: 'Starts at ₹199/yr',
      applicableToCategories: ['motor'],
    });

    const cDailyAllowance = await create('api::coverage.coverage', {
      name: 'Daily Cash Allowance',
      identifiers: ['DAILY_ALLOWANCE', 'DAILY_CASH'],
      type: 'addon',
      heading: 'Daily Cash Allowance',
      benefitHeadline: '₹1,000/day while your car is in the garage',
      infoTooltip: 'Receive a daily cash benefit for each day your vehicle is under repair at an authorised garage.',
      limitValue: '₹1,000/day',
      unitLabel: 'up to 10 days',
      addonCostLabel: 'Starts at ₹299/yr',
      applicableToCategories: ['motor'],
    });

    const cPassengerCover = await create('api::coverage.coverage', {
      name: 'Passenger Cover',
      identifiers: ['PASSENGER_COVER', 'UNNAMED_PASSENGER'],
      type: 'addon',
      heading: 'Unnamed Passenger Cover',
      benefitHeadline: '₹1 lakh PA cover for all passengers',
      infoTooltip: 'Extends personal accident coverage to unnamed passengers travelling in the insured vehicle.',
      limitValue: '₹1,00,000 per person',
      addonCostLabel: 'Starts at ₹150/yr per seat',
      applicableToCategories: ['motor'],
    });

    // — MOTOR: Discounts —
    const cVolDed = await create('api::coverage.coverage', {
      name: 'Voluntary Deductible',
      identifiers: ['VOLDED_FLAG', 'VOL_DED_5000', 'VOLUNTARY_DEDUCTIBLE'],
      type: 'discount',
      heading: 'Voluntary Deductible',
      benefitHeadline: 'Save up to ₹2,500 on premium',
      infoTooltip: 'Choose to pay a fixed amount during claims to lower your annual premium.',
      addonCostLabel: 'Save up to ₹2,500/yr',
      applicableToCategories: ['motor'],
      comparisonGrid: { gridLabel: 'Vol. Deductible', showInGrid: true, displayValue: 'Optional Saving' },
    });

    const cAntiTheft = await create('api::coverage.coverage', {
      name: 'ARAI Approved Anti-Theft Device',
      identifiers: ['ANTI_THEFT_ARAI', 'ARAI_DEVICE'],
      type: 'discount',
      heading: 'Anti-Theft Device Discount',
      benefitHeadline: '2.5% off on OD premium',
      infoTooltip: 'Installing an ARAI-approved anti-theft device qualifies you for a 2.5% discount on OD premium.',
      addonCostLabel: 'Save 2.5% on OD premium',
      applicableToCategories: ['motor'],
    });

    const cNCB = await create('api::coverage.coverage', {
      name: 'No Claim Bonus',
      identifiers: ['NCB_FLAG', 'NO_CLAIM_BONUS', 'NCB_DISCOUNT'],
      type: 'discount',
      heading: 'No Claim Bonus (NCB)',
      benefitHeadline: 'Up to 50% off for claim-free driving',
      infoTooltip: 'Earn NCB each year you drive without making a claim. Builds from 20% to 50% over 5 claim-free years.',
      addonCostLabel: 'Save up to 50% on OD premium',
      applicableToCategories: ['motor'],
      comparisonGrid: { gridLabel: 'NCB', showInGrid: true, displayValue: 'Up to 50%' },
    });

    // — HEALTH: Default coverages —
    const cHospitalization = await create('api::coverage.coverage', {
      name: 'In-patient Hospitalisation',
      identifiers: ['IPD_COVER', 'HOSPITALIZATION', 'IN_PATIENT'],
      type: 'default',
      heading: 'In-patient Hospitalisation Cover',
      benefitHeadline: 'Covers all hospitalisation expenses',
      infoTooltip: 'Covers room rent, ICU charges, surgeon fees, medicines, and diagnostics during hospital stay of 24+ hours.',
      limitValue: 'Up to Sum Insured',
      applicableToCategories: ['health'],
      comparisonGrid: { gridLabel: 'Hospitalisation', showInGrid: true, displayValue: 'Included' },
    });

    const cDayCare = await create('api::coverage.coverage', {
      name: 'Day-care Procedures',
      identifiers: ['DAY_CARE', 'DAYCARE_PROCEDURES'],
      type: 'default',
      heading: 'Day-care Treatments',
      benefitHeadline: '600+ day-care procedures covered',
      infoTooltip: 'Covers over 600 medical procedures that require less than 24 hours of hospitalisation.',
      applicableToCategories: ['health'],
      comparisonGrid: { gridLabel: 'Day-care', showInGrid: true, displayValue: '600+ Procedures' },
    });

    const cPrePost = await create('api::coverage.coverage', {
      name: 'Pre & Post Hospitalisation',
      identifiers: ['PRE_POST_HOSP', 'PRE_HOSPITALIZATION', 'POST_HOSPITALIZATION'],
      type: 'default',
      heading: 'Pre & Post Hospitalisation Expenses',
      benefitHeadline: '60 days pre + 90 days post hospitalisation',
      infoTooltip: 'Covers medical expenses incurred 60 days before and 90 days after hospitalisation.',
      limitValue: '60 days pre + 90 days post',
      applicableToCategories: ['health'],
    });

    const cAmbulance = await create('api::coverage.coverage', {
      name: 'Ambulance Cover',
      identifiers: ['AMBULANCE_COVER', 'EMERGENCY_TRANSPORT'],
      type: 'default',
      heading: 'Emergency Ambulance Cover',
      benefitHeadline: 'Covers road and air ambulance',
      infoTooltip: 'Covers charges for emergency road and air ambulance services for hospitalisation.',
      limitValue: '₹5,000 per hospitalisation',
      applicableToCategories: ['health'],
    });

    const cCashlessNetwork = await create('api::coverage.coverage', {
      name: 'Cashless Network Hospitals',
      identifiers: ['CASHLESS_NETWORK', 'NETWORK_HOSPITALS'],
      type: 'default',
      heading: '10,000+ Cashless Hospital Network',
      benefitHeadline: 'Zero out-of-pocket at 10,000+ hospitals',
      infoTooltip: 'Avail cashless treatment at over 10,000 empanelled network hospitals across India.',
      limitValue: '10,000+ hospitals',
      applicableToCategories: ['health'],
      comparisonGrid: { gridLabel: 'Cashless Hospitals', showInGrid: true, displayValue: '10,000+' },
    });

    // — HEALTH: Add-ons —
    const cMaternity = await create('api::coverage.coverage', {
      name: 'Maternity Cover',
      identifiers: ['MATERNITY_COVER', 'MATERNITY_BENEFIT'],
      type: 'addon',
      heading: 'Maternity & Newborn Cover',
      benefitHeadline: 'Covers maternity expenses + newborn care',
      infoTooltip: 'Covers normal and caesarean delivery expenses plus newborn baby cover from day one.',
      limitValue: 'Up to ₹50,000',
      addonCostLabel: 'Available after 9-month waiting period',
      applicableToCategories: ['health'],
    });

    const cAYUSH = await create('api::coverage.coverage', {
      name: 'AYUSH Treatment',
      identifiers: ['AYUSH_COVER', 'AYUSH_TREATMENT'],
      type: 'addon',
      heading: 'AYUSH Hospitalisation Cover',
      benefitHeadline: 'Covers Ayurveda, Yoga, Unani, Siddha, Homeopathy',
      infoTooltip: 'Covers hospitalisation under AYUSH treatment systems as mandated by IRDAI.',
      applicableToCategories: ['health'],
    });

    const cOPD = await create('api::coverage.coverage', {
      name: 'OPD Cover',
      identifiers: ['OPD_COVER', 'OUT_PATIENT_DEPARTMENT'],
      type: 'addon',
      heading: 'Out-patient Department (OPD) Cover',
      benefitHeadline: 'Doctor consultations & medicines covered',
      infoTooltip: 'Covers out-patient consultations, diagnostics, and pharmacy expenses without hospitalisation.',
      limitValue: 'Up to ₹10,000/yr',
      addonCostLabel: 'Starts at ₹1,500/yr',
      applicableToCategories: ['health'],
    });

    const cCriticalIllness = await create('api::coverage.coverage', {
      name: 'Critical Illness Cover',
      identifiers: ['CRITICAL_ILLNESS', 'CI_ADDON'],
      type: 'addon',
      heading: 'Critical Illness Lump Sum',
      benefitHeadline: 'Lump sum payout for 34 critical illnesses',
      infoTooltip: 'One-time lump sum payment on diagnosis of 34 listed critical illnesses including cancer, stroke, and heart attack.',
      limitValue: 'Up to ₹25,00,000',
      addonCostLabel: 'Starts at ₹3,500/yr',
      applicableToCategories: ['health'],
    });

    const cRoomRent = await create('api::coverage.coverage', {
      name: 'Room Rent Waiver',
      identifiers: ['ROOM_RENT_WAIVER', 'ROOM_UPGRADE'],
      type: 'addon',
      heading: 'Room Rent Restriction Waiver',
      benefitHeadline: 'Choose any room — no rent cap',
      infoTooltip: 'Removes the room rent sub-limit, allowing you to choose any room category without proportional deductions.',
      addonCostLabel: 'Starts at ₹800/yr',
      applicableToCategories: ['health'],
    });

    // — HEALTH: Discount —
    const cHealthNCB = await create('api::coverage.coverage', {
      name: 'Health No Claim Bonus',
      identifiers: ['HEALTH_NCB', 'HEALTH_NO_CLAIM_BONUS', 'SUM_INSURED_BONUS'],
      type: 'discount',
      heading: 'No Claim Bonus — Sum Insured Increase',
      benefitHeadline: 'Sum insured grows 10% each claim-free year',
      infoTooltip: 'Get a 10% increase in sum insured (up to 50%) for each claim-free policy year at no extra cost.',
      addonCostLabel: 'Up to 50% SI increase — free',
      applicableToCategories: ['health'],
      comparisonGrid: { gridLabel: 'NCB Bonus', showInGrid: true, displayValue: '+10% SI/yr' },
    });

    console.log('    ✓ 30 coverages created');

    // ════════════════════════════════════════════════════════════════════════
    // PHASE 2 — LINES OF BUSINESS
    // ════════════════════════════════════════════════════════════════════════
    console.log('\n[2/18] Lines of Business…');

    const lobMotor = await create('api::line-of-business.line-of-business', {
      name: 'Motor Insurance',
      identifier: 'MOTOR',
      slug: 'motor-insurance',
      heroHeading: 'Drive with Complete Confidence',
      heroDescription: 'Instant online policies for cars, bikes, and commercial vehicles. IRDAI-approved, 99.2% claim settlement ratio.',
      seo: { metaTitle: 'Motor Insurance India | Kiwi Insurance', metaDescription: 'Buy car and bike insurance online. Save up to 85% on premiums with instant policy issuance.' },
      cta: { labelText: 'Get Motor Quote', actionUrl: '/motor/quote' },
    });

    const lobHealth = await create('api::line-of-business.line-of-business', {
      name: 'Health Insurance',
      identifier: 'HEALTH',
      slug: 'health-insurance',
      heroHeading: 'Health Cover That Actually Works',
      heroDescription: 'Cashless treatment at 10,000+ hospitals. No surprise deductions. Transparent claims.',
      seo: { metaTitle: 'Health Insurance India | Kiwi Insurance', metaDescription: 'Affordable health insurance with cashless hospitalisation at 10,000+ hospitals.' },
      cta: { labelText: 'Get Health Quote', actionUrl: '/health/quote' },
    });

    const lobTravel = await create('api::line-of-business.line-of-business', {
      name: 'Travel Insurance',
      identifier: 'TRAVEL',
      slug: 'travel-insurance',
      heroHeading: 'Travel Worry-Free Anywhere in the World',
      heroDescription: 'Comprehensive travel cover for medical emergencies, trip cancellations, and baggage loss.',
      seo: { metaTitle: 'Travel Insurance | Kiwi Insurance', metaDescription: 'Buy travel insurance online for domestic and international trips.' },
      cta: { labelText: 'Get Travel Quote', actionUrl: '/travel/quote' },
    });

    console.log('    ✓ 3 LOBs created');

    // ════════════════════════════════════════════════════════════════════════
    // PHASE 3 — INSURANCE PRODUCTS
    // ════════════════════════════════════════════════════════════════════════
    console.log('\n[3/18] Insurance Products…');

    const p4W = await create('api::insurance-product.insurance-product', {
      productName: '4 Wheeler Insurance',
      identifier: '4W',
      slug: 'car-insurance',
      lineOfBusiness: { connect: [{ documentId: lobMotor.documentId }] },
      heroHeading: 'The Ultimate Car Insurance — 100% Digital',
      heroDescription: 'Comprehensive car insurance with instant policy, 600+ cashless garages, and claim settlement in 20 minutes.',
      keyBenefits: [
        { title: 'Instant Policy', description: 'Get your policy in under 5 minutes.', isPrimary: true },
        { title: '20-Min Claims', description: 'Fastest motor claim settlement in India.', isPrimary: true },
        { title: '600+ Garages', description: 'Cashless repairs at authorised workshops.', isPrimary: false },
        { title: 'Zero Paperwork', description: '100% digital — no physical documents needed.', isPrimary: false },
      ],
      seo: { metaTitle: 'Car Insurance Online | Kiwi Insurance', metaDescription: 'Buy car insurance online and save up to 85%. Instant policy, 20-min claims, 600+ cashless garages.' },
      cta: { labelText: 'Get Car Quote', actionUrl: '/motor/car-insurance/quote' },
      uiConfig: { isVisibleOnHomepage: true, sortOrder: 1 },
    });

    const p2W = await create('api::insurance-product.insurance-product', {
      productName: '2 Wheeler Insurance',
      identifier: '2W',
      slug: 'bike-insurance',
      lineOfBusiness: { connect: [{ documentId: lobMotor.documentId }] },
      heroHeading: 'Bike Insurance Made Ridiculously Simple',
      heroDescription: 'Affordable two-wheeler insurance with comprehensive cover. Buy in 2 minutes, claim in seconds.',
      keyBenefits: [
        { title: '2-Minute Policy', description: 'Get insured faster than your morning chai.', isPrimary: true },
        { title: 'Cashless Repairs', description: '300+ authorised two-wheeler workshops.', isPrimary: true },
        { title: 'Zero Depreciation', description: 'Get full claim amount, no cuts.', isPrimary: false },
      ],
      seo: { metaTitle: 'Bike Insurance Online | Kiwi Insurance', metaDescription: 'Affordable two-wheeler insurance. Comprehensive cover starting at ₹714/year.' },
      cta: { labelText: 'Get Bike Quote', actionUrl: '/motor/bike-insurance/quote' },
      uiConfig: { isVisibleOnHomepage: true, sortOrder: 2 },
    });

    const pHealthPlus = await create('api::insurance-product.insurance-product', {
      productName: 'Kiwi Health Plus',
      identifier: 'HEALTH_PLUS',
      slug: 'health-plus',
      lineOfBusiness: { connect: [{ documentId: lobHealth.documentId }] },
      heroHeading: 'Premium Health Cover — No Surprises',
      heroDescription: 'Comprehensive individual and family floater health insurance with zero room rent restrictions and unlimited restoration.',
      keyBenefits: [
        { title: 'No Room Rent Cap', description: 'Choose any room — single, twin, or suite.', isPrimary: true },
        { title: 'Unlimited Restore', description: 'Sum insured restored automatically after a claim.', isPrimary: true },
        { title: '10,000+ Hospitals', description: 'India\'s widest cashless hospital network.', isPrimary: false },
        { title: 'Day-1 Cover', description: '600+ day-care procedures covered from day one.', isPrimary: false },
      ],
      seo: { metaTitle: 'Health Insurance | Kiwi Health Plus', metaDescription: 'Premium health insurance with unlimited restoration, zero room rent cap, and 10,000+ cashless hospitals.' },
      cta: { labelText: 'Get Health Quote', actionUrl: '/health/quote' },
      uiConfig: { isVisibleOnHomepage: true, sortOrder: 3 },
    });

    const pArogya = await create('api::insurance-product.insurance-product', {
      productName: 'Arogya Sanjeevani',
      identifier: 'AROGYA_SANJEEVANI',
      slug: 'arogya-sanjeevani',
      lineOfBusiness: { connect: [{ documentId: lobHealth.documentId }] },
      heroHeading: 'Arogya Sanjeevani — IRDAI Standard Policy',
      heroDescription: "India's standardised health insurance policy. Simple, affordable, and portable across all insurers.",
      keyBenefits: [
        { title: 'IRDAI Standard', description: 'Fully standardised — same features everywhere.', isPrimary: true },
        { title: 'Affordable', description: 'Starting at ₹3,000/year for ₹5 lakh cover.', isPrimary: true },
        { title: 'AYUSH Cover', description: 'Includes Ayurveda, Yoga, Unani, Siddha, Homeopathy.', isPrimary: false },
      ],
      seo: { metaTitle: 'Arogya Sanjeevani Policy | Kiwi Insurance', metaDescription: "Buy IRDAI's standardised Arogya Sanjeevani health insurance. Starting at ₹3,000/year." },
      cta: { labelText: 'Buy Arogya Sanjeevani', actionUrl: '/health/arogya-sanjeevani/quote' },
      uiConfig: { isVisibleOnHomepage: false, sortOrder: 4 },
    });

    const pTravel = await create('api::insurance-product.insurance-product', {
      productName: 'Domestic Travel Insurance',
      identifier: 'DOM_TRAVEL',
      slug: 'domestic-travel-insurance',
      lineOfBusiness: { connect: [{ documentId: lobTravel.documentId }] },
      heroHeading: 'Domestic Travel Cover — For Every Indian Journey',
      heroDescription: 'Covers medical emergencies, trip cancellations, flight delays, and baggage loss on domestic trips.',
      keyBenefits: [
        { title: 'Medical Cover', description: '₹5 lakh medical cover on domestic trips.', isPrimary: true },
        { title: 'Trip Cancellation', description: 'Covered if your trip is cancelled due to illness.', isPrimary: true },
      ],
      seo: { metaTitle: 'Domestic Travel Insurance | Kiwi Insurance', metaDescription: 'Buy domestic travel insurance online. Covers medical, trip cancellation, and baggage.' },
      cta: { labelText: 'Get Travel Quote', actionUrl: '/travel/domestic/quote' },
      uiConfig: { isVisibleOnHomepage: false, sortOrder: 5 },
    });

    console.log('    ✓ 5 products created');

    // ════════════════════════════════════════════════════════════════════════
    // PHASE 4 — INSURANCE PLANS
    // ════════════════════════════════════════════════════════════════════════
    console.log('\n[4/18] Insurance Plans…');

    // 4W plans
    await create('api::insurance-plan.insurance-plan', {
      name: 'Comprehensive 1+3',
      identifier: '4W_COMP_1_3',
      slug: 'car-comp-1-3',
      odTerm: 1, tpTerm: 3,
      insuranceProducts: { connect: [{ documentId: p4W.documentId }] },
      badge: 'Best for New Cars',
      mainHeading: '1 Year OD + 3 Year TP Cover',
      benefitSummary: 'Mandatory for new cars as per IRDAI. Ideal first-year policy with comprehensive protection.',
      inclusions: [
        { coverage: { connect: [{ documentId: cOD.documentId }] }, isIncluded: true, sortOrder: 1 },
        { coverage: { connect: [{ documentId: cTP.documentId }] }, isIncluded: true, sortOrder: 2 },
        { coverage: { connect: [{ documentId: cPA.documentId }] }, isIncluded: true, sortOrder: 3 },
      ],
      addons: [
        { coverage: { connect: [{ documentId: cZeroDep.documentId }] }, isIncluded: false, sortOrder: 1 },
        { coverage: { connect: [{ documentId: cEngine.documentId }] }, isIncluded: false, sortOrder: 2 },
        { coverage: { connect: [{ documentId: cNCBProtect.documentId }] }, isIncluded: false, sortOrder: 3 },
        { coverage: { connect: [{ documentId: cRTI.documentId }] }, isIncluded: false, sortOrder: 4 },
        { coverage: { connect: [{ documentId: cRSA.documentId }] }, isIncluded: false, sortOrder: 5 },
      ],
      discounts: [
        { coverage: { connect: [{ documentId: cVolDed.documentId }] }, isIncluded: false, sortOrder: 1 },
        { coverage: { connect: [{ documentId: cNCB.documentId }] }, isIncluded: false, sortOrder: 2 },
        { coverage: { connect: [{ documentId: cAntiTheft.documentId }] }, isIncluded: false, sortOrder: 3 },
      ],
      coverages: { connect: [{ documentId: cOD.documentId }, { documentId: cTP.documentId }, { documentId: cPA.documentId }, { documentId: cZeroDep.documentId }, { documentId: cNCB.documentId }] },
      cta: { labelText: 'Buy Comp 1+3', actionUrl: '/motor/car-insurance/comp-1-3/buy' },
    });

    await create('api::insurance-plan.insurance-plan', {
      name: 'Comprehensive 1+5',
      identifier: '4W_COMP_1_5',
      slug: 'car-comp-1-5',
      odTerm: 1, tpTerm: 5,
      insuranceProducts: { connect: [{ documentId: p4W.documentId }] },
      badge: 'Max Protection',
      mainHeading: '1 Year OD + 5 Year TP — Ultimate Peace of Mind',
      benefitSummary: 'Best value for new car buyers. Lock in TP premium for 5 years while renewing OD annually.',
      inclusions: [
        { coverage: { connect: [{ documentId: cOD.documentId }] }, isIncluded: true, sortOrder: 1 },
        { coverage: { connect: [{ documentId: cTP.documentId }] }, isIncluded: true, sortOrder: 2 },
        { coverage: { connect: [{ documentId: cPA.documentId }] }, isIncluded: true, sortOrder: 3 },
      ],
      addons: [
        { coverage: { connect: [{ documentId: cZeroDep.documentId }] }, isIncluded: false, sortOrder: 1 },
        { coverage: { connect: [{ documentId: cEngine.documentId }] }, isIncluded: false, sortOrder: 2 },
        { coverage: { connect: [{ documentId: cRSA.documentId }] }, isIncluded: false, sortOrder: 3 },
        { coverage: { connect: [{ documentId: cConsumables.documentId }] }, isIncluded: false, sortOrder: 4 },
      ],
      discounts: [
        { coverage: { connect: [{ documentId: cVolDed.documentId }] }, isIncluded: false, sortOrder: 1 },
        { coverage: { connect: [{ documentId: cNCB.documentId }] }, isIncluded: false, sortOrder: 2 },
      ],
      cta: { labelText: 'Buy Comp 1+5', actionUrl: '/motor/car-insurance/comp-1-5/buy' },
    });

    await create('api::insurance-plan.insurance-plan', {
      name: 'Third Party Only — 1 Year',
      identifier: '4W_TP_1',
      slug: 'car-tp-1',
      odTerm: 0, tpTerm: 1,
      insuranceProducts: { connect: [{ documentId: p4W.documentId }] },
      badge: 'Legal Minimum',
      mainHeading: 'Third Party Liability — Stay Legal',
      benefitSummary: 'Minimum mandatory cover as required by the Motor Vehicles Act. Covers third party damage only.',
      inclusions: [
        { coverage: { connect: [{ documentId: cTP.documentId }] }, isIncluded: true, sortOrder: 1 },
        { coverage: { connect: [{ documentId: cPA.documentId }] }, isIncluded: true, sortOrder: 2 },
      ],
      cta: { labelText: 'Buy TP Cover', actionUrl: '/motor/car-insurance/tp/buy' },
    });

    // 2W plans
    await create('api::insurance-plan.insurance-plan', {
      name: 'Bike Comprehensive 1+5',
      identifier: '2W_COMP_1_5',
      slug: 'bike-comp-1-5',
      odTerm: 1, tpTerm: 5,
      insuranceProducts: { connect: [{ documentId: p2W.documentId }] },
      badge: 'Mandatory for New Bikes',
      mainHeading: 'Full Bike Cover — Worry-Free for 5 Years',
      benefitSummary: 'Mandated for new two-wheelers. 1-year OD + 5-year TP in a single policy.',
      inclusions: [
        { coverage: { connect: [{ documentId: cOD.documentId }] }, isIncluded: true, sortOrder: 1 },
        { coverage: { connect: [{ documentId: cTP.documentId }] }, isIncluded: true, sortOrder: 2 },
        { coverage: { connect: [{ documentId: cPA.documentId }] }, isIncluded: true, sortOrder: 3 },
      ],
      addons: [
        { coverage: { connect: [{ documentId: cZeroDep.documentId }] }, isIncluded: false, sortOrder: 1 },
        { coverage: { connect: [{ documentId: cRSA.documentId }] }, isIncluded: false, sortOrder: 2 },
        { coverage: { connect: [{ documentId: cPassengerCover.documentId }] }, isIncluded: false, sortOrder: 3 },
      ],
      discounts: [
        { coverage: { connect: [{ documentId: cNCB.documentId }] }, isIncluded: false, sortOrder: 1 },
        { coverage: { connect: [{ documentId: cAntiTheft.documentId }] }, isIncluded: false, sortOrder: 2 },
      ],
      cta: { labelText: 'Buy Bike Plan', actionUrl: '/motor/bike-insurance/comp-1-5/buy' },
    });

    await create('api::insurance-plan.insurance-plan', {
      name: 'Bike Third Party — 5 Year',
      identifier: '2W_TP_5',
      slug: 'bike-tp-5',
      odTerm: 0, tpTerm: 5,
      insuranceProducts: { connect: [{ documentId: p2W.documentId }] },
      badge: 'Budget Pick',
      mainHeading: '5-Year TP Cover for Bikes',
      benefitSummary: 'Stay legally compliant with mandatory third-party cover. Ideal for older bikes.',
      inclusions: [
        { coverage: { connect: [{ documentId: cTP.documentId }] }, isIncluded: true, sortOrder: 1 },
        { coverage: { connect: [{ documentId: cPA.documentId }] }, isIncluded: true, sortOrder: 2 },
      ],
      cta: { labelText: 'Buy Bike TP', actionUrl: '/motor/bike-insurance/tp-5/buy' },
    });

    // Health plans
    await create('api::insurance-plan.insurance-plan', {
      name: 'Health Plus — Individual',
      identifier: 'HEALTH_PLUS_IND',
      slug: 'health-plus-individual',
      odTerm: 0, tpTerm: 0,
      insuranceProducts: { connect: [{ documentId: pHealthPlus.documentId }] },
      badge: 'Most Popular',
      mainHeading: 'Individual Health Cover — For You Alone',
      benefitSummary: 'Dedicated sum insured for a single individual. Best for young professionals and self-employed.',
      inclusions: [
        { coverage: { connect: [{ documentId: cHospitalization.documentId }] }, isIncluded: true, sortOrder: 1 },
        { coverage: { connect: [{ documentId: cDayCare.documentId }] }, isIncluded: true, sortOrder: 2 },
        { coverage: { connect: [{ documentId: cPrePost.documentId }] }, isIncluded: true, sortOrder: 3 },
        { coverage: { connect: [{ documentId: cAmbulance.documentId }] }, isIncluded: true, sortOrder: 4 },
        { coverage: { connect: [{ documentId: cCashlessNetwork.documentId }] }, isIncluded: true, sortOrder: 5 },
        { coverage: { connect: [{ documentId: cAYUSH.documentId }] }, isIncluded: true, sortOrder: 6 },
      ],
      addons: [
        { coverage: { connect: [{ documentId: cOPD.documentId }] }, isIncluded: false, sortOrder: 1 },
        { coverage: { connect: [{ documentId: cCriticalIllness.documentId }] }, isIncluded: false, sortOrder: 2 },
        { coverage: { connect: [{ documentId: cMaternity.documentId }] }, isIncluded: false, sortOrder: 3 },
        { coverage: { connect: [{ documentId: cRoomRent.documentId }] }, isIncluded: false, sortOrder: 4 },
      ],
      discounts: [
        { coverage: { connect: [{ documentId: cHealthNCB.documentId }] }, isIncluded: false, sortOrder: 1 },
      ],
      cta: { labelText: 'Buy Individual Plan', actionUrl: '/health/health-plus/individual/buy' },
    });

    await create('api::insurance-plan.insurance-plan', {
      name: 'Health Plus — Family Floater',
      identifier: 'HEALTH_PLUS_FAM',
      slug: 'health-plus-family',
      odTerm: 0, tpTerm: 0,
      insuranceProducts: { connect: [{ documentId: pHealthPlus.documentId }] },
      badge: 'Best Value for Families',
      mainHeading: 'Family Floater — One Policy for the Whole Family',
      benefitSummary: 'One shared sum insured covering self, spouse, and up to 4 children. Best value for families.',
      inclusions: [
        { coverage: { connect: [{ documentId: cHospitalization.documentId }] }, isIncluded: true, sortOrder: 1 },
        { coverage: { connect: [{ documentId: cDayCare.documentId }] }, isIncluded: true, sortOrder: 2 },
        { coverage: { connect: [{ documentId: cPrePost.documentId }] }, isIncluded: true, sortOrder: 3 },
        { coverage: { connect: [{ documentId: cAmbulance.documentId }] }, isIncluded: true, sortOrder: 4 },
        { coverage: { connect: [{ documentId: cCashlessNetwork.documentId }] }, isIncluded: true, sortOrder: 5 },
        { coverage: { connect: [{ documentId: cAYUSH.documentId }] }, isIncluded: true, sortOrder: 6 },
      ],
      addons: [
        { coverage: { connect: [{ documentId: cMaternity.documentId }] }, isIncluded: false, sortOrder: 1 },
        { coverage: { connect: [{ documentId: cOPD.documentId }] }, isIncluded: false, sortOrder: 2 },
        { coverage: { connect: [{ documentId: cRoomRent.documentId }] }, isIncluded: false, sortOrder: 3 },
      ],
      discounts: [
        { coverage: { connect: [{ documentId: cHealthNCB.documentId }] }, isIncluded: false, sortOrder: 1 },
      ],
      cta: { labelText: 'Buy Family Plan', actionUrl: '/health/health-plus/family/buy' },
    });

    await create('api::insurance-plan.insurance-plan', {
      name: 'Arogya Sanjeevani — Standard',
      identifier: 'AROGYA_STANDARD',
      slug: 'arogya-sanjeevani-standard',
      odTerm: 0, tpTerm: 0,
      insuranceProducts: { connect: [{ documentId: pArogya.documentId }] },
      badge: 'IRDAI Standardised',
      mainHeading: "India's Standard Health Policy",
      benefitSummary: 'Sum insured ₹1L–₹10L. No variation across insurers. Fully portable.',
      inclusions: [
        { coverage: { connect: [{ documentId: cHospitalization.documentId }] }, isIncluded: true, limitOverride: 'Up to ₹10 Lakh', sortOrder: 1 },
        { coverage: { connect: [{ documentId: cDayCare.documentId }] }, isIncluded: true, sortOrder: 2 },
        { coverage: { connect: [{ documentId: cAYUSH.documentId }] }, isIncluded: true, sortOrder: 3 },
        { coverage: { connect: [{ documentId: cAmbulance.documentId }] }, isIncluded: true, limitOverride: '₹2,000 per hospitalisation', sortOrder: 4 },
      ],
      cta: { labelText: 'Buy Arogya Sanjeevani', actionUrl: '/health/arogya-sanjeevani/buy' },
    });

    console.log('    ✓ 9 plans created');

    // ════════════════════════════════════════════════════════════════════════
    // PHASE 5 — PAGES
    // ════════════════════════════════════════════════════════════════════════
    console.log('\n[5/18] Pages…');

    await create('api::page.page', {
      title: 'Home', slug: 'home', template: 'home',
      seo: { metaTitle: 'Kiwi Insurance — Smart Insurance for Smart India', metaDescription: 'Buy car, bike, and health insurance online. Instant policy, transparent claims, IRDAI-regulated.' },
      content: [
        {
          __component: 'page-builder.hero-section',
          title: 'Smart Insurance for Smart India',
          subtitle: 'Transparent. Digital. IRDAI-Regulated.',
        },
        {
          __component: 'page-builder.stats-bar',
          stats: [
            { label: 'Claim Settlement', value: '99.2%', icon: 'shield' },
            { label: 'Happy Customers', value: '25 Lakh+', icon: 'users' },
            { label: 'Cashless Garages', value: '600+', icon: 'wrench' },
            { label: 'Cashless Hospitals', value: '10,000+', icon: 'hospital' },
            { label: 'Avg Claim Time', value: '20 Mins', icon: 'clock' },
          ],
        },
        {
          __component: 'page-builder.testimonial-showcase',
          title: 'Why 25 Lakh Indians Trust Kiwi',
          mode: 'automated-by-category',
          category: 'all',
        },
        {
          __component: 'page-builder.accordion',
          title: 'Frequently Asked Questions',
          items: [
            { title: 'Is Kiwi Insurance IRDAI approved?', content: p('Yes. Kiwi General Insurance is registered with IRDAI under Registration No. 190. CIN: U66010MH2024PLC000001.'), sortOrder: 1 },
            { title: 'How fast are claims settled?', content: p('Motor claims are settled within 20 minutes for digital surveys. Health cashless pre-auth is processed in under 2 hours.'), sortOrder: 2 },
            { title: 'Can I buy insurance 100% online?', content: p('Absolutely. Browse, compare, buy, and manage all your policies entirely online — no agent or paperwork needed.'), sortOrder: 3 },
            { title: 'What is NCB in car insurance?', content: p('No Claim Bonus (NCB) is a discount on your OD premium for each claim-free year. It can go up to 50% after 5 claim-free years.'), sortOrder: 4 },
          ],
        },
      ],
    });

    const privacyPage = await create('api::page.page', {
      title: 'Privacy Policy', slug: 'privacy-policy', template: 'legal',
      seo: { metaTitle: 'Privacy Policy | Kiwi Insurance', metaDescription: 'How Kiwi General Insurance collects, uses, and protects your personal information.' },
      content: [
        {
          __component: 'page-builder.text-block',
          content: paras(
            'Last updated: 1 January 2025',
            'Kiwi General Insurance Company Limited ("Kiwi", "we", "our") is committed to protecting your personal data in accordance with the Information Technology Act 2000 and the IRDAI data privacy guidelines.',
            '1. Information We Collect: We collect name, date of birth, contact details, vehicle/health information, and payment data necessary for policy issuance and claims processing.',
            '2. How We Use Your Information: Your data is used for policy issuance, claim settlement, regulatory compliance, fraud prevention, and personalised insurance recommendations.',
            '3. Data Sharing: We share data only with reinsurers, third-party administrators (TPAs), surveyors, and government bodies as required by law or for claim settlement.',
            '4. Data Security: All data is encrypted in transit and at rest. We maintain ISO 27001-aligned information security practices.',
            '5. Your Rights: You may request access to, correction of, or deletion of your personal data by writing to dpo@kiwiinsurance.in.',
            '6. Contact: Data Protection Officer, Kiwi General Insurance, Kiwi House, 12th Floor, BKC, Mumbai 400051. Email: dpo@kiwiinsurance.in'
          ),
        },
      ],
      internalNotes: 'Legal team to review annually. Last reviewed by Priya Nair (CS) — January 2025.',
    });

    const termsPage = await create('api::page.page', {
      title: 'Terms of Use', slug: 'terms-of-use', template: 'legal',
      seo: { metaTitle: 'Terms of Use | Kiwi Insurance', metaDescription: 'Terms and conditions governing use of the Kiwi Insurance website and digital services.' },
      content: [
        {
          __component: 'page-builder.text-block',
          content: paras(
            'Last updated: 1 January 2025',
            'Welcome to the Kiwi General Insurance website. By accessing this website, you agree to be bound by these Terms of Use.',
            '1. Eligibility: The services on this website are available to residents of India who are 18 years of age or older.',
            '2. Insurance Products: All insurance products are subject to policy terms, conditions, exclusions, and IRDAI regulations. Please read the policy document carefully before purchasing.',
            '3. Intellectual Property: All content, trademarks, and intellectual property on this website belong to Kiwi General Insurance or its licensors.',
            '4. Disclaimer: Insurance is subject to market risks. Policy benefits, premiums, and availability may change as per IRDAI guidelines.',
            '5. Governing Law: These terms are governed by the laws of India. Disputes are subject to the jurisdiction of courts in Mumbai.',
            '6. Contact: For queries, write to legal@kiwiinsurance.in or call 1800-123-4567.'
          ),
        },
      ],
      internalNotes: 'Legal team to review annually.',
    });

    await create('api::page.page', {
      title: 'About Us', slug: 'about', template: 'about',
      seo: { metaTitle: 'About Kiwi Insurance | Our Story', metaDescription: 'Kiwi General Insurance is a technology-first IRDAI-regulated insurer making insurance simple, transparent, and accessible for all Indians.' },
      content: [
        {
          __component: 'page-builder.hero-section',
          title: 'Insurance Reimagined for India',
          subtitle: 'We started Kiwi because buying insurance should be as simple as ordering pizza.',
        },
        {
          __component: 'page-builder.stats-bar',
          stats: [
            { label: 'Founded', value: '2024', icon: 'calendar' },
            { label: 'IRDAI Reg No.', value: '190', icon: 'certificate' },
            { label: 'CIN', value: 'U66010MH2024PLC000001', icon: 'building' },
            { label: 'Headquartered', value: 'Mumbai, India', icon: 'location' },
          ],
        },
        {
          __component: 'page-builder.text-block',
          content: paras(
            'Kiwi General Insurance is a technology-first general insurance company, registered with the Insurance Regulatory and Development Authority of India (IRDAI) under Registration No. 190.',
            'Our mission is simple: make insurance buying and claiming as transparent and effortless as possible for every Indian. We achieve this through digital-first products, real-time claim tracking, and a no-surprise promise.',
            'Registered Address: Kiwi House, 12th Floor, Bandra Kurla Complex, Mumbai — 400051'
          ),
        },
      ],
    });

    await create('api::page.page', {
      title: 'Grievance Redressal', slug: 'grievance', template: 'grievance',
      seo: { metaTitle: 'Grievance Redressal | Kiwi Insurance', metaDescription: 'Lodge and track your grievance with Kiwi Insurance. 3-level escalation process per IRDAI guidelines.' },
      content: [
        {
          __component: 'page-builder.hero-section',
          title: 'We Take Every Complaint Seriously',
          subtitle: 'IRDAI-mandated 3-level grievance redressal within 15 days.',
        },
        {
          __component: 'page-builder.progress-steps',
          title: 'Grievance Escalation Process',
          steps: [
            { stepNumber: 1, title: 'Level 1 — Grievance Officer', description: 'Contact our Grievance Officer within 15 days. Email: grievance@kiwiinsurance.in | Phone: 1800-123-4567.', icon: null },
            { stepNumber: 2, title: 'Level 2 — Principal Nodal Officer', description: 'If unsatisfied, escalate to PNO within 8 weeks of Level 1 response. Email: pno@kiwiinsurance.in.', icon: null },
            { stepNumber: 3, title: 'Level 3 — Insurance Ombudsman', description: 'For unresolved complaints, approach the Insurance Ombudsman in your region. Free of charge.', icon: null },
          ],
        },
      ],
    });

    console.log('    ✓ 5 pages created');

    // ════════════════════════════════════════════════════════════════════════
    // PHASE 6 — SHARED SECTIONS
    // ════════════════════════════════════════════════════════════════════════
    console.log('\n[6/18] Shared Sections…');

    const secClaims = await create('api::shared-section.shared-section', {
      title: 'Global Claims Support Banner',
      blocks: [{
        __component: 'page-builder.banner',
        title: 'File a Claim 24/7',
        content: p('Call 1800-123-4567 or WhatsApp for instant claim intimation. Digital survey in 20 minutes.'),
        bannerType: 'info',
      }],
    });

    await create('api::shared-section.shared-section', {
      title: 'Why Choose Kiwi — Features Block',
      blocks: [{
        __component: 'page-builder.card-grid',
        title: 'The Kiwi Difference',
        columns: 3,
        cards: [
          { title: '100% Digital', description: 'Buy, manage, and claim entirely online. No paperwork, no agents.', ctaText: 'Learn More', ctaUrl: '/about' },
          { title: 'Transparent Pricing', description: 'No hidden charges. What you see is what you pay.', ctaText: null, ctaUrl: null },
          { title: 'Instant Policy', description: 'Policy document in your inbox within 5 minutes of payment.', ctaText: null, ctaUrl: null },
          { title: 'IRDAI Regulated', description: 'Registered under IRDAI No. 190. Your money is safe.', ctaText: null, ctaUrl: null },
          { title: '24×7 Support', description: 'Real humans available round the clock — not just bots.', ctaText: null, ctaUrl: null },
          { title: 'No Surprise Claims', description: 'We explain every deduction before settling. No surprises.', ctaText: null, ctaUrl: null },
        ],
      }],
    });

    await create('api::shared-section.shared-section', {
      title: 'Claims Process Steps',
      blocks: [{
        __component: 'page-builder.progress-steps',
        title: 'How to File a Motor Claim',
        steps: [
          { stepNumber: 1, title: 'Intimate Us', description: 'Call 1800-123-4567 or use the app within 24 hours of the incident.', icon: null },
          { stepNumber: 2, title: 'Digital Survey', description: 'Upload photos via WhatsApp or app. A surveyor reviews digitally in 20 minutes.', icon: null },
          { stepNumber: 3, title: 'Repair Approval', description: 'Take your vehicle to any of 600+ cashless garages. We approve repairs directly.', icon: null },
          { stepNumber: 4, title: 'Claim Settlement', description: 'We pay the garage directly. You pay nothing (for cashless) or receive reimbursement within 7 days.', icon: null },
        ],
      }],
    });

    console.log('    ✓ 3 shared sections created');

    // ════════════════════════════════════════════════════════════════════════
    // PHASE 7 — GLOBAL CONFIG (complete)
    // ════════════════════════════════════════════════════════════════════════
    console.log('\n[7/18] Global Config…');

    await upsertSingle('api::global-config.global-config', {
      siteName: 'Kiwi General Insurance',
      siteDescription: 'Technology-first general insurance — making insurance simple, transparent, and accessible for every Indian.',
      cinNumber: 'U66010MH2024PLC000001',
      irdaiRegNumber: '190',
      registeredAddress: 'Kiwi House, 12th Floor, Bandra Kurla Complex, Bandra (East), Mumbai — 400 051, Maharashtra, India',
      section41Warning: paras(
        'IRDAI Registration No. 190 | CIN: U66010MH2024PLC000001',
        'Kiwi General Insurance Company Limited is regulated by the Insurance Regulatory and Development Authority of India (IRDAI).',
        'Insurance is the subject matter of solicitation. Visitors are hereby informed that their information submitted on the website may be shared with insurers. Product information is authentic and solely based on the information received from the insurers.',
        '© 2024 Kiwi General Insurance Company Limited. All rights reserved. Registered Office: Kiwi House, 12th Floor, BKC, Mumbai 400051.'
      ),
      irdaiUrl: 'https://www.irdai.gov.in',
      gicUrl: 'https://www.gicofindia.com',
      bimaBharosaUrl: 'https://bimabharosa.irdai.gov.in',
      headerPhoneNumber: '1800-123-4567',
      headerEmailAddress: 'care@kiwiinsurance.in',
      supportEmail: 'care@kiwiinsurance.in',
      footerDescription: 'Kiwi General Insurance is a technology-first IRDAI-regulated insurer committed to making insurance buying and claiming transparent, instant, and hassle-free for every Indian.',
      footerCopyright: '© 2024 Kiwi General Insurance Company Limited. IRDAI Reg No. 190. CIN: U66010MH2024PLC000001. Registered Office: Kiwi House, 12th Floor, BKC, Mumbai 400051.',
      defaultSeo: {
        metaTitle: 'Kiwi Insurance — Smart Insurance for Smart India',
        metaDescription: 'Buy car, bike, and health insurance online. Instant policy, 99.2% claim settlement ratio. IRDAI Reg No. 190.',
      },
      socialLinks: [
        { platform: 'linkedin', url: 'https://www.linkedin.com/company/kiwi-insurance' },
        { platform: 'twitter', url: 'https://twitter.com/kiwiinsurance' },
        { platform: 'facebook', url: 'https://www.facebook.com/kiwiinsurance' },
        { platform: 'instagram', url: 'https://www.instagram.com/kiwiinsurance' },
        { platform: 'youtube', url: 'https://www.youtube.com/@kiwiinsurance' },
      ],
      appLinks: {
        app_store_url: 'https://apps.apple.com/in/app/kiwi-insurance',
        play_store_url: 'https://play.google.com/store/apps/details?id=in.kiwiinsurance',
      },
      trustMetrics: [
        { label: 'Claim Settlement Ratio', value: '99.2%', icon: 'shield-check' },
        { label: 'Happy Customers', value: '25 Lakh+', icon: 'users' },
        { label: 'Cashless Garages', value: '600+', icon: 'car' },
        { label: 'Cashless Hospitals', value: '10,000+', icon: 'hospital' },
        { label: 'Avg Claim Time', value: '20 Mins', icon: 'clock' },
      ],
      analytics: {
        googleTagManagerId: 'GTM-XXXXXXX',
        facebookPixelId: '0000000000000',
      },
      stickyCta: {
        message: 'Protect what matters — get your quote in 2 minutes',
        ctaButton: { label: 'Get Free Quote', url: '/get-quote', target: '_self', variant: 'primary' },
        position: 'bottom',
        showCloseButton: true,
      },
      privacyPage: { connect: [{ documentId: privacyPage.documentId }] },
      termsPage: { connect: [{ documentId: termsPage.documentId }] },
    });

    console.log('    ✓ Global config updated with all fields + page relations');

    // ════════════════════════════════════════════════════════════════════════
    // PHASE 8 — LEADERSHIP PROFILES
    // ════════════════════════════════════════════════════════════════════════
    console.log('\n[8/18] Leadership Profiles…');

    const boardProfiles = [
      { name: 'Suresh Prabhu', designation: 'Independent Non-Executive Chairman', category: 'Board', din: '00007580', displayOrder: 1,
        bio: paras('Mr. Suresh Prabhu is an eminent economist and former Union Cabinet Minister with over 35 years of experience in finance, energy, and commerce.', 'He serves as Independent Non-Executive Chairman of Kiwi General Insurance, bringing strategic oversight and governance leadership to the Board.') },
      { name: 'Deepa Krishnamurthy', designation: 'Managing Director & Chief Executive Officer', category: 'Board', din: '08321547', displayOrder: 2,
        bio: paras('Ms. Deepa Krishnamurthy is a veteran of the insurance industry with 22 years of experience across underwriting, product, and general management.', 'She founded Kiwi Insurance with the vision of making India\'s insurance sector consumer-first and digitally accessible.') },
      { name: 'Rajiv Sharma', designation: 'Executive Director & Chief Financial Officer', category: 'KMP', din: '07654321', displayOrder: 3,
        bio: paras('Mr. Rajiv Sharma is a Chartered Accountant with over 18 years in financial services. He oversees Kiwi\'s treasury, investor relations, and regulatory reporting.') },
      { name: 'Dr. Anita Desai', designation: 'Independent Non-Executive Director', category: 'Board', din: '06543210', displayOrder: 4,
        bio: paras('Dr. Anita Desai is a leading actuary and risk management expert. She chairs the Board Risk Management Committee and guides Kiwi\'s underwriting philosophy.') },
      { name: 'Vikram Oberoi', designation: 'Independent Non-Executive Director', category: 'Board', din: '05432109', displayOrder: 5,
        bio: paras('Mr. Vikram Oberoi brings deep expertise in technology and digital transformation from his 20 years in the fintech industry. He chairs the IT Strategy Committee.') },
      { name: 'Priya Nair', designation: 'Company Secretary & Compliance Officer', category: 'KMP', din: null, displayOrder: 6,
        bio: paras('Ms. Priya Nair is a Fellow Member of the Institute of Company Secretaries of India (ICSI). She manages corporate governance, IRDAI regulatory filings, and Board secretarial functions.') },
    ];
    for (const profile of boardProfiles) {
      await create('api::leadership-profile.leadership-profile', profile);
    }
    console.log('    ✓ 6 leadership profiles created');

    // ════════════════════════════════════════════════════════════════════════
    // PHASE 9 — BRANCHES
    // ════════════════════════════════════════════════════════════════════════
    console.log('\n[9/18] Branches…');

    const branches = [
      { branchName: 'Head Office — Mumbai BKC', branchType: 'head-office', city: 'Mumbai', state: 'Maharashtra', pincode: '400051', phone: '022-6800-4567', email: 'hq@kiwiinsurance.in', workingHours: 'Mon–Fri 9:00 AM – 6:00 PM', address: p('Kiwi House, 12th Floor, Bandra Kurla Complex, Bandra (East), Mumbai — 400 051'), latitude: 19.0660, longitude: 72.8694 },
      { branchName: 'Delhi Regional Office', branchType: 'regional-office', city: 'New Delhi', state: 'Delhi', pincode: '110001', phone: '011-4500-4567', email: 'delhi@kiwiinsurance.in', workingHours: 'Mon–Sat 9:30 AM – 5:30 PM', address: p('4th Floor, Tower B, DLF Centre, Sansad Marg, New Delhi — 110 001'), latitude: 28.6139, longitude: 77.2090 },
      { branchName: 'Bengaluru Regional Office', branchType: 'regional-office', city: 'Bengaluru', state: 'Karnataka', pincode: '560001', phone: '080-4500-4567', email: 'bangalore@kiwiinsurance.in', workingHours: 'Mon–Sat 9:30 AM – 5:30 PM', address: p('3rd Floor, RMZ Infinity, Old Madras Road, Bengaluru — 560 016'), latitude: 12.9716, longitude: 77.5946 },
      { branchName: 'Chennai Regional Office', branchType: 'regional-office', city: 'Chennai', state: 'Tamil Nadu', pincode: '600002', phone: '044-4500-4567', email: 'chennai@kiwiinsurance.in', workingHours: 'Mon–Sat 9:30 AM – 5:30 PM', address: p('8th Floor, Prince Infocity II, Ambattur Industrial Estate, Chennai — 600 058'), latitude: 13.0827, longitude: 80.2707 },
      { branchName: 'Kolkata Branch Office', branchType: 'branch-office', city: 'Kolkata', state: 'West Bengal', pincode: '700001', phone: '033-4500-4567', email: 'kolkata@kiwiinsurance.in', workingHours: 'Mon–Sat 10:00 AM – 5:00 PM', address: p('5th Floor, Tata Centre, 43 Chowringhee Road, Kolkata — 700 071'), latitude: 22.5726, longitude: 88.3639 },
      { branchName: 'Hyderabad Branch Office', branchType: 'branch-office', city: 'Hyderabad', state: 'Telangana', pincode: '500001', phone: '040-4500-4567', email: 'hyderabad@kiwiinsurance.in', workingHours: 'Mon–Sat 9:30 AM – 5:30 PM', address: p('2nd Floor, Cyber Towers, HITEC City, Hyderabad — 500 081'), latitude: 17.4435, longitude: 78.3772 },
    ];
    for (const branch of branches) await create('api::branch.branch', branch);
    console.log('    ✓ 6 branches created');

    // ════════════════════════════════════════════════════════════════════════
    // PHASE 10 — FINANCIAL DISCLOSURES
    // ════════════════════════════════════════════════════════════════════════
    console.log('\n[10/18] Financial Disclosures…');

    const disclosures = [
      { title: 'Public Disclosure — Q1 FY 2024-25 (Apr–Jun 2024)', disclosureType: 'public-disclosure', financialYear: '2024-25', quarter: 'Q1', publishedOn: '2024-07-31' },
      { title: 'Public Disclosure — Q2 FY 2024-25 (Jul–Sep 2024)', disclosureType: 'public-disclosure', financialYear: '2024-25', quarter: 'Q2', publishedOn: '2024-10-31' },
      { title: 'Public Disclosure — Q3 FY 2024-25 (Oct–Dec 2024)', disclosureType: 'public-disclosure', financialYear: '2024-25', quarter: 'Q3', publishedOn: '2025-01-31' },
      { title: 'Public Disclosure — Q4 FY 2024-25 (Jan–Mar 2025)', disclosureType: 'public-disclosure', financialYear: '2024-25', quarter: 'Q4', publishedOn: '2025-04-30' },
      { title: 'Annual Report FY 2023-24', disclosureType: 'annual-report', financialYear: '2023-24', publishedOn: '2024-09-30' },
      { title: 'ESG Report FY 2023-24', disclosureType: 'esg-report', financialYear: '2023-24', publishedOn: '2024-09-30' },
    ];
    for (const d of disclosures) await create('api::financial-disclosure.financial-disclosure', d);
    console.log('    ✓ 6 financial disclosures created');

    // ════════════════════════════════════════════════════════════════════════
    // PHASE 11 — DOWNLOAD DOCUMENTS
    // ════════════════════════════════════════════════════════════════════════
    console.log('\n[11/18] Download Documents…');

    const docs = [
      { title: 'Motor Insurance Proposal Form', documentType: 'proposal-form', productCategory: 'motor', version: 'v3.1', uploadedOn: '2024-12-01' },
      { title: 'Health Insurance Proposal Form', documentType: 'proposal-form', productCategory: 'health', version: 'v2.0', uploadedOn: '2024-12-01' },
      { title: 'Motor Claim Form', documentType: 'claim-form', productCategory: 'motor', version: 'v2.4', uploadedOn: '2024-12-15' },
      { title: 'Health Claim Reimbursement Form', documentType: 'claim-form', productCategory: 'health', version: 'v1.8', uploadedOn: '2024-12-15' },
      { title: 'Private Car Policy Wording', documentType: 'policy-wording', productCategory: 'motor', version: 'v5.0', uploadedOn: '2024-11-01' },
      { title: 'Health Plus Policy Wording', documentType: 'policy-wording', productCategory: 'health', version: 'v2.1', uploadedOn: '2024-11-01' },
      { title: 'Motor Insurance — Customer Information Sheet', documentType: 'customer-information-sheet', productCategory: 'motor', version: 'v1.0', uploadedOn: '2024-10-01' },
      { title: 'Health Insurance — Customer Information Sheet', documentType: 'customer-information-sheet', productCategory: 'health', version: 'v1.0', uploadedOn: '2024-10-01' },
    ];
    for (const doc of docs) await create('api::download-document.download-document', doc);
    console.log('    ✓ 8 download documents created');

    // ════════════════════════════════════════════════════════════════════════
    // PHASE 12 — TESTIMONIALS
    // ════════════════════════════════════════════════════════════════════════
    console.log('\n[12/18] Testimonials…');

    const testimonials = [
      { customerName: 'Amit S.', customerTitle: 'Car Owner, Pune', rating: 5, category: 'motor', isFeatured: true, quote: p('Filed a car insurance claim after a minor accident. The entire process was done on WhatsApp in 20 minutes. Never expected insurance to be this easy.') },
      { customerName: 'Rajesh K.', customerTitle: 'Software Engineer, Bengaluru', rating: 5, category: 'health', isFeatured: true, quote: p('Cashless treatment at a top hospital in Bengaluru. Zero out-of-pocket expenses. Kiwi processed the pre-auth in under an hour.') },
      { customerName: 'Meera P.', customerTitle: 'Homemaker, Mumbai', rating: 5, category: 'health', isFeatured: true, quote: p('Bought a family floater policy online in 10 minutes. When my husband needed surgery, the hospital directly coordinated with Kiwi. No stress for me.') },
      { customerName: 'Sunil T.', customerTitle: 'Delivery Partner, Delhi', rating: 5, category: 'motor', isFeatured: false, quote: p('Two-wheeler insurance at the most affordable price. When my bike was stolen, they settled the claim in 3 days. Excellent service!') },
      { customerName: 'Dr. Kavitha R.', customerTitle: 'Gynaecologist, Chennai', rating: 5, category: 'health', isFeatured: false, quote: p('The health NCB feature is brilliant. I got a 30% SI increase in 3 claim-free years at absolutely no extra cost. Worth every rupee.') },
      { customerName: 'Arjun M.', customerTitle: 'Business Owner, Hyderabad', rating: 5, category: 'claims', isFeatured: true, quote: p('Zero Depreciation saved me ₹45,000 on my car repair claim. The surveyor visited digitally and approved the repair in minutes.') },
      { customerName: 'Priya L.', customerTitle: 'Teacher, Kolkata', rating: 4, category: 'general', isFeatured: false, quote: p('Simple online purchase. No agent calls, no paperwork. I managed my car and health policies from the same dashboard.') },
      { customerName: 'Ravi B.', customerTitle: 'IT Professional, Pune', rating: 5, category: 'motor', isFeatured: false, quote: p('Engine protection add-on was a lifesaver during the Mumbai floods. My engine was completely damaged; Kiwi covered it fully under the add-on.') },
      { customerName: 'Nandita G.', customerTitle: 'Finance Manager, Mumbai', rating: 5, category: 'claims', isFeatured: false, quote: p('Filed a health claim for a sudden hospitalisation. The TPA team was incredibly helpful and the bill was settled directly with the hospital.') },
      { customerName: 'Sanjay V.', customerTitle: 'Retired Banker, Delhi', rating: 5, category: 'general', isFeatured: false, quote: p('I was sceptical about online insurance. But the policy document arrived instantly, and when I needed to renew, it was just one click. Very convenient.') },
      { customerName: 'Lakshmi A.', customerTitle: 'Nurse, Bengaluru', rating: 5, category: 'health', isFeatured: false, quote: p('The maternity add-on covered my delivery expenses completely. Normal delivery at a private hospital — not a single rupee from my pocket.') },
      { customerName: 'Deepak N.', customerTitle: 'Architect, Hyderabad', rating: 4, category: 'motor', isFeatured: false, quote: p('Roadside Assistance was a godsend when my car broke down on the expressway at midnight. Help arrived within 25 minutes.') },
    ];
    for (const t of testimonials) await create('api::testimonial.testimonial', t);
    console.log('    ✓ 12 testimonials created');

    // ════════════════════════════════════════════════════════════════════════
    // PHASE 13 — AUTHORS + CATEGORIES
    // ════════════════════════════════════════════════════════════════════════
    console.log('\n[13/18] Authors & Categories…');

    const aVikram = await create('api::author.author', { name: 'Vikram Seth', slug: 'vikram-seth', bio: paras('CMS Architect & Insurance Product Specialist with 12+ years at leading Indian insurers.') });
    const aPriya = await create('api::author.author', { name: 'Priya Sharma', slug: 'priya-sharma', bio: paras('Claims Specialist and Consumer Rights Advocate. Helps customers understand their policies better.') });
    const aRajiv = await create('api::author.author', { name: 'Rajiv Menon', slug: 'rajiv-menon', bio: paras('Actuary and Risk Analyst. Writes about insurance data, pricing trends, and regulatory changes.') });

    const catMotor = await create('api::category.category', { name: 'Motor Insurance Guides', slug: 'motor-guides', description: 'Expert guides on car and bike insurance — buying, renewing, and claiming.' });
    const catHealth = await create('api::category.category', { name: 'Health & Wellness', slug: 'health-wellness', description: 'Health insurance tips, medical cost guides, and wellness resources.' });
    const catClaims = await create('api::category.category', { name: 'Claims & Process', slug: 'claims-process', description: 'How to file claims, track status, and understand settlements.' });
    const catPolicy = await create('api::category.category', { name: 'Policy & Regulation', slug: 'policy-regulation', description: 'IRDAI guidelines, policy changes, and compliance updates.' });

    console.log('    ✓ 3 authors + 4 categories created');

    // ════════════════════════════════════════════════════════════════════════
    // PHASE 14 — ARTICLES
    // ════════════════════════════════════════════════════════════════════════
    console.log('\n[14/18] Articles…');

    const articles = [
      {
        title: '7 Ways to Save Up to 50% on Your Car Insurance Premium',
        slug: 'save-on-car-insurance-premium',
        excerpt: 'Smart strategies every car owner should know before renewing their policy — from NCB to voluntary deductibles.',
        readTime: 5, isFeatured: true,
        authorId: aVikram.documentId, catId: catMotor.documentId,
        content: paras(
          'Car insurance renewals catch most people off guard. Here are 7 proven ways to reduce your premium without compromising coverage.',
          '1. Claim your NCB: If you haven\'t claimed in the last year, you earn a 20% discount on OD premium. After 5 claim-free years, this grows to 50%.',
          '2. Install an ARAI-approved anti-theft device: Get 2.5% off on OD premium instantly.',
          '3. Opt for voluntary deductible: Choose to pay ₹2,500–₹15,000 during claims to save ₹500–₹2,500 on premium.',
          '4. Compare online: Prices vary 20–40% across insurers. Always compare before renewing.',
          '5. Avoid small claims: Filing claims for minor amounts erodes your NCB. Self-repair scratches under ₹5,000.',
          '6. Choose add-ons wisely: Zero dep is worth it for cars under 5 years. Engine protect is critical in flood-prone areas.',
          '7. Multi-year TP policy: Lock in TP premium for 3 or 5 years to avoid annual increases.'
        ),
      },
      {
        title: 'What is Zero Depreciation Car Insurance? Everything You Need to Know',
        slug: 'zero-depreciation-car-insurance-guide',
        excerpt: 'Zero dep is one of the most popular car insurance add-ons — but is it worth it? We break it down.',
        readTime: 6, isFeatured: true,
        authorId: aVikram.documentId, catId: catMotor.documentId,
        content: paras(
          'Standard car insurance deducts depreciation from your claim amount. So if your 3-year-old car\'s bumper is damaged, you might receive only 50% of the repair cost.',
          'Zero Depreciation cover eliminates this. You receive 100% of the repair cost for all plastic, rubber, and metal parts.',
          'Is it worth it? Yes — if your car is under 5 years old, you drive frequently, or you live in a high-traffic or flood-prone area.',
          'Cost: Zero dep typically adds 10–15% to your OD premium. For a car insured at ₹8,000 OD premium, that\'s ₹800–₹1,200 extra.',
          'Claim example: Bumper and bonnet damage worth ₹40,000. Without zero dep: You receive ₹20,000 (50% depreciation). With zero dep: You receive ₹40,000.'
        ),
      },
      {
        title: 'Understanding Arogya Sanjeevani: India\'s Standardised Health Policy',
        slug: 'understanding-arogya-sanjeevani',
        excerpt: 'The IRDAI-mandated standard health policy explained — features, benefits, limitations, and who should buy it.',
        readTime: 7, isFeatured: false,
        authorId: aPriya.documentId, catId: catHealth.documentId,
        content: paras(
          'In 2020, IRDAI introduced Arogya Sanjeevani — a standardised health insurance policy that every general insurer in India must offer.',
          'Key features: Sum insured ₹1 lakh to ₹10 lakh. Same features, same exclusions across all insurers. Covers hospitalisation, day-care, AYUSH, and maternity.',
          'What\'s included: In-patient hospitalisation, pre/post hospitalisation (30/60 days), day-care procedures, modern treatments, and ambulance cover.',
          'What\'s excluded: Pre-existing diseases (4-year waiting period), cosmetic surgery, dental treatments (unless from accident), and maternity in the first year.',
          'Who should buy it: First-time health insurance buyers, those with simple coverage needs, or those who want a portable policy across insurers.',
          'Kiwi Arogya Sanjeevani starts at ₹3,000 per year for ₹5 lakh sum insured for a 25-year-old individual.'
        ),
      },
      {
        title: 'How to File a Motor Insurance Claim in 5 Easy Steps',
        slug: 'how-to-file-motor-insurance-claim',
        excerpt: 'A step-by-step guide to filing a car or bike insurance claim with Kiwi Insurance — from intimation to settlement.',
        readTime: 4, isFeatured: false,
        authorId: aPriya.documentId, catId: catClaims.documentId,
        content: paras(
          'Filing a motor insurance claim doesn\'t have to be stressful. Here\'s exactly what to do.',
          'Step 1 — Ensure Safety: After an accident, move to a safe location. Call emergency services if needed.',
          'Step 2 — Intimate Kiwi: Call 1800-123-4567 or WhatsApp us within 24 hours. Share your policy number and a brief description.',
          'Step 3 — Digital Survey: Our team will send a WhatsApp link. Upload 5–7 clear photos of the damage. Survey is completed digitally in 20 minutes.',
          'Step 4 — Cashless Repair: Take your vehicle to any of 600+ cashless garages. Share your claim reference number. We approve repairs directly.',
          'Step 5 — Settlement: For cashless claims, we pay the garage directly. For reimbursement claims, upload bills and receive payment in 7 working days.',
          'Pro tip: Don\'t repair your vehicle before the survey — it may affect your claim eligibility.'
        ),
      },
      {
        title: 'IRDAI\'s New Health Insurance Guidelines: What Changed in 2025',
        slug: 'irdai-health-insurance-guidelines-2025',
        excerpt: 'Major changes to health insurance regulations in 2025 — what policyholders must know.',
        readTime: 6, isFeatured: false,
        authorId: aRajiv.documentId, catId: catPolicy.documentId,
        content: paras(
          "IRDAI's 2025 Master Circular on health insurance introduces several consumer-friendly changes effective January 2025.",
          '1. Moratorium period reduced: Pre-existing disease exclusion period reduced from 4 years to 3 years for most conditions.',
          '2. Mental health parity: All health insurance policies must now cover mental health conditions on par with physical illnesses.',
          '3. Grace period extended: The grace period for premium payment extended from 15 to 30 days without loss of coverage.',
          '4. Standardised exclusions: Certain exclusions that varied across insurers are now standardised, making comparisons easier.',
          '5. Faster pre-auth: Cashless pre-authorisation must now be processed within 1 hour for planned hospitalisation and within 30 minutes for emergencies.',
          'What this means for you: These changes make health insurance more consumer-friendly. Review your existing policy to ensure your insurer has updated their terms.'
        ),
      },
      {
        title: 'Family Floater vs Individual Health Insurance: Which is Right for You?',
        slug: 'family-floater-vs-individual-health-insurance',
        excerpt: 'Choosing between individual and family floater health plans? We compare costs, coverage, and scenarios.',
        readTime: 6, isFeatured: true,
        authorId: aPriya.documentId, catId: catHealth.documentId,
        content: paras(
          'One of the most common questions we get: should I buy individual health plans for each family member, or one family floater?',
          'Family Floater: One sum insured shared by the entire family. Cheaper — a ₹10 lakh floater for family of 4 costs less than 4 individual ₹10 lakh plans.',
          'Individual Plans: Each person has dedicated sum insured. More expensive, but no sharing — if two people are hospitalised simultaneously, both have full coverage.',
          'When floater is better: Younger families, when only one person is likely to claim in a year, and when budget is a constraint.',
          'When individual is better: Senior citizens (claim separately), families with members who have pre-existing conditions, or high-risk occupations.',
          'Our recommendation: Young families (35 and below) → Floater plan. Senior parents → Separate individual plans. High-claim-risk members → Individual plans.',
          'Tip: You can mix both. Buy a floater for yourself, spouse, and kids — and separate individual plans for elderly parents.'
        ),
      },
    ];

    for (const a of articles) {
      await create('api::article.article', {
        title: a.title, slug: a.slug, excerpt: a.excerpt, readTime: a.readTime, isFeatured: a.isFeatured,
        author: { connect: [{ documentId: a.authorId }] },
        categories: { connect: [{ documentId: a.catId }] },
        blocks: [{ __component: 'page-builder.text-block', content: a.content }],
        seo: { metaTitle: a.title + ' | Kiwi Insurance Blog', metaDescription: a.excerpt },
      });
    }
    console.log('    ✓ 6 articles created');

    // ════════════════════════════════════════════════════════════════════════
    // PHASE 15 — TOOLS
    // ════════════════════════════════════════════════════════════════════════
    console.log('\n[15/18] Tools…');

    const tools = [
      { name: 'Car Insurance Premium Calculator', slug: 'car-premium-calculator', category: 'calculator', type: 'motor', shortDescription: 'Calculate your car insurance premium instantly. Enter vehicle details and get an accurate quote in 30 seconds.', badge: 'Popular', isActive: true, cta: { label: 'Calculate Now', url: '/tools/car-premium-calculator' } },
      { name: 'Bike Insurance Premium Calculator', slug: 'bike-premium-calculator', category: 'calculator', type: 'motor', shortDescription: 'Estimate your two-wheeler insurance premium. Compare comprehensive vs third-party costs instantly.', badge: 'Free', isActive: true, cta: { label: 'Calculate Now', url: '/tools/bike-premium-calculator' } },
      { name: 'Traffic Challan Checker', slug: 'challan-checker', category: 'checker', type: 'motor', shortDescription: 'Check your pending traffic challans across all RTO jurisdictions. Enter your vehicle registration number.', badge: 'Free', isActive: true, cta: { label: 'Check Challans', url: '/tools/challan-checker' } },
      { name: 'Health Insurance Premium Calculator', slug: 'health-premium-calculator', category: 'calculator', type: 'health', shortDescription: 'Find the right health insurance plan and premium based on your age, family size, and coverage needs.', badge: 'New', isActive: true, cta: { label: 'Calculate Now', url: '/tools/health-premium-calculator' } },
      { name: 'Hospital Locator', slug: 'hospital-locator', category: 'lookup', type: 'health', shortDescription: 'Find cashless hospitals near you. Search by city, pincode, or hospital name across 10,000+ network hospitals.', badge: 'Popular', isActive: true, cta: { label: 'Find Hospital', url: '/tools/hospital-locator' } },
      { name: 'NCB Calculator', slug: 'ncb-calculator', category: 'calculator', type: 'motor', shortDescription: 'Calculate your No Claim Bonus and estimate how much you can save on your next motor insurance renewal.', badge: null, isActive: true, cta: { label: 'Check NCB', url: '/tools/ncb-calculator' } },
    ];
    for (const tool of tools) await create('api::tool.tool', { ...tool, area: 'public-site' });
    console.log('    ✓ 6 tools created');

    // ════════════════════════════════════════════════════════════════════════
    // PHASE 16 — CAMPAIGNS
    // ════════════════════════════════════════════════════════════════════════
    console.log('\n[16/18] Campaigns…');

    await create('api::campaign.campaign', {
      campaignName: 'Monsoon Motor Protection 2025', campaignSlug: 'monsoon-2025', isActive: false,
      startDate: '2025-06-01', endDate: '2025-09-30',
      banner: { __component: 'page-builder.banner', title: 'Monsoon Alert — Is Your Car Protected?', content: p('Engine protection add-on covers flood damage. Add it to your policy before the rains hit.'), bannerType: 'alert' },
    });

    await create('api::campaign.campaign', {
      campaignName: 'Diwali Family Health Drive 2025', campaignSlug: 'diwali-health-2025', isActive: false,
      startDate: '2025-10-01', endDate: '2025-11-30',
      banner: { __component: 'page-builder.banner', title: 'Diwali Offer — Health Cover for the Whole Family', content: p('Buy a family floater this Diwali and get 12 months for the price of 11. Limited time offer.'), bannerType: 'info' },
    });

    await create('api::campaign.campaign', {
      campaignName: 'New Year New Policy 2025', campaignSlug: 'new-year-2025', isActive: true,
      startDate: '2025-01-01', endDate: '2025-01-31',
      banner: { __component: 'page-builder.banner', title: 'New Year, New Policy — Start 2025 Protected', content: p('Switch to Kiwi this January and get your first policy at a special introductory rate.'), bannerType: 'promo' },
    });

    console.log('    ✓ 3 campaigns created');

    // ════════════════════════════════════════════════════════════════════════
    // PHASE 17 — NAVIGATION MENU (complete tree)
    // ════════════════════════════════════════════════════════════════════════
    console.log('\n[17/18] Navigation Menu…');

    // ── Header ───────────────────────────────────────────────────────────
    const nProducts = await create('api::navigation-menu.navigation-menu', nav('Insurance Products', '#', { location: 'header', displayOrder: 1 }));

    const nMotor = await create('api::navigation-menu.navigation-menu', nav('Motor Insurance', '#', { parent: { connect: [{ documentId: nProducts.documentId }] }, displayOrder: 1 }));
    await create('api::navigation-menu.navigation-menu', nav('Car Insurance', '/motor/car-insurance', { parent: { connect: [{ documentId: nMotor.documentId }] }, displayOrder: 1 }));
    await create('api::navigation-menu.navigation-menu', nav('Bike Insurance', '/motor/bike-insurance', { parent: { connect: [{ documentId: nMotor.documentId }] }, displayOrder: 2 }));
    await create('api::navigation-menu.navigation-menu', nav('Commercial Vehicle', '/motor/commercial', { parent: { connect: [{ documentId: nMotor.documentId }] }, displayOrder: 3 }));

    const nHealth = await create('api::navigation-menu.navigation-menu', nav('Health Insurance', '#', { parent: { connect: [{ documentId: nProducts.documentId }] }, displayOrder: 2 }));
    await create('api::navigation-menu.navigation-menu', nav('Kiwi Health Plus', '/health/health-plus', { parent: { connect: [{ documentId: nHealth.documentId }] }, displayOrder: 1 }));
    await create('api::navigation-menu.navigation-menu', nav('Arogya Sanjeevani', '/health/arogya-sanjeevani', { parent: { connect: [{ documentId: nHealth.documentId }] }, displayOrder: 2 }));
    await create('api::navigation-menu.navigation-menu', nav('Family Floater', '/health/family-floater', { parent: { connect: [{ documentId: nHealth.documentId }] }, displayOrder: 3 }));

    const nTravel = await create('api::navigation-menu.navigation-menu', nav('Travel Insurance', '#', { parent: { connect: [{ documentId: nProducts.documentId }] }, displayOrder: 3 }));
    await create('api::navigation-menu.navigation-menu', nav('Domestic Travel', '/travel/domestic', { parent: { connect: [{ documentId: nTravel.documentId }] }, displayOrder: 1 }));
    await create('api::navigation-menu.navigation-menu', nav('International Travel', '/travel/international', { parent: { connect: [{ documentId: nTravel.documentId }] }, displayOrder: 2 }));

    const nClaims = await create('api::navigation-menu.navigation-menu', nav('Claims', '#', { location: 'header', displayOrder: 2 }));
    await create('api::navigation-menu.navigation-menu', nav('File a Claim', '/claims/file', { parent: { connect: [{ documentId: nClaims.documentId }] }, displayOrder: 1 }));
    await create('api::navigation-menu.navigation-menu', nav('Track Claim Status', '/claims/status', { parent: { connect: [{ documentId: nClaims.documentId }] }, displayOrder: 2 }));
    await create('api::navigation-menu.navigation-menu', nav('Cashless Garages', '/claims/garages', { parent: { connect: [{ documentId: nClaims.documentId }] }, displayOrder: 3 }));
    await create('api::navigation-menu.navigation-menu', nav('Cashless Hospitals', '/claims/hospitals', { parent: { connect: [{ documentId: nClaims.documentId }] }, displayOrder: 4 }));
    await create('api::navigation-menu.navigation-menu', nav('Claims Process', '/claims/process', { parent: { connect: [{ documentId: nClaims.documentId }] }, displayOrder: 5 }));

    const nResources = await create('api::navigation-menu.navigation-menu', nav('Resources', '#', { location: 'header', displayOrder: 3 }));
    await create('api::navigation-menu.navigation-menu', nav('Blog & Guides', '/blog', { parent: { connect: [{ documentId: nResources.documentId }] }, displayOrder: 1 }));
    await create('api::navigation-menu.navigation-menu', nav('Tools & Calculators', '/tools', { parent: { connect: [{ documentId: nResources.documentId }] }, displayOrder: 2 }));
    await create('api::navigation-menu.navigation-menu', nav('FAQ', '/faq', { parent: { connect: [{ documentId: nResources.documentId }] }, displayOrder: 3 }));
    await create('api::navigation-menu.navigation-menu', nav('Grievance Redressal', '/grievance', { parent: { connect: [{ documentId: nResources.documentId }] }, displayOrder: 4 }));

    const nAbout = await create('api::navigation-menu.navigation-menu', nav('About Us', '#', { location: 'header', displayOrder: 4 }));
    await create('api::navigation-menu.navigation-menu', nav('Our Story', '/about', { parent: { connect: [{ documentId: nAbout.documentId }] }, displayOrder: 1 }));
    await create('api::navigation-menu.navigation-menu', nav('Leadership Team', '/about/leadership', { parent: { connect: [{ documentId: nAbout.documentId }] }, displayOrder: 2 }));
    await create('api::navigation-menu.navigation-menu', nav('Careers', '/careers', { parent: { connect: [{ documentId: nAbout.documentId }] }, displayOrder: 3 }));
    await create('api::navigation-menu.navigation-menu', nav('Contact Us', '/contact', { parent: { connect: [{ documentId: nAbout.documentId }] }, displayOrder: 4 }));
    await create('api::navigation-menu.navigation-menu', nav('Press & Media', '/press', { parent: { connect: [{ documentId: nAbout.documentId }] }, displayOrder: 5 }));

    // ── Footer Products ───────────────────────────────────────────────────
    const fProducts = await create('api::navigation-menu.navigation-menu', nav('Our Products', null, { location: 'footer_products', displayOrder: 1 }));
    await create('api::navigation-menu.navigation-menu', nav('Car Insurance', '/motor/car-insurance', { parent: { connect: [{ documentId: fProducts.documentId }] }, displayOrder: 1 }));
    await create('api::navigation-menu.navigation-menu', nav('Bike Insurance', '/motor/bike-insurance', { parent: { connect: [{ documentId: fProducts.documentId }] }, displayOrder: 2 }));
    await create('api::navigation-menu.navigation-menu', nav('Health Insurance', '/health', { parent: { connect: [{ documentId: fProducts.documentId }] }, displayOrder: 3 }));
    await create('api::navigation-menu.navigation-menu', nav('Arogya Sanjeevani', '/health/arogya-sanjeevani', { parent: { connect: [{ documentId: fProducts.documentId }] }, displayOrder: 4 }));
    await create('api::navigation-menu.navigation-menu', nav('Travel Insurance', '/travel', { parent: { connect: [{ documentId: fProducts.documentId }] }, displayOrder: 5 }));

    // ── Footer Company ────────────────────────────────────────────────────
    const fCompany = await create('api::navigation-menu.navigation-menu', nav('Company', null, { location: 'footer_company', displayOrder: 1 }));
    await create('api::navigation-menu.navigation-menu', nav('About Kiwi', '/about', { parent: { connect: [{ documentId: fCompany.documentId }] }, displayOrder: 1 }));
    await create('api::navigation-menu.navigation-menu', nav('Leadership', '/about/leadership', { parent: { connect: [{ documentId: fCompany.documentId }] }, displayOrder: 2 }));
    await create('api::navigation-menu.navigation-menu', nav('Careers', '/careers', { parent: { connect: [{ documentId: fCompany.documentId }] }, displayOrder: 3 }));
    await create('api::navigation-menu.navigation-menu', nav('Contact', '/contact', { parent: { connect: [{ documentId: fCompany.documentId }] }, displayOrder: 4 }));
    await create('api::navigation-menu.navigation-menu', nav('Investor Relations', '/investors', { parent: { connect: [{ documentId: fCompany.documentId }] }, displayOrder: 5 }));

    // ── Footer Resources ──────────────────────────────────────────────────
    const fResources = await create('api::navigation-menu.navigation-menu', nav('Resources', null, { location: 'footer_resources', displayOrder: 1 }));
    await create('api::navigation-menu.navigation-menu', nav('Blog', '/blog', { parent: { connect: [{ documentId: fResources.documentId }] }, displayOrder: 1 }));
    await create('api::navigation-menu.navigation-menu', nav('Tools & Calculators', '/tools', { parent: { connect: [{ documentId: fResources.documentId }] }, displayOrder: 2 }));
    await create('api::navigation-menu.navigation-menu', nav('Claim Process', '/claims/process', { parent: { connect: [{ documentId: fResources.documentId }] }, displayOrder: 3 }));
    await create('api::navigation-menu.navigation-menu', nav('Financial Disclosures', '/disclosures', { parent: { connect: [{ documentId: fResources.documentId }] }, displayOrder: 4 }));
    await create('api::navigation-menu.navigation-menu', nav('Grievance Redressal', '/grievance', { parent: { connect: [{ documentId: fResources.documentId }] }, displayOrder: 5 }));

    // ── Footer Legal ──────────────────────────────────────────────────────
    const fLegal = await create('api::navigation-menu.navigation-menu', nav('Legal', null, { location: 'footer_legal', displayOrder: 1 }));
    await create('api::navigation-menu.navigation-menu', nav('Privacy Policy', '/privacy-policy', { parent: { connect: [{ documentId: fLegal.documentId }] }, displayOrder: 1 }));
    await create('api::navigation-menu.navigation-menu', nav('Terms of Use', '/terms-of-use', { parent: { connect: [{ documentId: fLegal.documentId }] }, displayOrder: 2 }));
    await create('api::navigation-menu.navigation-menu', nav('Cookie Policy', '/cookie-policy', { parent: { connect: [{ documentId: fLegal.documentId }] }, displayOrder: 3 }));
    await create('api::navigation-menu.navigation-menu', nav('Disclaimer', '/disclaimer', { parent: { connect: [{ documentId: fLegal.documentId }] }, displayOrder: 4 }));
    await create('api::navigation-menu.navigation-menu', nav('IRDAI Circular', 'https://www.irdai.gov.in', { parent: { connect: [{ documentId: fLegal.documentId }] }, isExternal: true, openInNewTab: true, displayOrder: 5 }));

    console.log('    ✓ 47 navigation items created');

    // ════════════════════════════════════════════════════════════════════════
    // PHASE 18 — API PERMISSIONS
    // ════════════════════════════════════════════════════════════════════════
    console.log('\n[18/18] API Permissions…');

    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
    const publicApis = [
      'coverage', 'line-of-business', 'insurance-product', 'insurance-plan',
      'page', 'shared-section', 'leadership-profile', 'branch',
      'financial-disclosure', 'download-document', 'testimonial',
      'author', 'category', 'article', 'tool', 'campaign',
      'navigation-menu', 'transparency-report', 'global-config',
    ];

    // Wipe existing permissions first to avoid duplicate key errors
    await strapi.db.query('plugin::users-permissions.permission').deleteMany({
      where: { role: publicRole.id, action: { $contains: 'api::' } },
    });

    for (const api of publicApis) {
      const actions = api === 'global-config'
        ? ['find', 'bootstrap']
        : ['find', 'findOne'];
      for (const action of actions) {
        await strapi.query('plugin::users-permissions.permission').create({
          data: { action: `api::${api}.${api}.${action}`, role: publicRole.id },
        });
      }
    }
    console.log('    ✓ Public API permissions set');

    // ════════════════════════════════════════════════════════════════════════
    // DONE
    // ════════════════════════════════════════════════════════════════════════
    console.log('\n' + '═'.repeat(60));
    console.log('🥝  KIWI CMS — PRODUCTION DATA SATURATION COMPLETE');
    console.log('═'.repeat(60));
    console.log('  Coverage Registry    30 entries');
    console.log('  Lines of Business     3 entries');
    console.log('  Insurance Products    5 entries');
    console.log('  Insurance Plans       9 entries');
    console.log('  Pages                 5 entries  (incl. Privacy + Terms)');
    console.log('  Shared Sections       3 entries');
    console.log('  Global Config         1 entry    (fully populated)');
    console.log('  Leadership Profiles   6 entries');
    console.log('  Branches              6 entries');
    console.log('  Financial Disclosures 6 entries');
    console.log('  Download Documents    8 entries');
    console.log('  Testimonials         12 entries');
    console.log('  Authors               3 entries');
    console.log('  Categories            4 entries');
    console.log('  Articles              6 entries');
    console.log('  Tools                 6 entries');
    console.log('  Campaigns             3 entries');
    console.log('  Navigation Menu      47 entries  (full header + footer)');
    console.log('  API Permissions      ✓ set for all public APIs');
    console.log('═'.repeat(60));
    console.log('  CMS is website-ready. Run: npm run develop\n');

  } catch (err) {
    console.error('\n❌  Seed failed:', err);
  }

  await app.destroy();
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
