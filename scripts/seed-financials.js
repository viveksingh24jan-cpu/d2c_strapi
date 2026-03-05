
const strapi = require('@strapi/strapi');

async function main() {
  const app = await strapi.createStrapi({ distDir: './dist' }).load();
  
  console.log('🚀 Seeding Financial Reports Hub...');

  // 1. Cleanup existing financials test data
  const existingDocs = await app.documents('api::download-document.download-document').findMany({
    filters: { productCategory: 'investor-relations' }
  });
  for (const doc of existingDocs) {
    await app.documents('api::download-document.download-document').delete({ documentId: doc.documentId });
  }

  const existingPages = await app.documents('api::page.page').findMany({
    filters: { slug: 'financial-reports' }
  });
  for (const page of existingPages) {
    await app.documents('api::page.page').delete({ documentId: page.documentId });
  }

  // 2. Create Documents in Registry
  const reports = [
    { title: 'Annual Report 2024-25', type: 'annual-report', desc: 'Mandatory yearly disclosure' },
    { title: 'Auditor Report', type: 'financial-report', desc: 'Independent auditor verification' },
    { title: 'Balance Sheet / P&L', type: 'financial-report', desc: 'Quarterly financial statements' },
    { title: 'Financial Highlights', type: 'financial-report', desc: 'Key financial performance metrics' },
    { title: 'ESG Report', type: 'financial-report', desc: 'Environmental, Social, and Governance disclosure' }
  ];

  const pdfUrl = 'https://policy.tennessee.edu/wp-content/uploads/PolicyTemplate.pdf';

  for (const r of reports) {
    const slug = r.title.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[()]/g, '')
      .replace(/\//g, '-')
      .replace(/[^a-z0-9-_.~]/g, '');

    await app.documents('api::download-document.download-document').create({
      data: {
        title: r.title,
        slug: slug,
        description: r.desc,
        documentType: r.type === 'annual-report' ? 'annual-report' : 'regulatory-policy', // matching schema enum
        productCategory: 'investor-relations',
        isMandatory: true,
        link: {
          type: 'external_url',
          url: pdfUrl
        },
        status: 'published'
      }
    });
    console.log(`✅ Registry Entry Created: ${r.title}`);
  }

  // 3. Create the Hub Page
  await app.documents('api::page.page').create({
    data: {
      title: 'Financial Reports',
      slug: 'financial-reports',
      template: 'legal',
      content: [
        {
          __component: 'page-builder.hero-section',
          title: 'Financial Reports & Performance',
          subtitle: 'Detailed insights into our financial health and corporate performance.',
          layout: 'centered'
        },
        {
          __component: 'page-builder.document-listing',
          title: 'Investor Relations & Reports',
          description: 'Access our annual reports, financial statements, and performance highlights.',
          category: 'investor-relations',
          viewType: 'list'
        }
      ],
      seo: {
        metaTitle: 'Financial Reports | Kiwi Insurance',
        metaDescription: 'Download annual reports, auditor reports, and financial statements of Kiwi General Insurance.'
      },
      status: 'published'
    }
  });

  console.log('✨ Hub Page Created: /financial-reports');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
