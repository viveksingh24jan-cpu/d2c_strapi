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
    const entries = await strapi.documents(uid).findMany({});
    if (entries && entries.length > 0) {
      return await strapi.documents(uid).update({ documentId: entries[0].documentId, data });
    } else {
      return await strapi.documents(uid).create({ data });
    }
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
