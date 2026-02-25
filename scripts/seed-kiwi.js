'use strict';

/**
 * Kiwi General Insurance - Full Seed Script
 * Deletes all existing data and seeds fresh data for all content types.
 * Run: node scripts/seed-kiwi.js
 */

// ─── Helpers ─────────────────────────────────────────────────────────────────

function txt(text) {
  return [{ type: 'paragraph', children: [{ type: 'text', text }] }];
}

function txtMulti(...lines) {
  return lines.map((line) => ({ type: 'paragraph', children: [{ type: 'text', text: line }] }));
}

async function deleteAll(uid) {
  try {
    await strapi.db.query(uid).deleteMany({ where: {} });
  } catch (e) {
    // ignore if table doesn't exist yet
  }
}

async function createEntry(uid, data) {
  try {
    return await strapi.documents(uid).create({ data, status: 'published' });
  } catch (e) {
    console.error(`Error creating ${uid}:`, e.message);
    return null;
  }
}

async function updateSingle(uid, data) {
  try {
    // Look for any version (draft or published)
    let entries = await strapi.documents(uid).findMany({ status: 'draft' });
    if (!entries || entries.length === 0) {
      entries = await strapi.documents(uid).findMany({ status: 'published' });
    }
    let entry;
    if (entries && entries.length > 0) {
      entry = await strapi.documents(uid).update({ documentId: entries[0].documentId, data });
    } else {
      entry = await strapi.documents(uid).create({ data });
    }
    // Publish — silently ignored for non-draftAndPublish types
    if (entry) {
      try { await strapi.documents(uid).publish({ documentId: entry.documentId }); } catch {}
    }
    return entry;
  } catch (e) {
    console.error(`Error updating single ${uid}:`, e.message);
    return null;
  }
}

async function setPublicPermissions(permissions) {
  const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });
  if (!publicRole) return;

  const allCreates = [];
  for (const [controller, actions] of Object.entries(permissions)) {
    for (const action of actions) {
      const actionStr = `api::${controller}.${controller}.${action}`;
      const existing = await strapi.query('plugin::users-permissions.permission').findOne({
        where: { action: actionStr, role: publicRole.id },
      });
      if (!existing) {
        allCreates.push(
          strapi.query('plugin::users-permissions.permission').create({
            data: { action: actionStr, role: publicRole.id },
          })
        );
      }
    }
  }
  await Promise.all(allCreates);
}

// ─── Navigation Menu ──────────────────────────────────────────────────────────

async function seedNavigation() {
  console.log('  Seeding navigation menus...');
  await deleteAll('api::navigation-menu.navigation-menu');

  async function navItem(label, url, displayOrder, parentDocId) {
    const data = { label, url: url || null, displayOrder, isActive: true, isExternal: false };
    if (parentDocId) {
      data.parent = { connect: [{ documentId: parentDocId }] };
    }
    return createEntry('api::navigation-menu.navigation-menu', data);
  }

  async function navTopLevel(label, displayOrder) {
    const data = { label, displayOrder, isActive: true, isExternal: false, location: 'header' };
    return createEntry('api::navigation-menu.navigation-menu', data);
  }

  async function navCategory(label, displayOrder, parentDocId) {
    return navItem(label, '#', displayOrder, parentDocId);
  }

  // ── Products ──
  const products = await navTopLevel('Products', 1);
  const pd = products.documentId;

  const carCat = await navCategory('Car Insurance', 1, pd);
  for (const [i, label] of [
    'Car Insurance', 'Comprehensive Car Insurance', 'Third Party Car Insurance',
    'Pay as you Drive Car Insurance', 'Electric Car Insurance', 'Own Damage Car Insurance',
  ].entries()) {
    await navItem(label, `/car-insurance/${label.toLowerCase().replace(/\s+/g, '-')}`, i + 1, carCat.documentId);
  }

  const twoCat = await navCategory('Two Wheeler Insurance', 2, pd);
  for (const [i, label] of [
    'Two Wheeler Insurance', 'Comprehensive Two Wheeler Insurance', 'Third Party Two Wheeler Insurance',
    'Pay as you Drive Two Wheeler Insurance', 'Electric Two Wheeler Insurance', 'Own Damage Two Wheeler Insurance',
  ].entries()) {
    await navItem(label, `/two-wheeler-insurance/${label.toLowerCase().replace(/\s+/g, '-')}`, i + 1, twoCat.documentId);
  }

  const cvCat = await navCategory('Commercial Vehicle Insurance', 3, pd);
  for (const [i, label] of [
    'Commercial Vehicle Insurance', 'Auto Rickshaw Insurance', 'e-Rickshaw Insurance',
    'Taxi Insurance', 'Tata Ace Insurance', 'Tractor Insurance', 'Truck Insurance', 'JCB Insurance',
  ].entries()) {
    await navItem(label, `/commercial-vehicle-insurance/${label.toLowerCase().replace(/[\s&]+/g, '-')}`, i + 1, cvCat.documentId);
  }

  const healthCat = await navCategory('Health Insurance', 4, pd);
  for (const [i, label] of [
    'Health Insurance', 'Cashless Health Insurance', 'Health Insurance Premium Calculator',
    'Health Insurance Portability', 'Super Top Up Health Insurance', 'Health Insurance for Parents',
    'Group Medical Health Insurance', 'Family Health Insurance', 'Family Floater Health Insurance',
    'Senior Citizens Health Insurance',
  ].entries()) {
    await navItem(label, `/health-insurance/${label.toLowerCase().replace(/\s+/g, '-')}`, i + 1, healthCat.documentId);
  }

  const homeCat = await navCategory('Home Insurance', 5, pd);
  for (const [i, label] of [
    'Bharat Griha Raksha Policy', 'Home Insurance', 'Home Insurance for Home Loan',
  ].entries()) {
    await navItem(label, `/home-insurance/${label.toLowerCase().replace(/\s+/g, '-')}`, i + 1, homeCat.documentId);
  }

  const travelCat = await navCategory('Travel Insurance', 6, pd);
  for (const [i, label] of [
    'International Travel Insurance', 'Multi-Trip Travel Insurance',
    'Schengen Travel Insurance', 'Family Travel Insurance',
  ].entries()) {
    await navItem(label, `/travel-insurance/${label.toLowerCase().replace(/\s+/g, '-')}`, i + 1, travelCat.documentId);
  }

  const bizCat = await navCategory('Business Insurance', 7, pd);
  for (const [i, label] of [
    'Workmen Compensation Insurance', 'Contractors All Risk Insurance',
    'Contractors Plant & Machinery Insurance',
  ].entries()) {
    await navItem(label, `/business-insurance/${label.toLowerCase().replace(/[\s&]+/g, '-')}`, i + 1, bizCat.documentId);
  }

  // ── Claims ──
  const claims = await navTopLevel('Claims', 2);
  const cd = claims.documentId;

  const suppCat = await navCategory('Customer Support', 1, cd);
  for (const [i, [label, url]] of [
    ['Email & Helpline Numbers', '/claims/helpline'],
    ['File Travel Claims', '/claims/travel'],
    ['Check Service Ticket Status', '/claims/ticket-status'],
    ['Download Kiwi App', '/app'],
    ['Download Kiwi Policy', '/claims/download-policy'],
    ['Customer Service', '/contact'],
    ['Check Unclaimed Amount', '/claims/unclaimed-amount'],
    ['Duties and Responsibilities of Surveyor and Loss Assessor', '/claims/surveyor-duties'],
  ].entries()) {
    await navItem(label, url, i + 1, suppCat.documentId);
  }

  const motorCat = await navCategory('Motor Claims', 2, cd);
  for (const [i, [label, url]] of [
    ['File Motor Claims', '/claims/motor'],
    ['Track Motor Claim Status', '/claims/motor/track'],
    ['Kiwi Cashless Garages', '/cashless-garages'],
    ['Workshop Motor Claim Intimation', '/claims/motor/workshop'],
    ['Upload Pending Documents', '/claims/documents'],
  ].entries()) {
    await navItem(label, url, i + 1, motorCat.documentId);
  }

  const healthClaimCat = await navCategory('Health Claims', 3, cd);
  for (const [i, [label, url]] of [
    ['File Health Claims', '/claims/health'],
    ['Track Health Claim Status', '/claims/health/track'],
    ['Kiwi Cashless Hospitals', '/cashless-hospitals'],
    ['List of Excluded Hospitals', '/claims/health/excluded-hospitals'],
    ['Anywhere Cashless Hospitals', '/claims/health/anywhere-cashless'],
    ['Wellness Benefits', '/claims/health/wellness'],
  ].entries()) {
    await navItem(label, url, i + 1, healthClaimCat.documentId);
  }

  const grievanceCat = await navCategory('Grievance Redressal', 4, cd);
  await navItem('Grievance Redressal Procedure', '/grievance-redressal', 1, grievanceCat.documentId);

  // ── Resources ──
  const resources = await navTopLevel('Resources', 3);
  const rd = resources.documentId;

  const exclusiveCat = await navCategory('Exclusive Features', 1, rd);
  for (const [i, [label, url]] of [
    ['Check Pending Challans', '/tools/check-challans'],
    ['Check Credit Score for FREE', '/tools/credit-score'],
    ['Check PUC Expiry', '/tools/puc-expiry'],
    ['Vehicle Owner Details (VAHAN)', '/tools/vahan'],
    ['Vehicle Report Card', '/tools/vehicle-report'],
    ['Documents in DigiLocker', '/tools/digilocker'],
    ['Generate ABHA ID', '/tools/abha-id'],
    ['Insurance Dictionary', '/resources/insurance-dictionary'],
  ].entries()) {
    await navItem(label, url, i + 1, exclusiveCat.documentId);
  }

  const reportCat = await navCategory('Report', 2, rd);
  for (const [i, [label, url]] of [
    ['Transparency Report 13.0', '/reports/transparency-13'],
    ['Transparency Report 12.0', '/reports/transparency-12'],
    ['Transparency Report 11.0', '/reports/transparency-11'],
    ['Transparency Report 10.0', '/reports/transparency-10'],
    ['Transparency Report 9.0', '/reports/transparency-9'],
    ['Previous Reports', '/reports'],
  ].entries()) {
    await navItem(label, url, i + 1, reportCat.documentId);
  }

  const othersCat = await navCategory('Others', 3, rd);
  await navItem("IRDAI's Call Centre Feedback Survey", 'https://bimabharosa.irdai.gov.in', 1, othersCat.documentId);

  // ── Footer Menus ──
  const footerProducts = [
    { loc: 'footer_products', label: 'Car Insurance', url: '/car-insurance', order: 1 },
    { loc: 'footer_products', label: 'Two Wheeler Insurance', url: '/two-wheeler-insurance', order: 2 },
    { loc: 'footer_products', label: 'Health Insurance', url: '/health-insurance', order: 3 },
    { loc: 'footer_products', label: 'Home Insurance', url: '/home-insurance', order: 4 },
    { loc: 'footer_products', label: 'Travel Insurance', url: '/travel-insurance', order: 5 },
    { loc: 'footer_products', label: 'Commercial Vehicle Insurance', url: '/commercial-vehicle-insurance', order: 6 },
    { loc: 'footer_company', label: 'About Us', url: '/about', order: 1 },
    { loc: 'footer_company', label: 'Careers', url: '/careers', order: 2 },
    { loc: 'footer_company', label: 'Board of Directors', url: '/about/board', order: 3 },
    { loc: 'footer_company', label: 'Public Disclosures', url: '/disclosures', order: 4 },
    { loc: 'footer_company', label: 'Annual Reports', url: '/annual-reports', order: 5 },
    { loc: 'footer_company', label: 'Branch Locator', url: '/branches', order: 6 },
    { loc: 'footer_resources', label: 'Insurance Dictionary', url: '/resources/insurance-dictionary', order: 1 },
    { loc: 'footer_resources', label: 'Transparency Reports', url: '/reports', order: 2 },
    { loc: 'footer_resources', label: 'Downloads', url: '/downloads', order: 3 },
    { loc: 'footer_resources', label: 'File a Claim', url: '/claims', order: 4 },
    { loc: 'footer_resources', label: 'Track Claim', url: '/claims/track', order: 5 },
    { loc: 'footer_legal', label: 'Privacy Policy', url: '/legal/privacy-policy', order: 1 },
    { loc: 'footer_legal', label: 'Terms of Use', url: '/legal/terms-of-use', order: 2 },
    { loc: 'footer_legal', label: 'Disclaimer', url: '/legal/disclaimer', order: 3 },
    { loc: 'footer_legal', label: 'Grievance Redressal', url: '/grievance-redressal', order: 4 },
    { loc: 'footer_legal', label: "Policyholder's Protection Policy", url: '/legal/policyholder-protection', order: 5 },
  ];

  for (const item of footerProducts) {
    await createEntry('api::navigation-menu.navigation-menu', {
      label: item.label,
      url: item.url,
      location: item.loc,
      displayOrder: item.order,
      isActive: true,
      isExternal: false,
    });
  }
}

// ─── Legal Pages ──────────────────────────────────────────────────────────────

async function seedLegalPages() {
  console.log('  Seeding legal pages...');
  await deleteAll('api::legal-page.legal-page');

  const pages = [
    {
      title: 'Privacy Policy',
      slug: 'privacy-policy',
      isMandatory: true,
      lastUpdated: '2025-01-01T00:00:00.000Z',
      content: txtMulti(
        'Kiwi General Insurance Company Limited ("Kiwi", "we", "us", or "our") is committed to protecting your personal information and your right to privacy.',
        'This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website www.kiwiinsurance.in or use our mobile application.',
        'We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products, participate in activities on the website, or otherwise contact us.',
        'The personal data we collect includes: Name, Email Address, Mobile Number, Date of Birth, PAN Number, Aadhaar Number (optional), Address, Vehicle Registration Number, and other insurance-related data.',
        'We use the information to process insurance applications, send policy documents, handle claims, improve our services, comply with legal obligations, and send marketing communications (with your consent).',
        'We do not sell your personal data to third parties. We may share data with our insurance partners, reinsurers, regulatory authorities (IRDAI), and service providers strictly for the purpose of providing insurance services.',
        'You have the right to access, correct, or delete your personal data. Please contact us at privacy@kiwiinsurance.in for any requests.',
        'For grievances, contact our Data Protection Officer at dpo@kiwiinsurance.in.'
      ),
    },
    {
      title: 'Terms of Use',
      slug: 'terms-of-use',
      isMandatory: true,
      lastUpdated: '2025-01-01T00:00:00.000Z',
      content: txtMulti(
        'Welcome to Kiwi General Insurance Company Limited. By accessing or using our website, you agree to be bound by these Terms of Use.',
        'The website and its content are owned by Kiwi General Insurance Company Limited (CIN: U66010MH2024PLC000001). All intellectual property rights are reserved.',
        'You may use this website only for lawful purposes. You must not misuse our website by introducing viruses or attempting to gain unauthorised access.',
        'The information on this website is for general informational purposes only. For complete policy terms and conditions, please refer to the policy document.',
        'Kiwi General Insurance is regulated by the Insurance Regulatory and Development Authority of India (IRDAI). Registration No. 190.',
        'We reserve the right to modify these terms at any time. Continued use of the website constitutes acceptance of the modified terms.',
        'These terms are governed by the laws of India, and any disputes shall be subject to the exclusive jurisdiction of courts in Mumbai.'
      ),
    },
    {
      title: "Policyholder's Protection Policy",
      slug: 'policyholders-protection-policy',
      isMandatory: true,
      lastUpdated: '2025-01-01T00:00:00.000Z',
      content: txtMulti(
        "Kiwi General Insurance Company Limited is committed to the fair treatment of policyholders as per IRDAI's Protection of Policyholders' Interests Regulations, 2017.",
        'Your rights as a policyholder include: Receiving a policy document within 15 days of issuance; a Free Look Period of 15 days for new policies; the right to receive timely and accurate information.',
        'We ensure transparency in all our products, pricing, and claim processes. Our products are designed to meet your genuine insurance needs.',
        'Claim settlement is our top priority. We aim to settle all claims within the timelines prescribed by IRDAI.',
        "In case of any grievance, you may approach our Grievance Redressal Officer or IRDAI's Bima Bharosa portal at https://bimabharosa.irdai.gov.in."
      ),
    },
    {
      title: 'Anti-Money Laundering (AML) Policy',
      slug: 'anti-money-laundering-aml-policy',
      isMandatory: true,
      lastUpdated: '2025-01-01T00:00:00.000Z',
      content: txtMulti(
        'Kiwi General Insurance Company Limited has adopted a robust Anti-Money Laundering (AML) and Know Your Customer (KYC) Policy in compliance with the Prevention of Money Laundering Act, 2002 (PMLA) and IRDAI guidelines.',
        'We are committed to preventing our services from being used for money laundering, terrorist financing, or any other illegal activities.',
        'We perform Customer Due Diligence (CDD) for all customers including identity verification using PAN, Aadhaar, and other government-issued IDs.',
        'Our Principal Officer for AML compliance: Mr. Rajiv Sharma, Chief Compliance Officer, compliance@kiwiinsurance.in, +91-22-6600-0100.',
        'Suspicious transactions are reported to the Financial Intelligence Unit – India (FIU-IND) as required by law.',
        'All employees undergo mandatory AML training annually.'
      ),
    },
    {
      title: 'Whistle Blower / Anti-Fraud Policy',
      slug: 'whistle-blower-anti-fraud-policy',
      isMandatory: true,
      lastUpdated: '2025-01-01T00:00:00.000Z',
      content: txtMulti(
        'Kiwi General Insurance Company Limited is committed to the highest standards of ethical conduct and corporate governance.',
        'This policy provides a mechanism for employees, agents, and stakeholders to report genuine concerns about unethical behaviour, fraud, corruption, or legal violations without fear of retaliation.',
        'You can report concerns anonymously through our confidential whistleblower hotline at 1800-XXX-XXXX or by email at whistleblower@kiwiinsurance.in.',
        'The Audit Committee of the Board oversees the whistleblower mechanism and ensures that reported concerns are investigated promptly and impartially.',
        'No person reporting in good faith will face retaliation, adverse employment action, or victimisation.',
        'The identity of the reporter will be kept confidential to the extent possible.'
      ),
    },
    {
      title: 'Disclaimer',
      slug: 'disclaimer',
      isMandatory: true,
      lastUpdated: '2025-01-01T00:00:00.000Z',
      content: txtMulti(
        'The information on this website is provided by Kiwi General Insurance Company Limited for general informational purposes only.',
        'While we make every effort to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics contained on the website.',
        'Insurance is the subject matter of solicitation. For complete details on coverage, terms, conditions, exclusions, and limitations, please read the sales brochure and policy wordings carefully before concluding a sale.',
        'Section 41 of the Insurance Act, 1938: No person shall allow or offer to allow, either directly or indirectly, as an inducement to any person to take out or renew or continue an insurance policy, any rebate of the whole or part of the commission payable or any rebate of the premium shown on the policy.',
        'Kiwi General Insurance Company Limited. IRDAI Registration No. 190. CIN: U66010MH2024PLC000001. Registered Office: Kiwi House, 12th Floor, Bandra Kurla Complex, Mumbai 400051.'
      ),
    },
  ];

  for (const page of pages) {
    await createEntry('api::legal-page.legal-page', { ...page, publishedAt: new Date().toISOString() });
  }
}

// ─── Grievance ────────────────────────────────────────────────────────────────

async function seedGrievance() {
  console.log('  Seeding grievance levels...');
  await deleteAll('api::grievance-level.grievance-level');

  const levels = [
    {
      levelNumber: 1,
      levelName: 'Level 1: Customer Care',
      email: 'customercare@kiwiinsurance.in',
      phone: '1800-123-4567',
      description: txtMulti(
        'You can register your grievance by calling our 24x7 toll-free number 1800-123-4567 or by writing to customercare@kiwiinsurance.in.',
        'Our customer care team will acknowledge your grievance within 24 hours and aim to resolve it within 7 working days.'
      ),
      escalationTimeline: '7 working days',
    },
    {
      levelNumber: 2,
      levelName: 'Level 2: Grievance Officer',
      email: 'grievance@kiwiinsurance.in',
      phone: '+91-22-6600-0200',
      description: txtMulti(
        'If your grievance is not resolved within 7 working days at Level 1, you may escalate to our Grievance Officer.',
        'Grievance Officer: Ms. Priya Nair, grievance@kiwiinsurance.in, +91-22-6600-0200.',
        'The Grievance Officer will respond within 7 working days of receipt of your complaint.'
      ),
      escalationTimeline: '7 working days from Level 1 escalation',
    },
    {
      levelNumber: 3,
      levelName: 'Level 3: Principal Nodal Officer',
      email: 'pno@kiwiinsurance.in',
      phone: '+91-22-6600-0300',
      description: txtMulti(
        'If you are still dissatisfied, you may approach our Principal Nodal Officer.',
        'Principal Nodal Officer: Mr. Anil Mehta, pno@kiwiinsurance.in, +91-22-6600-0300.',
        "If your grievance remains unresolved, you may approach IRDAI's Integrated Grievance Management System (IGMS) at igms.irda.gov.in or call IRDAI Bima Bharosa: 155255."
      ),
      escalationTimeline: '7 working days from Level 2 escalation',
    },
  ];

  for (const level of levels) {
    await createEntry('api::grievance-level.grievance-level', level);
  }

  await updateSingle('api::grievance-page.grievance-page', {
    introText: txtMulti(
      'Kiwi General Insurance Company Limited is committed to providing prompt and effective grievance redressal.',
      'Our grievance redressal process has 3 levels. Please follow the escalation matrix below. If your grievance remains unresolved, you may approach the Insurance Ombudsman in your region.'
    ),
    bimaBharosaLink: 'https://bimabharosa.irdai.gov.in',
  });
}

// ─── Ombudsman Offices ────────────────────────────────────────────────────────

async function seedOmbudsman() {
  console.log('  Seeding ombudsman offices...');
  await deleteAll('api::ombudsman-office.ombudsman-office');

  const offices = [
    {
      city: 'Mumbai',
      territorialJurisdiction: 'Maharashtra, Goa, Daman & Diu, Dadra & Nagar Haveli',
      address: txt('3rd Floor, Jeevan Seva Annexe, S.V. Road, Santacruz (W), Mumbai – 400 054'),
      phone: '022-69038821/23',
      email: 'bimalokpal.mumbai@ecoi.co.in',
    },
    {
      city: 'Delhi',
      territorialJurisdiction: 'Delhi & Rajasthan',
      address: txt('2/2 A, Universal Insurance Building, Asaf Ali Road, New Delhi – 110 002'),
      phone: '011-23239633',
      email: 'bimalokpal.delhi@ecoi.co.in',
    },
    {
      city: 'Chennai',
      territorialJurisdiction: 'Tamil Nadu, Pondicherry Town and Karaikal (which are part of Pondicherry)',
      address: txt('Fatima Akhtar Court, 4th Floor, 453 (old 312), Anna Salai, Teynampet, Chennai – 600 018'),
      phone: '044-24333668 / 24335284',
      email: 'bimalokpal.chennai@ecoi.co.in',
    },
    {
      city: 'Kolkata',
      territorialJurisdiction: 'West Bengal, Sikkim, Andaman & Nicobar Islands',
      address: txt('Hindustan Bldg. Annexe, 4th Floor, 4, C.R. Avenue, Kolkata – 700 072'),
      phone: '033-22124339 / 22124340',
      email: 'bimalokpal.kolkata@ecoi.co.in',
    },
    {
      city: 'Bengaluru',
      territorialJurisdiction: 'Karnataka',
      address: txt('Jeevan Soudha Building, PID No. 57-27-N-19, Ground Floor, 19/19, 24th Main Road, JP Nagar, 1st Phase, Bengaluru – 560 078'),
      phone: '080-26652048 / 26652049',
      email: 'bimalokpal.bengaluru@ecoi.co.in',
    },
    {
      city: 'Hyderabad',
      territorialJurisdiction: 'Andhra Pradesh, Telangana, Yanam (Part of Pondicherry)',
      address: txt('6-2-46, 1st floor, "Moin Court", Lane Opp. Saleem Function Palace, A. C. Guards, Lakdi-Ka-Pool, Hyderabad - 500 004'),
      phone: '040-23312122',
      email: 'bimalokpal.hyderabad@ecoi.co.in',
    },
    {
      city: 'Ahmedabad',
      territorialJurisdiction: 'Gujarat, Dadra & Nagar Haveli, Daman and Diu',
      address: txt('Office of the Insurance Ombudsman, Jeevan Prakash Building, 6th floor, Tilak Marg, Relief Road, Ahmedabad – 380 001'),
      phone: '079-25501201/02/05/06',
      email: 'bimalokpal.ahmedabad@ecoi.co.in',
    },
    {
      city: 'Pune',
      territorialJurisdiction: 'Parts of Maharashtra excluding Mumbai Metropolitan Region',
      address: txt('Jeevan Darshan Bldg., 3rd Floor, C.T.S. No. s. 195 to 198, N.C. Kelkar Road, Narayan Peth, Pune – 411 030'),
      phone: '022-41312820',
      email: 'bimalokpal.pune@ecoi.co.in',
    },
    {
      city: 'Jaipur',
      territorialJurisdiction: 'Rajasthan',
      address: txt('Jeevan Nidhi – II Bldg., Gr. Floor, Bhawani Singh Marg, Jaipur - 302 005'),
      phone: '0141-2740363',
      email: 'bimalokpal.jaipur@ecoi.co.in',
    },
    {
      city: 'Lucknow',
      territorialJurisdiction: 'Districts of Uttar Pradesh : Laitpur, Jhansi, Mahoba, Hamirpur, Banda, Chitrakoot, Allahabad, Mirzapur, Sonbhabdra, Fatehpur, Pratapgarh, Jaunpur,Varanasi, Gazipur, Jalaun, Kanpur, Lucknow, Unnao, Sitapur, Lakhimpur, Bahraich, Barabanki, Raebareli, Sravasti, Gonda, Faizabad, Amethi, Kaushambi, Balrampur, Basti, Ambedkarnagar, Sultanpur, Maharajgang, Santkabirnagar, Azamgarh, Kushinagar, Gorakhpur, Deoria, Mau',
      address: txt('6th Floor, Jeevan Bhawan, Phase-II, Nawal Kishore Road, Hazratganj, Lucknow - 226 001'),
      phone: '0522-2231330 / 2231331',
      email: 'bimalokpal.lucknow@ecoi.co.in',
    },
  ];

  for (const office of offices) {
    await createEntry('api::ombudsman-office.ombudsman-office', office);
  }
}

// ─── Downloads ────────────────────────────────────────────────────────────────

async function seedDownloads() {
  console.log('  Seeding download documents...');
  await deleteAll('api::download-document.download-document');

  const docs = [
    { title: 'Health Insurance Proposal Form', documentType: 'proposal-form', productCategory: 'health', version: 'v2.1', uploadedOn: '2025-01-10' },
    { title: 'Health Insurance Claim Form', documentType: 'claim-form', productCategory: 'health', version: 'v3.0', uploadedOn: '2025-01-10' },
    { title: 'Health Insurance Policy Wording', documentType: 'policy-wording', productCategory: 'health', version: 'v1.5', uploadedOn: '2024-10-01' },
    { title: 'Health Insurance Customer Information Sheet', documentType: 'customer-information-sheet', productCategory: 'health', version: 'v1.0', uploadedOn: '2024-10-01' },
    { title: 'Motor Insurance Proposal Form', documentType: 'proposal-form', productCategory: 'motor', version: 'v2.3', uploadedOn: '2025-01-15' },
    { title: 'Motor Insurance Claim Form', documentType: 'claim-form', productCategory: 'motor', version: 'v2.0', uploadedOn: '2025-01-15' },
    { title: 'Home Insurance Proposal Form', documentType: 'proposal-form', productCategory: 'property', version: 'v1.2', uploadedOn: '2024-12-01' },
    { title: 'Home Insurance Policy Wording', documentType: 'policy-wording', productCategory: 'property', version: 'v1.0', uploadedOn: '2024-12-01' },
  ];

  for (const doc of docs) {
    await createEntry('api::download-document.download-document', doc);
  }
}

// ─── Branches ─────────────────────────────────────────────────────────────────

async function seedBranches() {
  console.log('  Seeding branches...');
  await deleteAll('api::branch.branch');

  const branches = [
    {
      branchName: 'Kiwi General Insurance – Head Office',
      branchType: 'head-office',
      address: txt('Kiwi House, 12th Floor, Bandra Kurla Complex, Bandra (East), Mumbai – 400 051'),
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400051',
      phone: '+91-22-6600-0100',
      email: 'headoffice@kiwiinsurance.in',
      workingHours: 'Monday – Friday: 9:00 AM – 6:00 PM',
    },
    {
      branchName: 'Kiwi General Insurance – Delhi Regional Office',
      branchType: 'regional-office',
      address: txt('Level 8, Tolstoy House, 15 Tolstoy Marg, Connaught Place, New Delhi – 110 001'),
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110001',
      phone: '+91-11-4150-0200',
      email: 'delhi@kiwiinsurance.in',
      workingHours: 'Monday – Friday: 9:00 AM – 6:00 PM',
    },
    {
      branchName: 'Kiwi General Insurance – Bengaluru Regional Office',
      branchType: 'regional-office',
      address: txt('5th Floor, Prestige Meridian II, 30 M.G. Road, Bengaluru – 560 001'),
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
      phone: '+91-80-4600-0300',
      email: 'bengaluru@kiwiinsurance.in',
      workingHours: 'Monday – Friday: 9:00 AM – 6:00 PM',
    },
    {
      branchName: 'Kiwi General Insurance – Chennai Branch',
      branchType: 'branch-office',
      address: txt('3rd Floor, Arihant Nitco Park, 90 Dr. Radhakrishnan Salai, Mylapore, Chennai – 600 004'),
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600004',
      phone: '+91-44-4500-0400',
      email: 'chennai@kiwiinsurance.in',
      workingHours: 'Monday – Friday: 9:00 AM – 6:00 PM',
    },
    {
      branchName: 'Kiwi General Insurance – Hyderabad Branch',
      branchType: 'branch-office',
      address: txt('4th Floor, Cyber Towers, Hitech City, Madhapur, Hyderabad – 500 081'),
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500081',
      phone: '+91-40-6600-0500',
      email: 'hyderabad@kiwiinsurance.in',
      workingHours: 'Monday – Friday: 9:00 AM – 6:00 PM',
    },
    {
      branchName: 'Kiwi General Insurance – Pune Branch',
      branchType: 'branch-office',
      address: txt('2nd Floor, Nucleus Mall, 1 Church Road, Camp, Pune – 411 001'),
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
      phone: '+91-20-6600-0600',
      email: 'pune@kiwiinsurance.in',
      workingHours: 'Monday – Friday: 9:00 AM – 6:00 PM',
    },
  ];

  for (const branch of branches) {
    await createEntry('api::branch.branch', branch);
  }
}

// ─── Standard Products ────────────────────────────────────────────────────────

async function seedStandardProducts() {
  console.log('  Seeding standard products...');
  await deleteAll('api::standard-product.standard-product');

  const products = [
    {
      productName: 'Arogya Sanjeevani Policy',
      productType: 'arogya-sanjeevani',
      features: txtMulti(
        'Standard health insurance policy as mandated by IRDAI.',
        'Coverage for hospitalisation expenses including room rent, ICU charges, surgeon fees, anaesthesia, and medicine costs.',
        'Coverage for day-care treatments, AYUSH treatment, and pre/post hospitalisation (30/60 days).',
        'Cumulative Bonus: 5% for every claim-free year, up to 50% of Sum Insured.',
        'Sub-limit on room rent: 2% of Sum Insured per day, maximum Rs. 5,000 per day.'
      ),
      eligibility: txtMulti(
        'Entry Age: 18 to 65 years (adults), 3 months to 25 years (dependent children).',
        'Family Floater option available for self, spouse, and dependent children.',
        'Pre-existing diseases covered after 48 months of continuous coverage.',
        'No medical examination required up to 45 years of age.'
      ),
      sumInsuredRange: 'Rs. 1 Lakh to Rs. 5 Lakh',
      premiumRange: 'Starting from Rs. 3,000 per annum',
      isActive: true,
      publishedAt: new Date().toISOString(),
    },
    {
      productName: 'Saral Suraksha Bima',
      productType: 'saral-suraksha-bima',
      features: txtMulti(
        'Standard personal accident insurance policy mandated by IRDAI.',
        'Covers Accidental Death, Permanent Total Disablement, Permanent Partial Disablement, and Temporary Total Disablement.',
        'Accidental Death Benefit: 100% of Sum Insured paid to nominee.',
        'Permanent Total Disablement: 100% of Sum Insured.',
        'Child Education Benefit: 10% of Sum Insured (max Rs. 2 Lakh) per dependent child in case of Accidental Death.',
        'Transportation of Mortal Remains: Rs. 5,000.'
      ),
      eligibility: txtMulti(
        'Entry Age: 18 to 70 years.',
        'Policy can be taken individually or as a group policy.',
        'Occupational hazard loading may apply based on occupation type.',
        'Available for Indian residents and NRIs.'
      ),
      sumInsuredRange: 'Rs. 2.5 Lakh to Rs. 1 Crore',
      premiumRange: 'Starting from Rs. 499 per annum',
      isActive: true,
      publishedAt: new Date().toISOString(),
    },
    {
      productName: 'Bharat Griha Raksha Policy',
      productType: 'bharat-griha-raksha',
      features: txtMulti(
        'Standard home insurance policy mandated by IRDAI providing comprehensive protection for your home.',
        'Building Cover: Protection against fire, lightning, earthquake, flood, storm, cyclone, landslide, and other natural perils.',
        'Home Contents Cover: Optional cover for household contents and personal belongings.',
        'Terrorism Cover: Available as an add-on.',
        'Rent for Alternate Accommodation: Up to 20% of annual premium for up to 12 months if home is uninhabitable.',
        'Key and Lock Replacement: Up to Rs. 5,000.',
        'No depreciation deduction for partial loss claims.'
      ),
      eligibility: txtMulti(
        'Available for owned residential buildings and rented accommodations.',
        'Applicable for individual house owners, apartment owners, and tenants.',
        'Property should be used for residential purposes.',
        'Buildings of all construction types are eligible; rates vary by construction type.'
      ),
      sumInsuredRange: 'Based on reinstatement value of building and declared value of contents',
      premiumRange: 'Starting from Rs. 2,500 per annum',
      isActive: true,
      publishedAt: new Date().toISOString(),
    },
  ];

  for (const product of products) {
    await createEntry('api::standard-product.standard-product', product);
  }
}

// ─── Board Members ────────────────────────────────────────────────────────────

async function seedBoardMembers() {
  console.log('  Seeding board members...');
  await deleteAll('api::leadership-profile.leadership-profile');

  const members = [
    {
      name: 'Mr. Suresh Prabhu',
      designation: 'Chairman & Independent Director',
      category: 'Board',
      din: '00123456',
      bio: txtMulti(
        'Mr. Suresh Prabhu is a distinguished finance professional with over 35 years of experience in banking, insurance, and financial services.',
        'He has previously served as Managing Director at State Bank of India and as Chairman of General Insurance Corporation of India.',
        'He holds a post-graduate degree in Commerce from Mumbai University and a diploma in Insurance from the Insurance Institute of India.'
      ),
      displayOrder: 1,
      publishedAt: new Date().toISOString(),
    },
    {
      name: 'Ms. Deepa Krishnamurthy',
      designation: 'Managing Director & CEO',
      category: 'KMP',
      din: '00234567',
      bio: txtMulti(
        'Ms. Deepa Krishnamurthy is the founding MD & CEO of Kiwi General Insurance, bringing 28 years of experience in general insurance.',
        'Prior to Kiwi, she was the Chief Operating Officer at Bajaj Allianz General Insurance for 10 years.',
        'She is a Fellow of the Insurance Institute of India and an alumna of IIM Ahmedabad.'
      ),
      displayOrder: 2,
      publishedAt: new Date().toISOString(),
    },
    {
      name: 'Mr. Rajiv Sharma',
      designation: 'Whole-Time Director & Chief Financial Officer',
      category: 'KMP',
      din: '00345678',
      bio: txtMulti(
        'Mr. Rajiv Sharma is a Chartered Accountant with over 22 years of experience in financial management and insurance.',
        'He has previously served as CFO at HDFC ERGO General Insurance Company.',
        'He is responsible for financial reporting, investment management, and actuarial oversight at Kiwi.'
      ),
      displayOrder: 3,
      publishedAt: new Date().toISOString(),
    },
    {
      name: 'Dr. Anita Desai',
      designation: 'Independent Director',
      category: 'Board',
      din: '00456789',
      bio: txtMulti(
        'Dr. Anita Desai is an independent director with expertise in public health, healthcare policy, and insurance.',
        'She is a retired IAS officer who served as Additional Secretary in the Ministry of Health and Family Welfare.',
        'She brings valuable perspective on health insurance product design and regulatory compliance.'
      ),
      displayOrder: 4,
      publishedAt: new Date().toISOString(),
    },
    {
      name: 'Mr. Vikram Oberoi',
      designation: 'Non-Executive Director',
      category: 'Board',
      din: '00567890',
      bio: txtMulti(
        'Mr. Vikram Oberoi represents the promoter group on the Board of Kiwi General Insurance.',
        'He is the Group CFO of Oberoi Ventures, the promoter entity, with extensive experience in venture capital and startup investments.',
        'He has been instrumental in securing strategic partnerships for Kiwi with leading technology companies.'
      ),
      displayOrder: 5,
      publishedAt: new Date().toISOString(),
    },
    {
      name: 'Ms. Priya Nair',
      designation: 'Company Secretary & Chief Compliance Officer',
      category: 'KMP',
      din: null,
      bio: txtMulti(
        'Ms. Priya Nair is a Fellow Member of the Institute of Company Secretaries of India with 18 years of experience.',
        'She oversees corporate governance, IRDAI regulatory compliance, and secretarial functions at Kiwi.',
        'She also serves as the Grievance Redressal Officer for Kiwi General Insurance.'
      ),
      displayOrder: 6,
      publishedAt: new Date().toISOString(),
    },
  ];

  for (const member of members) {
    const data = { ...member };
    if (!data.din) delete data.din;
    await createEntry('api::leadership-profile.leadership-profile', data);
  }
}

// ─── Public Disclosures ───────────────────────────────────────────────────────

async function seedPublicDisclosures() {
  console.log('  Seeding public disclosures...');
  await deleteAll('api::financial-quarter.financial-quarter');
  await deleteAll('api::financial-year.financial-year');

  const fy2425 = await createEntry('api::financial-year.financial-year', {
    label: '2024-25',
    startYear: 2024,
    isActive: true,
  });

  const quarters = [
    {
      quarter: 'Q1',
      financialYear: { connect: [{ documentId: fy2425.documentId }] },
      documents: [
        { __component: 'disclosures.disclosure-document', formName: 'NL-1', title: 'Premium Register Q1 2024-25', description: 'Nil' },
        { __component: 'disclosures.disclosure-document', formName: 'NL-2', title: 'Claims Register Q1 2024-25', description: 'Nil' },
        { __component: 'disclosures.disclosure-document', formName: 'NL-3', title: 'Financial Statements Q1 2024-25', description: 'Nil' },
      ],
    },
    {
      quarter: 'Q2',
      financialYear: { connect: [{ documentId: fy2425.documentId }] },
      documents: [
        { __component: 'disclosures.disclosure-document', formName: 'NL-1', title: 'Premium Register Q2 2024-25', description: 'Nil' },
        { __component: 'disclosures.disclosure-document', formName: 'NL-2', title: 'Claims Register Q2 2024-25', description: 'Nil' },
      ],
    },
    {
      quarter: 'Q3',
      financialYear: { connect: [{ documentId: fy2425.documentId }] },
      documents: [
        { __component: 'disclosures.disclosure-document', formName: 'NL-1', title: 'Premium Register Q3 2024-25', description: 'Nil' },
      ],
    },
    {
      quarter: 'Q4',
      financialYear: { connect: [{ documentId: fy2425.documentId }] },
      documents: [
        { __component: 'disclosures.disclosure-document', formName: 'NL-1', title: 'Premium Register Q4 2024-25', description: 'Nil' },
      ],
    },
  ];

  for (const q of quarters) {
    await createEntry('api::financial-quarter.financial-quarter', q);
  }
}

// ─── Job Listings ─────────────────────────────────────────────────────────────

async function seedJobs() {
  console.log('  Seeding job listings...');
  await deleteAll('api::job-listing.job-listing');

  const jobs = [
    {
      jobTitle: 'Senior Product Manager – Health Insurance',
      department: 'Product',
      location: 'Mumbai',
      jobType: 'full-time',
      description: txtMulti(
        'We are looking for a Senior Product Manager to lead our Health Insurance product portfolio.',
        'You will work closely with actuarial, technology, distribution, and operations teams to design and launch innovative health insurance products.',
        'This is a strategic role based at our Mumbai Head Office.'
      ),
      requirements: txtMulti(
        '8+ years of experience in insurance product management, preferably in health insurance.',
        "MBA from a reputed institution or Fellow of the Insurance Institute of India.",
        'Strong understanding of IRDAI regulations and health insurance market dynamics.',
        'Excellent stakeholder management and communication skills.'
      ),
      applyLink: '/careers/apply/senior-pm-health',
      isActive: true,
      postedOn: '2025-01-15',
      publishedAt: new Date().toISOString(),
    },
    {
      jobTitle: 'Software Engineer – Full Stack (React / Node.js)',
      department: 'Technology',
      location: 'Bengaluru',
      jobType: 'full-time',
      description: txtMulti(
        'Join our technology team to build the next-generation insurance platform for Kiwi.',
        'You will design and develop web applications, APIs, and micro-services that power our customer-facing products and internal systems.'
      ),
      requirements: txtMulti(
        '3-6 years of experience in full-stack development.',
        'Proficiency in React, Node.js, TypeScript, and REST APIs.',
        'Experience with cloud platforms (AWS/GCP) and containerisation (Docker/Kubernetes).',
        "Bachelor's degree in Computer Science or equivalent."
      ),
      applyLink: '/careers/apply/sde-fullstack',
      isActive: true,
      postedOn: '2025-01-20',
      publishedAt: new Date().toISOString(),
    },
    {
      jobTitle: 'Claims Manager – Motor',
      department: 'Claims',
      location: 'Delhi',
      jobType: 'full-time',
      description: txtMulti(
        'We are seeking an experienced Claims Manager to lead our Motor Claims team in Delhi.',
        'You will oversee the end-to-end claims settlement process, manage a team of surveyors and claims executives, and ensure timely and fair settlement of motor insurance claims.'
      ),
      requirements: txtMulti(
        '7+ years of experience in motor claims management.',
        'Graduate in any discipline; Associate of the Insurance Institute of India preferred.',
        'Strong knowledge of Motor Vehicles Act and motor insurance tariffs.',
        'Team management and vendor management experience required.'
      ),
      applyLink: '/careers/apply/claims-manager-motor',
      isActive: true,
      postedOn: '2025-02-01',
      publishedAt: new Date().toISOString(),
    },
    {
      jobTitle: 'Point of Sales Person (POSP) – Insurance Agent',
      department: 'Distribution',
      location: 'Pan India',
      jobType: 'pos-agent',
      description: txtMulti(
        'Become a Kiwi POSP and earn attractive commissions by selling insurance products.',
        'As a POSP (Point of Sales Person), you will help customers choose the right insurance products across motor, health, and home insurance categories.',
        'Flexible working hours with unlimited earning potential.'
      ),
      requirements: txtMulti(
        'Minimum 10th standard pass.',
        'Must complete the mandatory IRDAI-approved POSP training (15 hours).',
        'Smartphone with internet connectivity.',
        'Good communication skills in local language.'
      ),
      applyLink: '/careers/apply/posp',
      isActive: true,
      postedOn: '2025-02-10',
      publishedAt: new Date().toISOString(),
    },
    {
      jobTitle: 'Digital Marketing Manager',
      department: 'Marketing',
      location: 'Mumbai',
      jobType: 'full-time',
      description: txtMulti(
        'We are looking for a data-driven Digital Marketing Manager to drive online growth for Kiwi.',
        'You will own our SEO, SEM, social media, and performance marketing initiatives to grow our direct-to-consumer channel.',
        'This role will work closely with the product and technology teams.'
      ),
      requirements: txtMulti(
        '5-8 years of digital marketing experience, preferably in BFSI.',
        'Strong expertise in Google Ads, Meta Ads, SEO, and analytics platforms.',
        'MBA in Marketing preferred.',
        'Experience managing budgets of Rs. 1 Crore+ per month.'
      ),
      applyLink: '/careers/apply/digital-marketing-manager',
      isActive: true,
      postedOn: '2025-02-15',
      publishedAt: new Date().toISOString(),
    },
  ];

  for (const job of jobs) {
    await createEntry('api::job-listing.job-listing', job);
  }
}

// ─── Annual Reports ───────────────────────────────────────────────────────────

async function seedAnnualReports() {
  console.log('  Seeding annual reports...');
  await deleteAll('api::annual-report.annual-report');

  const reports = [
    { year: '2023-24', reportType: 'annual-report', publishedOn: '2024-09-30' },
    { year: '2023-24', reportType: 'esg-report', publishedOn: '2024-10-15' },
  ];

  for (const report of reports) {
    await createEntry('api::annual-report.annual-report', report);
  }
}

// ─── Global Config ────────────────────────────────────────────────────────────

async function seedGlobalConfig() {
  console.log('  Seeding global config...');

  await updateSingle('api::global-config.global-config', {
    siteName: 'Kiwi General Insurance',
    siteDescription: 'Kiwi General Insurance – Simple, Fast & Affordable Insurance for Every Indian. Car, Two Wheeler, Health, Home, Travel & Business Insurance.',
    irdaiRegNumber: '190',
    cinNumber: 'U66010MH2024PLC000001',
    registeredAddress: 'Kiwi House, 12th Floor, Bandra Kurla Complex, Bandra (East), Mumbai – 400 051, Maharashtra, India',
    irdaiUrl: 'https://www.irdai.gov.in',
    gicUrl: 'https://www.gicofindia.com',
    bimaBharosaUrl: 'https://bimabharosa.irdai.gov.in',
    headerPhoneNumber: '1800-123-4567',
    headerEmailAddress: 'care@kiwiinsurance.in',
    supportEmail: 'care@kiwiinsurance.in',
    footerDescription: 'Kiwi General Insurance Company Limited is a general insurance company registered with IRDAI. We offer simple, transparent, and affordable insurance solutions for every Indian.',
    footerCopyright: '© 2025 Kiwi General Insurance Company Limited. All rights reserved.',
    privacyPolicyUrl: '/legal/privacy-policy',
    termsOfServiceUrl: '/legal/terms-of-use',
    section41Warning: txtMulti(
      'Section 41 of the Insurance Act, 1938: No person shall allow or offer to allow, either directly or indirectly, as an inducement to any person to take out or renew or continue an insurance policy, any rebate of the whole or part of the commission payable or any rebate of the premium shown on the policy, nor shall any person taking out or renewing or continuing a policy accept any rebate, except such rebate as may be allowed in accordance with the published prospectuses or tables of the insurer.',
      'Kiwi General Insurance Company Limited | IRDAI Reg. No. 190 | CIN: U66010MH2024PLC000001 | Registered Office: Kiwi House, 12th Floor, BKC, Mumbai 400051.',
      'Insurance is the subject matter of solicitation. For more details on risk factors, terms, and conditions, please read the sales brochure carefully before concluding a sale.'
    ),
    socialLinks: [
      { platform: 'facebook', url: 'https://facebook.com/kiwiinsurance' },
      { platform: 'twitter', url: 'https://twitter.com/kiwiinsurance' },
      { platform: 'linkedin', url: 'https://linkedin.com/company/kiwiinsurance' },
      { platform: 'instagram', url: 'https://instagram.com/kiwiinsurance' },
      { platform: 'youtube', url: 'https://youtube.com/@kiwiinsurance' },
    ],
    appLinks: {
      appStoreUrl: 'https://apps.apple.com/in/app/kiwi-insurance',
      playStoreUrl: 'https://play.google.com/store/apps/details?id=in.kiwiinsurance',
    },
    defaultSeo: {
      metaTitle: 'Kiwi General Insurance – Car, Health, Home & Travel Insurance Online',
      metaDescription: 'Buy affordable general insurance online at Kiwi. Get instant quotes for car insurance, health insurance, home insurance, travel insurance and more. IRDAI Reg. 190.',
      keywords: 'car insurance, health insurance, home insurance, travel insurance, two wheeler insurance, general insurance, India',
      metaRobots: 'index, follow',
    },
  });
}

// ─── Insurance Products ───────────────────────────────────────────────────────

async function seedInsuranceProducts() {
  console.log('  Seeding insurance products...');
  await deleteAll('api::insurance-product.insurance-product');

  const products = [
    {
      productName: 'Car Insurance',
      tagline: 'Drive with Confidence',
      productDescription: txt('Comprehensive car insurance covering own damage, third party liability, and personal accident. Get instant quotes online.'),
      startingPrice: 2094,
      isFeatured: true,
      badge: 'Most Popular',
      ctaText: 'Get Quote',
      ctaUrl: '/car-insurance',
      isActive: true,
      sortOrder: 1,
      publishedAt: new Date().toISOString(),
    },
    {
      productName: 'Two Wheeler Insurance',
      tagline: 'Ride Safe, Stay Protected',
      productDescription: txt('Protect your bike or scooter with our comprehensive two wheeler insurance. Cashless repairs at 2000+ garages.'),
      startingPrice: 499,
      isFeatured: true,
      badge: null,
      ctaText: 'Get Quote',
      ctaUrl: '/two-wheeler-insurance',
      isActive: true,
      sortOrder: 2,
      publishedAt: new Date().toISOString(),
    },
    {
      productName: 'Health Insurance',
      tagline: 'Your Health, Our Priority',
      productDescription: txt('Comprehensive health insurance plans for individuals and families. Cashless treatment at 10,000+ hospitals across India.'),
      startingPrice: 3000,
      isFeatured: true,
      badge: 'Tax Benefit u/s 80D',
      ctaText: 'Get Quote',
      ctaUrl: '/health-insurance',
      isActive: true,
      sortOrder: 3,
      publishedAt: new Date().toISOString(),
    },
    {
      productName: 'Home Insurance',
      tagline: 'Protect What Matters Most',
      productDescription: txt('Secure your home against fire, natural disasters, theft, and more. Covers building structure and home contents.'),
      startingPrice: 2500,
      isFeatured: false,
      badge: null,
      ctaText: 'Get Quote',
      ctaUrl: '/home-insurance',
      isActive: true,
      sortOrder: 4,
      publishedAt: new Date().toISOString(),
    },
    {
      productName: 'Travel Insurance',
      tagline: 'Travel Without Worries',
      productDescription: txt('International and domestic travel insurance covering medical emergencies, trip cancellation, lost baggage, and passport loss.'),
      startingPrice: 299,
      isFeatured: false,
      badge: 'Schengen Approved',
      ctaText: 'Get Quote',
      ctaUrl: '/travel-insurance',
      isActive: true,
      sortOrder: 5,
      publishedAt: new Date().toISOString(),
    },
    {
      productName: 'Commercial Vehicle Insurance',
      tagline: 'Keep Your Business Moving',
      productDescription: txt('Insurance for trucks, buses, taxis, auto rickshaws, and other commercial vehicles. Third party and comprehensive covers available.'),
      startingPrice: 4500,
      isFeatured: false,
      badge: null,
      ctaText: 'Get Quote',
      ctaUrl: '/commercial-vehicle-insurance',
      isActive: true,
      sortOrder: 6,
      publishedAt: new Date().toISOString(),
    },
  ];

  for (const product of products) {
    const data = { ...product };
    if (!data.badge) delete data.badge;
    await createEntry('api::insurance-product.insurance-product', data);
  }
}

// ─── Categories (Blog) ───────────────────────────────────────────────────────

async function seedCategories() {
  console.log('  Seeding blog categories...');
  await deleteAll('api::category.category');

  const cats = [
    { name: 'Car Insurance', slug: 'car-insurance', description: 'Tips, guides, and news about car insurance in India.' },
    { name: 'Health Insurance', slug: 'health-insurance', description: 'Everything you need to know about health insurance plans and claims.' },
    { name: 'Two Wheeler Insurance', slug: 'two-wheeler-insurance', description: 'Guides on bike and scooter insurance in India.' },
    { name: 'Travel Insurance', slug: 'travel-insurance', description: 'Travel smart with the right insurance coverage.' },
    { name: 'Home Insurance', slug: 'home-insurance', description: 'Protect your home and belongings with home insurance.' },
    { name: 'Insurance Guide', slug: 'insurance-guide', description: 'Beginner-friendly insurance concepts and how-to guides.' },
  ];

  const created = {};
  for (const cat of cats) {
    const entry = await createEntry('api::category.category', cat);
    created[cat.slug] = entry;
  }
  return created;
}

// ─── Articles (Blog) ──────────────────────────────────────────────────────────

async function seedArticles(categories) {
  console.log('  Seeding blog articles...');
  await deleteAll('api::article.article');

  const articles = [
    {
      title: 'Car Insurance Renewal: 5 Things You Must Check Before Renewing',
      slug: 'car-insurance-renewal-checklist',
      excerpt: "Renewing your car insurance? Don't just click \"renew\". Here are 5 critical things every car owner must check before renewing their policy.",
      authorName: 'Kiwi Editorial Team',
      readTime: 5,
      isFeatured: true,
      categories: { connect: [{ documentId: categories['car-insurance'].documentId }] },
      blocks: [
        {
          __component: 'shared.rich-text',
          body: "## Why Renewal Is More Than a Formality\n\nMost Indian car owners simply renew the same policy year after year without reviewing it. This can cost you dearly at the time of a claim.\n\n### 1. Check Your No Claim Bonus (NCB)\nIf you haven't filed a claim in the past year, you're entitled to a No Claim Bonus discount of 20-50% on your Own Damage premium. Make sure it's applied.\n\n### 2. Verify the IDV (Insured Declared Value)\nThe IDV is the current market value of your car. A lower IDV means a lower premium but lower compensation in case of total loss. Don't let the insurer depreciate your IDV too aggressively.\n\n### 3. Review Your Add-Ons\nDo you have Zero Depreciation cover? Engine Protection? Roadside Assistance? Review which add-ons are worth continuing and which can be dropped.\n\n### 4. Compare Before You Renew\nDon't auto-renew without comparing. A quick comparison on Kiwi can save you 20-40% on premiums.\n\n### 5. Update Personal Details\nHave you moved? Changed your car's CNG kit status? Update these or your claims might be rejected.",
        },
      ],
      publishedAt: new Date().toISOString(),
      seo: {
        metaTitle: 'Car Insurance Renewal Checklist – 5 Things to Check | Kiwi Insurance',
        metaDescription: 'Renewing your car insurance? Check these 5 things: NCB, IDV, add-ons, comparison, and personal details. Save up to 40% on renewal.',
        keywords: 'car insurance renewal, NCB, IDV, car insurance India',
      },
    },
    {
      title: 'Health Insurance Explained: Deductibles, Co-pay, and Sub-limits',
      slug: 'health-insurance-deductible-copay-sublimit',
      excerpt: 'Confused by health insurance jargon? We explain deductibles, co-pay, sub-limits, and room rent caps in plain English.',
      authorName: 'Dr. Meera Iyer',
      readTime: 7,
      isFeatured: true,
      categories: { connect: [{ documentId: categories['health-insurance'].documentId }] },
      blocks: [
        {
          __component: 'shared.rich-text',
          body: '## Decoding Health Insurance Terms\n\nHealth insurance policies are packed with terms that can be confusing. Here\'s a plain-language guide.\n\n### Deductible\nA deductible is the amount you pay out-of-pocket before your insurer pays anything. For example, if your deductible is Rs. 5,000 and your hospital bill is Rs. 50,000, you pay Rs. 5,000 and the insurer pays Rs. 45,000.\n\n### Co-payment (Co-pay)\nCo-pay is a percentage of the claim you always pay, regardless of the total amount. A 10% co-pay on a Rs. 1 lakh bill means you pay Rs. 10,000.\n\n### Sub-limits\nMany policies put caps on specific expenses. For example, a policy might cover Rs. 5 lakh total but limit room rent to Rs. 3,000/day and cataract surgery to Rs. 40,000.\n\n### Room Rent Cap\nOne of the most misunderstood clauses. If your policy has a room rent cap of Rs. 3,000/day and you take a room at Rs. 5,000/day, your insurer proportionally reduces ALL charges — not just the room rent.\n\n### Kiwi Tip\nKiwi\'s health insurance plans have minimal sub-limits and zero co-pay options. Get a quote today.',
        },
      ],
      publishedAt: new Date().toISOString(),
      seo: {
        metaTitle: 'Health Insurance Deductible, Co-pay & Sub-limits Explained | Kiwi',
        metaDescription: 'Understand health insurance deductibles, co-pay, sub-limits and room rent caps in plain language. Make better insurance decisions.',
        keywords: 'health insurance deductible, co-pay, sub-limits, room rent cap India',
      },
    },
    {
      title: 'Third Party vs Comprehensive Car Insurance: Which One Do You Need?',
      slug: 'third-party-vs-comprehensive-car-insurance',
      excerpt: 'Third party insurance is mandatory by law, but is it enough? We compare third party and comprehensive car insurance to help you decide.',
      authorName: 'Kiwi Editorial Team',
      readTime: 4,
      isFeatured: false,
      categories: { connect: [{ documentId: categories['car-insurance'].documentId }] },
      blocks: [
        {
          __component: 'shared.rich-text',
          body: '## Third Party vs Comprehensive: The Key Difference\n\nThird Party Insurance covers damage or injury caused to a **third person** by your vehicle. It does NOT cover damage to your own car.\n\nComprehensive Insurance covers:\n- Damage to your own car (own damage)\n- Third party liability (mandatory)\n- Personal accident cover\n- Optional add-ons like zero depreciation, engine protection, etc.\n\n## When Should You Choose Third Party?\n- Your car is very old (10+ years) and its market value is low\n- You park in a safe area and rarely drive long distances\n- Budget is very tight\n\n## When Should You Choose Comprehensive?\n- Your car is less than 5 years old\n- You drive in heavy traffic or flood-prone areas\n- You have a car loan (most banks require comprehensive cover)\n\n## Our Recommendation\nFor cars less than 7 years old, always go comprehensive. The premium difference is often less than Rs. 3,000–5,000 per year.',
        },
      ],
      publishedAt: new Date().toISOString(),
      seo: {
        metaTitle: 'Third Party vs Comprehensive Car Insurance – Which to Choose? | Kiwi',
        metaDescription: 'Third party or comprehensive? Compare coverage, price, and benefits to pick the right car insurance for your needs.',
        keywords: 'third party car insurance, comprehensive car insurance, difference, India',
      },
    },
    {
      title: 'Travel Insurance for Schengen Visa: Everything You Need to Know',
      slug: 'travel-insurance-schengen-visa-guide',
      excerpt: 'Applying for a Schengen visa? Travel insurance is mandatory. Here\'s exactly what coverage you need and how to get it right.',
      authorName: 'Arjun Kapoor',
      readTime: 6,
      isFeatured: false,
      categories: { connect: [{ documentId: categories['travel-insurance'].documentId }] },
      blocks: [
        {
          __component: 'shared.rich-text',
          body: '## Schengen Travel Insurance: The Basics\n\nAll 27 Schengen countries require visitors to have travel insurance that covers at least **€30,000 in medical emergencies** including repatriation.\n\n## What Must the Policy Cover?\n1. Emergency medical expenses — minimum €30,000\n2. Emergency repatriation to India\n3. Coverage valid throughout the entire Schengen zone\n4. Coverage for the entire duration of your trip\n\n## What Kiwi\'s Schengen Travel Insurance Covers\n- Medical emergencies: up to $5,00,000\n- Trip cancellation / curtailment\n- Lost baggage and passport\n- Personal liability\n- Flight delays\n\n## Common Mistakes to Avoid\n- **Don\'t buy the cheapest plan** — the embassy checks the coverage amount\n- **Start date must match your travel date** — not earlier\n- **Cover all Schengen countries you\'ll visit** — even if only in transit\n\n## How to Get Your Kiwi Schengen Insurance Certificate\nPurchase online at kiwiinsurance.in and download the policy document instantly. Most embassies accept it.',
        },
      ],
      publishedAt: new Date().toISOString(),
      seo: {
        metaTitle: 'Schengen Visa Travel Insurance Guide for Indians | Kiwi Insurance',
        metaDescription: 'Need travel insurance for Schengen visa? Learn the mandatory requirements, coverage minimums, and get your policy in minutes.',
        keywords: 'schengen travel insurance India, schengen visa insurance, travel insurance Europe',
      },
    },
    {
      title: 'How to File a Motor Insurance Claim with Kiwi: Step-by-Step Guide',
      slug: 'how-to-file-motor-insurance-claim-kiwi',
      excerpt: 'Got into an accident? Don\'t panic. Here\'s a simple step-by-step guide to filing your motor insurance claim with Kiwi and getting your car repaired quickly.',
      authorName: 'Kiwi Claims Team',
      readTime: 5,
      isFeatured: true,
      categories: { connect: [{ documentId: categories['car-insurance'].documentId }, { documentId: categories['insurance-guide'].documentId }] },
      blocks: [
        {
          __component: 'shared.rich-text',
          body: '## Step 1: Stay Calm and Ensure Safety\nMove your vehicle to a safe spot if possible. Check for injuries. Call 108 (ambulance) or 100 (police) if needed.\n\n## Step 2: Document the Damage\nTake clear photos and videos of:\n- All damaged parts of your car\n- The other vehicle(s) involved\n- The accident scene\n- Road conditions\n\n## Step 3: Inform Kiwi Immediately\nCall our 24/7 claims helpline: **1800-123-4567** or use the Kiwi app.\nDon\'t delay — most policies require intimation within 24–48 hours.\n\n## Step 4: Get a Claim Reference Number\nNote your Claim Reference Number — you\'ll need it to track your claim.\n\n## Step 5: Choose Cashless or Reimbursement\n**Cashless:** Take your car to a Kiwi network garage. We pay the garage directly.\n**Reimbursement:** Get it repaired anywhere, pay out of pocket, submit bills to us.\n\n## Step 6: Survey and Approval\nA Kiwi surveyor will inspect the damage (usually within 24 hours at cashless garages).\n\n## Step 7: Repair and Delivery\nFor cashless claims at network garages, repairs begin immediately after surveyor approval. No payment needed at delivery (except deductible/depreciation if applicable).\n\n## Documents Required\n- Copy of your Kiwi policy\n- Driving licence\n- Vehicle RC\n- FIR (for theft or third-party accidents)',
        },
      ],
      publishedAt: new Date().toISOString(),
      seo: {
        metaTitle: 'How to File a Motor Insurance Claim with Kiwi | Step-by-Step',
        metaDescription: 'File your motor insurance claim with Kiwi in 7 simple steps. 24/7 helpline, cashless garages, fast claim settlement.',
        keywords: 'motor insurance claim process, how to file car insurance claim, kiwi insurance claim',
      },
    },
  ];

  for (const article of articles) {
    await createEntry('api::article.article', article);
  }
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

async function seedTestimonials() {
  console.log('  Seeding testimonials...');
  await deleteAll('api::testimonial.testimonial');

  const testimonials = [
    {
      customerName: 'Rahul Verma, Delhi',
      testimonialContent: txtMulti(
        '"My car was damaged in a flood last monsoon. I filed the claim on the Kiwi app at 11 PM, and by next morning a surveyor was at my doorstep. The cashless repair was done at a nearby garage within 4 days. 10/10 experience."'
      ),
      publishedAt: new Date().toISOString(),
    },
    {
      customerName: 'Sunita Rao, Bengaluru',
      testimonialContent: txtMulti(
        '"I was sceptical about buying insurance online, but Kiwi made it so simple. Got my health insurance in 10 minutes, policy document in my inbox immediately. When my mother was hospitalised, the cashless process was seamless."'
      ),
      publishedAt: new Date().toISOString(),
    },
    {
      customerName: 'Amar Singh, Mumbai',
      testimonialContent: txtMulti(
        '"Switched from my old insurer to Kiwi for car insurance. Saved Rs. 4,200 on the same coverage and got Zero Depreciation add-on included. The premium calculator on their website is super transparent — no hidden fees."'
      ),
      publishedAt: new Date().toISOString(),
    },
    {
      customerName: 'Priya Mehta, Pune',
      testimonialContent: txtMulti(
        '"The Kiwi travel insurance I bought for my Europe trip was accepted by the French embassy without any issues. When my luggage was delayed in Paris, I filed a claim online and got reimbursed within a week of returning. Highly recommended."'
      ),
      publishedAt: new Date().toISOString(),
    },
    {
      customerName: 'Venkat Krishnan, Chennai',
      testimonialContent: txtMulti(
        '"Got a Kiwi POSP licence and it has been a great side income. The app makes it easy to generate quotes and share policies with clients. The commission payouts are on time. Proud to be a Kiwi partner."'
      ),
      publishedAt: new Date().toISOString(),
    },
  ];

  for (const t of testimonials) {
    await createEntry('api::testimonial.testimonial', t);
  }
}

// ─── Tool Categories & Tools ──────────────────────────────────────────────────

async function seedTools() {
  console.log('  Seeding tool categories and tools...');
  await deleteAll('api::tool.tool');
  await deleteAll('api::tool-category.tool-category');

  const vehicleCat = await createEntry('api::tool-category.tool-category', {
    name: 'Vehicle Tools',
    slug: 'vehicle-tools',
    description: 'Free tools to check vehicle-related information.',
    displayOrder: 1,
  });

  const healthCat = await createEntry('api::tool-category.tool-category', {
    name: 'Health Tools',
    slug: 'health-tools',
    description: 'Free health and insurance calculation tools.',
    displayOrder: 2,
  });

  const financialCat = await createEntry('api::tool-category.tool-category', {
    name: 'Financial Tools',
    slug: 'financial-tools',
    description: 'Check your financial health for free.',
    displayOrder: 3,
  });

  const vehicleTools = [
    { name: 'Check Pending Challans', slug: 'check-pending-challans', shortDescription: 'Instantly check all pending traffic challans linked to any vehicle registration number.', url: '/tools/check-challans', badge: 'Free', isActive: true },
    { name: 'Check PUC Expiry', slug: 'check-puc-expiry', shortDescription: 'Check when your vehicle\'s Pollution Under Control (PUC) certificate expires.', url: '/tools/puc-expiry', badge: 'Free', isActive: true },
    { name: 'Vehicle Owner Details (VAHAN)', slug: 'vehicle-owner-details', shortDescription: 'Look up vehicle owner details, RTO registration, and insurance status using the vehicle number.', url: '/tools/vahan', badge: 'Free', isActive: true },
    { name: 'Vehicle Report Card', slug: 'vehicle-report-card', shortDescription: 'Get a complete history report for any vehicle — accidents, ownership transfers, blacklisting.', url: '/tools/vehicle-report', badge: 'Popular', isActive: true },
    { name: 'Documents in DigiLocker', slug: 'documents-digilocker', shortDescription: 'Access your driving licence, RC, and other vehicle documents stored in DigiLocker.', url: '/tools/digilocker', badge: 'New', isActive: true },
  ];

  const healthTools = [
    { name: 'Generate ABHA ID', slug: 'generate-abha-id', shortDescription: 'Create your Ayushman Bharat Health Account (ABHA) ID to store and access your health records digitally.', url: '/tools/abha-id', badge: 'New', isActive: true },
    { name: 'Health Insurance Premium Calculator', slug: 'health-insurance-calculator', shortDescription: 'Calculate your health insurance premium based on age, sum insured, and family composition.', url: '/tools/health-calculator', badge: 'Popular', isActive: true },
  ];

  const financialTools = [
    { name: 'Check Credit Score for FREE', slug: 'check-credit-score', shortDescription: 'Check your CIBIL credit score for free instantly. No impact on your credit score.', url: '/tools/credit-score', badge: 'Free', isActive: true },
    { name: 'Insurance Premium Calculator', slug: 'insurance-premium-calculator', shortDescription: 'Compare insurance premium across car, bike, health and home insurance products.', url: '/tools/premium-calculator', badge: 'Trending', isActive: true },
  ];

  for (const t of vehicleTools) {
    await createEntry('api::tool.tool', { ...t, isExternal: false, tool_category: { connect: [{ documentId: vehicleCat.documentId }] }, publishedAt: new Date().toISOString() });
  }
  for (const t of healthTools) {
    await createEntry('api::tool.tool', { ...t, isExternal: false, tool_category: { connect: [{ documentId: healthCat.documentId }] }, publishedAt: new Date().toISOString() });
  }
  for (const t of financialTools) {
    await createEntry('api::tool.tool', { ...t, isExternal: false, tool_category: { connect: [{ documentId: financialCat.documentId }] }, publishedAt: new Date().toISOString() });
  }

  return { vehicleCat, healthCat, financialCat };
}

// ─── Tool Hub Page ────────────────────────────────────────────────────────────

async function seedToolHubPage(toolCategories) {
  console.log('  Seeding tool hub page...');
  const allTools = await strapi.documents('api::tool.tool').findMany({ status: 'published' });
  const featuredDocIds = allTools.slice(0, 4).map((t) => ({ documentId: t.documentId }));

  await updateSingle('api::tool-hub-page.tool-hub-page', {
    pageTitle: 'Free Insurance & Vehicle Tools',
    pageSubtitle: 'Powerful free tools for every Indian — check challans, credit score, PUC expiry, ABHA ID, and more.',
    featuredSection: {
      title: 'Most Used Tools',
      description: 'Quick access to our most popular free tools.',
      tools: { connect: featuredDocIds },
    },
    publishedAt: new Date().toISOString(),
    seo: {
      metaTitle: 'Free Insurance & Vehicle Tools | Kiwi General Insurance',
      metaDescription: 'Use Kiwi\'s free tools: check pending challans, credit score, PUC expiry, ABHA ID, vehicle details and more. 100% free, no login required.',
      keywords: 'check challans, PUC expiry, vehicle details, ABHA ID, credit score free India',
    },
  });
}

// ─── Homepage ─────────────────────────────────────────────────────────────────

async function seedHomepage() {
  console.log('  Seeding homepage...');

  await updateSingle('api::homepage.homepage', {
    heroTitle: 'Insurance Made Simple.\nGet Covered in Minutes.',
    heroSubtitle: 'Affordable car, health, home & travel insurance. Instant policy, 10-minute claim filing, 99.2% claim settlement ratio.',
    heroBadge: 'IRDAI Approved • Reg. No. 190',
    heroCtaText: 'Get Your Free Quote',
    heroCtaUrl: '/products',
    stats: [
      { label: 'Happy Customers', value: '50 Lakh+' },
      { label: 'Claim Settlement Ratio', value: '99.2%' },
      { label: 'Cashless Garages', value: '10,000+' },
      { label: 'Cashless Hospitals', value: '10,000+' },
      { label: 'App Rating', value: '4.5 ★' },
      { label: 'Products', value: '40+' },
    ],
    promoCards: [
      {
        title: 'Monsoon Motor Protection',
        description: 'Protect your car against flood damage this monsoon. Add Engine Protection cover for just Rs. 500 extra.',
        ctaText: 'Add Engine Protection',
        ctaUrl: '/car-insurance?addon=engine-protection',
        promoImage: null,
      },
      {
        title: 'Health Insurance Tax Benefit',
        description: 'Save up to Rs. 25,000 in taxes u/s 80D. Buy health insurance before March 31st.',
        ctaText: 'Buy Health Insurance',
        ctaUrl: '/health-insurance',
        promoImage: null,
      },
    ],
    ctaSection: txtMulti(
      'Still not sure? Talk to our insurance experts.',
      'Call 1800-123-4567 (Toll-Free, 24/7) | Email: care@kiwiinsurance.in'
    ),
    publishedAt: new Date().toISOString(),
    seo: {
      metaTitle: 'Kiwi General Insurance – Buy Car, Health, Home & Travel Insurance Online',
      metaDescription: 'India\'s most trusted general insurance company. Buy car, health, home, travel & two-wheeler insurance online. Instant policy, 99.2% claim settlement, IRDAI Reg. 190.',
      keywords: 'car insurance, health insurance, home insurance, travel insurance, general insurance India, buy insurance online',
      ogTitle: 'Kiwi General Insurance – Simple, Fast, Affordable',
      ogDescription: 'Get insured in 10 minutes. 50 Lakh+ happy customers. IRDAI Approved. Car, Health, Home & Travel Insurance.',
      metaRobots: 'index, follow',
    },
  });
}

// ─── About Page ───────────────────────────────────────────────────────────────

async function seedAbout() {
  console.log('  Seeding about page...');

  await updateSingle('api::about.about', {
    title: 'About Kiwi General Insurance',
    blocks: [
      {
        __component: 'shared.rich-text',
        body: '## Our Story\n\nKiwi General Insurance Company Limited was founded in 2024 with a simple mission: make insurance simple, transparent, and accessible for every Indian.\n\nWe are a Mumbai-based, IRDAI-licensed general insurance company (Registration No. 190) offering car, two-wheeler, health, home, travel, and commercial insurance products entirely online.\n\n## Our Mission\n\nTo build India\'s most trusted insurance brand by combining technology, transparency, and genuine care for our customers.\n\n## Why Kiwi?\n\n**Simple**: Buy any insurance in under 10 minutes. No agent visits, no paperwork, no phone calls needed.\n\n**Transparent**: Every policy detail, price, and exclusion is clearly explained. No hidden clauses.\n\n**Fast Claims**: File a claim in 5 minutes on our app. Our AI-powered claims system processes most claims within 24 hours.\n\n**Affordable**: By cutting out middlemen and using technology, we pass the savings directly to you.\n\n## Our Numbers\n\n- 50 Lakh+ insured customers\n- 99.2% claim settlement ratio\n- 10,000+ cashless garages across India\n- 10,000+ cashless hospitals across India\n- 40+ insurance products\n- Present in 500+ cities\n\n## Regulatory Information\n\nKiwi General Insurance Company Limited is registered with and regulated by the Insurance Regulatory and Development Authority of India (IRDAI).\n\n- **IRDAI Registration No.**: 190\n- **CIN**: U66010MH2024PLC000001\n- **Registered Office**: Kiwi House, 12th Floor, Bandra Kurla Complex, Mumbai – 400 051\n',
      },
      {
        __component: 'shared.quote',
        title: 'Our Promise',
        body: '"At Kiwi, we believe insurance should be a source of comfort, not confusion. We are committed to being there for you at every step — from purchase to claim." — Deepa Krishnamurthy, MD & CEO',
      },
    ],
  });
}

// ─── Public Permissions ───────────────────────────────────────────────────────

async function setAllPublicPermissions() {
  console.log('  Setting public permissions...');
  await setPublicPermissions({
    'navigation-menu': ['find', 'findOne'],
    'legal-page': ['find', 'findOne'],
    'grievance-level': ['find', 'findOne'],
    'grievance-page': ['find'],
    'ombudsman-office': ['find', 'findOne'],
    'download-document': ['find', 'findOne'],
    'branch': ['find', 'findOne'],
    'standard-product': ['find', 'findOne'],
    'job-listing': ['find', 'findOne'],
    'annual-report': ['find', 'findOne'],
    'leadership-profile': ['find', 'findOne'],
    'financial-year': ['find', 'findOne'],
    'financial-quarter': ['find', 'findOne'],
    'insurance-product': ['find', 'findOne'],
    'global-config': ['find'],
    'article': ['find', 'findOne'],
    'category': ['find', 'findOne'],
    'testimonial': ['find', 'findOne'],
    'tool': ['find', 'findOne'],
    'tool-category': ['find', 'findOne'],
    'tool-hub-page': ['find'],
    'homepage': ['find'],
    'about': ['find'],
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();
  app.log.level = 'error';

  console.log('\n🥝 Kiwi General Insurance – Seeding...\n');

  try {
    await seedGlobalConfig();
    await seedNavigation();
    await seedLegalPages();
    await seedGrievance();
    await seedOmbudsman();
    await seedDownloads();
    await seedBranches();
    await seedStandardProducts();
    await seedBoardMembers();
    await seedPublicDisclosures();
    await seedJobs();
    await seedAnnualReports();
    await seedInsuranceProducts();
    const categories = await seedCategories();
    await seedArticles(categories);
    await seedTestimonials();
    const toolCategories = await seedTools();
    await seedToolHubPage(toolCategories);
    await seedHomepage();
    await seedAbout();
    await setAllPublicPermissions();
    console.log('\n✅ Seed complete!\n');
  } catch (err) {
    console.error('\n❌ Seed failed:', err);
  }

  await app.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
