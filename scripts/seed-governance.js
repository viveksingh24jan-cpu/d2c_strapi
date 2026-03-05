
const strapi = require('@strapi/strapi');

async function main() {
  const app = await strapi.createStrapi({ distDir: './dist' }).load();
  
  console.log('🚀 Seeding Corporate Governance Hub (Cleanup & Seed)...');

  // 1. Cleanup existing governance test data
  const existingDocs = await app.documents('api::download-document.download-document').findMany({
    filters: { productCategory: { $in: ['corporate-governance', 'compliance'] } }
  });
  for (const doc of existingDocs) {
    await app.documents('api::download-document.download-document').delete({ documentId: doc.documentId });
  }

  const existingPages = await app.documents('api::page.page').findMany({
    filters: { slug: 'governance-policies' }
  });
  for (const page of existingPages) {
    await app.documents('api::page.page').delete({ documentId: page.documentId });
  }

  // 2. Create Documents in Registry
  const policies = [
    { title: 'Code of Conduct', cat: 'corporate-governance', desc: 'Core governance framework' },
    { title: 'Anti-Bribery / Anti-Fraud Policy', cat: 'corporate-governance', desc: 'Mandatory disclosure' },
    { title: 'Whistleblower Policy', cat: 'corporate-governance', desc: 'Reporting mechanism' },
    { title: 'Stewardship Policy', cat: 'corporate-governance', desc: 'Corporate social responsibility' },
    { title: 'Anti-Money Laundering (AML) Policy', cat: 'compliance', desc: 'IRDAI-mandated compliance' },
    { title: 'Policyholder Protection Policy', cat: 'compliance', desc: 'Ensures customer rights' }
  ];

  const pdfUrl = 'https://policy.tennessee.edu/wp-content/uploads/PolicyTemplate.pdf';

  for (const p of policies) {
    const slug = p.title.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[()]/g, '')
      .replace(/\//g, '-')
      .replace(/[^a-z0-9-_.~]/g, '');

    await app.documents('api::download-document.download-document').create({
      data: {
        title: p.title,
        slug: slug,
        description: p.desc,
        documentType: 'regulatory-policy',
        productCategory: p.cat,
        isMandatory: true,
        link: {
          type: 'external_url',
          url: pdfUrl
        },
        status: 'published'
      }
    });
    console.log(`✅ Registry Entry Created: ${p.title}`);
  }

  // 3. Create the Hub Page
  await app.documents('api::page.page').create({
    data: {
      title: 'Corporate Governance / Policies',
      slug: 'governance-policies',
      template: 'legal',
      content: [
        {
          __component: 'page-builder.hero-section',
          title: 'Corporate Governance & Policies',
          subtitle: 'Our commitment to transparency, ethics, and policyholder protection.',
          layout: 'centered'
        },
        {
          __component: 'page-builder.document-listing',
          title: 'Governance & Ethics',
          description: 'Frameworks governing our corporate behavior and ethical standards.',
          category: 'corporate-governance',
          viewType: 'grid'
        },
        {
          __component: 'page-builder.document-listing',
          title: 'Financial Compliance',
          description: 'Mandatory IRDAI compliance policies and AML frameworks.',
          category: 'compliance',
          viewType: 'list'
        }
      ],
      seo: {
        metaTitle: 'Corporate Governance | Kiwi Insurance',
        metaDescription: 'Access all mandatory IRDAI policies, including AML, Code of Conduct, and Whistleblower policies.'
      },
      status: 'published'
    }
  });

  console.log('✨ Hub Page Created: /governance-policies');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
