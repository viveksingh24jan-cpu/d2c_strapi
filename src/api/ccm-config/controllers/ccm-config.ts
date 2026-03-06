
import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::ccm-config.ccm-config', ({ strapi }) => ({
  async resolve(ctx) {
    const { productId, package: sorPackage, lob, sublob, documentType } = ctx.query;

    if (!productId || !sorPackage) {
      return ctx.badRequest('Missing productId or package identifiers from SOR');
    }

    const docType = documentType || 'policy_schedule';

    // 1. Fetch the Template Mapping with high-performance query
    const template = await strapi.documents('api::ccm-config.ccm-config').findFirst({
      filters: {
        sor_product_id: productId,
        sor_package: sorPackage,
        documentType: docType,
        ...(lob && { sor_lob: lob }),
        ...(sublob && { sor_sublob: sublob }),
      },
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

    if (!template) {
      return ctx.notFound(`No PDF Template found for Product ID ${productId}, Package ${sorPackage} and Document Type ${docType}`);
    }

    // 2. Optimized "Flat" Data Transformation for the PDF Engine
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

    // 3. Return Clean JSON (No 'data.attributes' nesting)
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
