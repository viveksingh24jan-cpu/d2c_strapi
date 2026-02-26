async function testAll() {
  const apis = [
    'api::annual-report.annual-report',
    'api::article.article',
    'api::branch.branch',
    'api::category.category',
    'api::download-document.download-document',
    'api::financial-quarter.financial-quarter',
    'api::financial-year.financial-year',
    'api::global-config.global-config',
    'api::grievance-level.grievance-level',
    'api::insurance-product.insurance-product',
    'api::job-listing.job-listing',
    'api::leadership-profile.leadership-profile',
    'api::navigation-menu.navigation-menu',
    'api::ombudsman-office.ombudsman-office',
    'api::page.page',
    'api::redirect.redirect',
    'api::shared-section.shared-section',
    'api::standard-product.standard-product',
    'api::testimonial.testimonial',
    'api::tool.tool',
    'api::tool-category.tool-category'
  ];

  console.log('🧪 Testing All Internal APIs...');
  
  for (const api of apis) {
    try {
      // Use findMany for all, if it's a single type it usually has one entry or specific behavior
      const result = await strapi.documents(api).findMany({ limit: 1 });
      console.log(`✅ \${api}: SUCCESS (\${Array.isArray(result) ? result.length : '1'} entries found)`);
    } catch (err) {
      console.log(`❌ \${api}: FAILED - \${err.message}`);
    }
  }
  process.exit(0);
}

testAll();
