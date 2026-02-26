import type { Schema, Struct } from '@strapi/strapi';

export interface DisclosuresDisclosureDocument extends Struct.ComponentSchema {
  collectionName: 'components_disclosures_disclosure_documents';
  info: {
    displayName: 'DisclosureDocument';
  };
  attributes: {
    description: Schema.Attribute.Text;
    file: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    formName: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SharedAlert extends Struct.ComponentSchema {
  collectionName: 'components_shared_alerts';
  info: {
    displayName: 'Alert';
    icon: 'exclamation-triangle';
  };
  attributes: {
    isDismissible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    message: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String;
    variant: Schema.Attribute.Enumeration<
      ['info', 'warning', 'error', 'success']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'info'>;
  };
}

export interface SharedAnnouncementBanner extends Struct.ComponentSchema {
  collectionName: 'components_shared_announcement_banners';
  info: {
    displayName: 'Announcement Banner';
    icon: 'bullhorn';
  };
  attributes: {
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String;
    variant: Schema.Attribute.Enumeration<
      ['info', 'warning', 'promo', 'alert']
    > &
      Schema.Attribute.DefaultTo<'info'>;
  };
}

export interface SharedAppLinks extends Struct.ComponentSchema {
  collectionName: 'components_shared_app_links';
  info: {
    displayName: 'AppLinks';
  };
  attributes: {
    appStoreBadge: Schema.Attribute.Media<'images'>;
    appStoreUrl: Schema.Attribute.String;
    playStoreBadge: Schema.Attribute.Media<'images'>;
    playStoreUrl: Schema.Attribute.String;
  };
}

export interface SharedAward extends Struct.ComponentSchema {
  collectionName: 'components_shared_awards';
  info: {
    displayName: 'Award';
    icon: 'trophy';
  };
  attributes: {
    issuer: Schema.Attribute.String;
    logo: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    year: Schema.Attribute.String;
  };
}

export interface SharedComparisonTable extends Struct.ComponentSchema {
  collectionName: 'components_shared_comparison_tables';
  info: {
    displayName: 'Comparison Table';
    icon: 'grid';
  };
  attributes: {
    columnHeaders: Schema.Attribute.JSON;
    rows: Schema.Attribute.JSON;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedComplianceBanner extends Struct.ComponentSchema {
  collectionName: 'components_shared_compliance_banners';
  info: {
    description: 'Standard IRDAI/Legal disclaimers pulling from Global Config';
    displayName: 'Compliance Banner';
    icon: 'balance-scale';
  };
  attributes: {
    customText: Schema.Attribute.Blocks;
    showLogo: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    type: Schema.Attribute.Enumeration<
      ['section41', 'general_disclaimer', 'investor_notice']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'section41'>;
  };
}

export interface SharedDynamicComparison extends Struct.ComponentSchema {
  collectionName: 'components_shared_dynamic_comparisons';
  info: {
    description: 'Compares products dynamically by referencing the Product Registry';
    displayName: 'Dynamic Comparison';
    icon: 'layer-group';
  };
  attributes: {
    description: Schema.Attribute.Text;
    highlightFeature: Schema.Attribute.String;
    products: Schema.Attribute.Relation<
      'oneToMany',
      'api::insurance-product.insurance-product'
    >;
    title: Schema.Attribute.String;
  };
}

export interface SharedFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_faq_items';
  info: {
    displayName: 'FAQ Item';
    icon: 'question-circle';
  };
  attributes: {
    answer: Schema.Attribute.Blocks;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedFeaturedTools extends Struct.ComponentSchema {
  collectionName: 'components_shared_featured_tools';
  info: {
    displayName: 'Featured Tools';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    tools: Schema.Attribute.Relation<'oneToMany', 'api::tool.tool'>;
  };
}

export interface SharedHero extends Struct.ComponentSchema {
  collectionName: 'components_shared_heroes';
  info: {
    description: 'Premium page header with CTA';
    displayName: 'Hero';
    icon: 'layout';
  };
  attributes: {
    badge: Schema.Attribute.String;
    ctaText: Schema.Attribute.String;
    ctaUrl: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedLottie extends Struct.ComponentSchema {
  collectionName: 'components_shared_lotties';
  info: {
    displayName: 'Lottie Animation';
    icon: 'play-circle';
  };
  attributes: {
    autoplay: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    fallbackImage: Schema.Attribute.Media<'images'>;
    loop: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    lottieUrl: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedModal extends Struct.ComponentSchema {
  collectionName: 'components_shared_modals';
  info: {
    displayName: 'Modal';
    icon: 'window-maximize';
  };
  attributes: {
    content: Schema.Attribute.Blocks;
    title: Schema.Attribute.String;
    triggerLabel: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedPageMetadata extends Struct.ComponentSchema {
  collectionName: 'components_shared_page_metadata';
  info: {
    description: 'Custom settings for specific page templates';
    displayName: 'Page Metadata';
    icon: 'cog';
  };
  attributes: {
    attachmentForDownload: Schema.Attribute.Media<'files'>;
    customScript: Schema.Attribute.Text;
    isMandatory: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    lastUpdated: Schema.Attribute.DateTime;
    redirectionPath: Schema.Attribute.String;
  };
}

export interface SharedProcessStep extends Struct.ComponentSchema {
  collectionName: 'components_shared_process_steps';
  info: {
    displayName: 'Process Step';
    icon: 'arrow-right';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images'>;
    stepNumber: Schema.Attribute.Integer & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedProductCta extends Struct.ComponentSchema {
  collectionName: 'components_shared_product_ctas';
  info: {
    description: 'Dynamic product card that pulls data from the Product Registry (Single Source of Truth)';
    displayName: 'Product CTA';
    icon: 'shopping-cart';
  };
  attributes: {
    customSubtitle: Schema.Attribute.Text;
    customTitle: Schema.Attribute.String;
    isFeatured: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    product: Schema.Attribute.Relation<
      'oneToOne',
      'api::insurance-product.insurance-product'
    >;
    variant: Schema.Attribute.Enumeration<['card', 'banner', 'minimal']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'card'>;
  };
}

export interface SharedPromoCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_promo_cards';
  info: {
    displayName: 'PromoCard';
  };
  attributes: {
    ctaText: Schema.Attribute.String & Schema.Attribute.Required;
    ctaUrl: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.String & Schema.Attribute.Required;
    promoImage: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: 'Primary text content area';
    displayName: 'Rich Text Block';
    icon: 'pencil';
  };
  attributes: {
    body: Schema.Attribute.RichText;
    styling: Schema.Attribute.Component<'shared.styling', false>;
  };
}

export interface SharedSectionReference extends Struct.ComponentSchema {
  collectionName: 'components_shared_section_references';
  info: {
    description: 'Links to a Shared Section for reusability.';
    displayName: 'Section Reference';
    icon: 'link';
  };
  attributes: {
    custom_title: Schema.Attribute.String;
    shared_section: Schema.Attribute.Relation<
      'oneToOne',
      'api::shared-section.shared-section'
    >;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    canonicalUrl: Schema.Attribute.String;
    keywords: Schema.Attribute.String;
    metaDescription: Schema.Attribute.Text;
    metaRobots: Schema.Attribute.String;
    metaTitle: Schema.Attribute.String;
    ogDescription: Schema.Attribute.String;
    ogTitle: Schema.Attribute.String;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: 'Carousel for multiple images';
    displayName: 'Media Slider';
    icon: 'images';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
    styling: Schema.Attribute.Component<'shared.styling', false>;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    displayName: 'SocialLink';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images'>;
    platform: Schema.Attribute.Enumeration<
      ['facebook', 'twitter', 'linkedin', 'instagram', 'youtube']
    >;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedStats extends Struct.ComponentSchema {
  collectionName: 'components_shared_stats';
  info: {
    displayName: 'Stats';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedStyling extends Struct.ComponentSchema {
  collectionName: 'components_shared_stylings';
  info: {
    description: 'Visual layout controls for marketing.';
    displayName: 'Styling';
    icon: 'paint-brush';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    backgroundColor: Schema.Attribute.Enumeration<
      ['white', 'light-gray', 'dark-gray', 'brand-primary', 'brand-secondary']
    > &
      Schema.Attribute.DefaultTo<'white'>;
    containerType: Schema.Attribute.Enumeration<
      ['fixed-normal', 'fixed-narrow', 'fixed-wide', 'full-width']
    > &
      Schema.Attribute.DefaultTo<'fixed-normal'>;
    customClassName: Schema.Attribute.String;
    paddingBottom: Schema.Attribute.Enumeration<
      ['none', 'small', 'medium', 'large', 'xlarge']
    > &
      Schema.Attribute.DefaultTo<'medium'>;
    paddingTop: Schema.Attribute.Enumeration<
      ['none', 'small', 'medium', 'large', 'xlarge']
    > &
      Schema.Attribute.DefaultTo<'medium'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'disclosures.disclosure-document': DisclosuresDisclosureDocument;
      'shared.alert': SharedAlert;
      'shared.announcement-banner': SharedAnnouncementBanner;
      'shared.app-links': SharedAppLinks;
      'shared.award': SharedAward;
      'shared.comparison-table': SharedComparisonTable;
      'shared.compliance-banner': SharedComplianceBanner;
      'shared.dynamic-comparison': SharedDynamicComparison;
      'shared.faq-item': SharedFaqItem;
      'shared.featured-tools': SharedFeaturedTools;
      'shared.hero': SharedHero;
      'shared.lottie': SharedLottie;
      'shared.media': SharedMedia;
      'shared.modal': SharedModal;
      'shared.page-metadata': SharedPageMetadata;
      'shared.process-step': SharedProcessStep;
      'shared.product-cta': SharedProductCta;
      'shared.promo-card': SharedPromoCard;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.section-reference': SharedSectionReference;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
      'shared.social-link': SharedSocialLink;
      'shared.stats': SharedStats;
      'shared.styling': SharedStyling;
    }
  }
}
