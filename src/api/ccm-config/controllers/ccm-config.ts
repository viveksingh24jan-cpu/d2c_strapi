
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::ccm-config.ccm-config', ({ strapi }) => ({
  async resolve(ctx) {
    const { productId, package: sorPackage, lob, sublob, documentType } = ctx.query;

    if (!productId || !sorPackage) {
      return ctx.badRequest('Missing productId or package identifiers from SOR');
    }

    const docType = documentType || 'policy_schedule';

    console.log(`[CCM Resolve] Searching for: ID=${productId}, Pkg=${sorPackage}, Type=${docType}`);

    // 1. Fetch ALL templates for this productId (loosest filter)
    const templates = await strapi.documents('api::ccm-config.ccm-config').findMany({
      filters: {
        sor_product_id: Number(productId),
      },
      status: 'published',
      locale: 'en',
      populate: {
        headerLogo: true,
        sections: true,
        linkedPlan: {
          populate: {
            coverages: {
              populate: {
                icon: true,
              }
            }
          }
        }
      } as any,
    });

    console.log(`[CCM Resolve] Found ${templates.length} templates matching Product ID ${productId}`);

    // 2. Manual filter to see exactly where the mismatch happens
    const template: any = templates.find((t: any) => {
      const pkgMatch = String(t.sor_package) === String(sorPackage);
      const typeMatch = String(t.documentType) === String(docType);
      console.log(`[CCM Resolve] Checking template "${t.templateName}": PkgMatch=${pkgMatch} (${t.sor_package} vs ${sorPackage}), TypeMatch=${typeMatch} (${t.documentType} vs ${docType})`);
      return pkgMatch && typeMatch;
    });

    if (!template) {
      return ctx.notFound(`No PDF Template found for Product ID ${productId}, Package ${sorPackage} and Document Type ${docType}`);
    }

    // 3. Optimized "Flat" Data Transformation for the PDF Engine
    const templateData = template as any;
    
    const flattenedCoverages = templateData.linkedPlan?.coverages?.map((cov: any) => ({
      code: cov.identifier,
      name: cov.name,
      pdfTitle: cov.pdfDisplayName || cov.name,
      legalWording: cov.pdfLegalWording,
      type: cov.type,
      iconUrl: cov.icon?.url || null,
    })) || [];

    const pdfSections = templateData.sections?.map((section: any) => ({
      tag: section.xmlTag,
      title: section.sectionTitle,
      content: section.isDynamicCoverages ? null : section.content,
      isCoverages: section.isDynamicCoverages,
      showSignature: section.showSignature
    })) || [];

    // 4. Return Clean JSON
    return {
      templateMeta: {
        name: templateData.templateName,
        documentType: templateData.documentType,
        logo: templateData.headerLogo?.url || null,
        footer: templateData.footerText,
      },
      pdfStructure: pdfSections,
      coverages: flattenedCoverages,
    };
  },
}));
