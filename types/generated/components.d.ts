import type { Schema, Struct } from '@strapi/strapi';

export interface DisclosuresDisclosureDocument extends Struct.ComponentSchema {
  collectionName: 'components_disclosures_disclosure_document';
  info: {
    description: 'IRDAI compliance document attachment';
    displayName: 'Disclosure Document';
    icon: 'file';
  };
  attributes: {
    description: Schema.Attribute.Text;
    file: Schema.Attribute.Media<'files'>;
    form_name: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface PageBuilderAccordion extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_accordion';
  info: {
    description: 'Collapsible FAQ/Q&A section';
    displayName: 'Accordion';
    icon: 'bulletList';
  };
  attributes: {
    items: Schema.Attribute.Component<'page-builder.qna-item', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageBuilderAppBanner extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_app_banner';
  info: {
    description: 'Mobile app download promotion section';
    displayName: 'App Banner';
    icon: 'phone';
  };
  attributes: {
    appIcon: Schema.Attribute.Media<'images'>;
    appLinks: Schema.Attribute.Component<'shared.app-links', false>;
    backgroundImage: Schema.Attribute.Media<'images'>;
    description: Schema.Attribute.Text;
    features: Schema.Attribute.Component<'page-builder.card-item', true>;
    qrCode: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageBuilderBanner extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_banner';
  info: {
    description: 'Announcement, promo, alert, or info banner strip';
    displayName: 'Banner';
    icon: 'bell';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String;
    bannerType: Schema.Attribute.Enumeration<
      ['announcement', 'promo', 'alert', 'info']
    > &
      Schema.Attribute.DefaultTo<'info'>;
    content: Schema.Attribute.Blocks;
    ctaButton: Schema.Attribute.Component<'shared.link', false>;
    dismissible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    icon: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface PageBuilderCardGrid extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_card_grid';
  info: {
    description: 'Configurable grid of card items';
    displayName: 'Card Grid';
    icon: 'apps';
  };
  attributes: {
    cards: Schema.Attribute.Component<'page-builder.card-item', true>;
    layout: Schema.Attribute.Enumeration<
      ['grid-2', 'grid-3', 'grid-4', 'masonry']
    > &
      Schema.Attribute.DefaultTo<'grid-3'>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface PageBuilderCardItem extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_card_item';
  info: {
    description: 'Individual card with title, description, image, and link';
    displayName: 'Card Item';
    icon: 'dashboard';
  };
  attributes: {
    badge: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    link: Schema.Attribute.Component<'shared.link', false>;
    rating: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      >;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageBuilderComparisonTable extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_comparison_table';
  info: {
    description: 'Product/feature comparison table';
    displayName: 'Comparison Table';
    icon: 'layer';
  };
  attributes: {
    columns: Schema.Attribute.JSON & Schema.Attribute.Required;
    highlightColumn: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    rows: Schema.Attribute.JSON & Schema.Attribute.Required;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageBuilderFeaturedContent extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_featured_content';
  info: {
    description: 'Dynamic display of featured articles or tools';
    displayName: 'Featured Content';
    icon: 'star';
  };
  attributes: {
    contentType: Schema.Attribute.Enumeration<['articles', 'tools']> &
      Schema.Attribute.DefaultTo<'articles'>;
    displayCount: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<3>;
    layout: Schema.Attribute.Enumeration<['carousel', 'grid']> &
      Schema.Attribute.DefaultTo<'grid'>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface PageBuilderGrievanceLevels extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_grievance_levels';
  info: {
    description: 'IRDAI grievance redressal escalation display';
    displayName: 'Grievance Levels';
    icon: 'shield';
  };
  attributes: {
    bimaBharosaLink: Schema.Attribute.String;
    introText: Schema.Attribute.Blocks;
    levels: Schema.Attribute.Relation<
      'oneToMany',
      'api::grievance-level.grievance-level'
    >;
    title: Schema.Attribute.String;
  };
}

export interface PageBuilderHeroSection extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_hero_section';
  info: {
    description: 'Hero banner with title, CTAs, and background';
    displayName: 'Hero Section';
    icon: 'landscape';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images'>;
    badge: Schema.Attribute.String;
    ctaPrimary: Schema.Attribute.Component<'shared.link', false>;
    ctaSecondary: Schema.Attribute.Component<'shared.link', false>;
    heroImage: Schema.Attribute.Media<'images'>;
    layout: Schema.Attribute.Enumeration<
      ['centered', 'left-right', 'full-width']
    > &
      Schema.Attribute.DefaultTo<'left-right'>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageBuilderInsuranceProductCta extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_insurance_product_ctas';
  info: {
    description: 'Dynamic product card that pulls data from the Product Registry (Single Source of Truth)';
    displayName: 'Insurance Product CTA';
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

export interface PageBuilderMediaBlock extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_media_block';
  info: {
    description: 'Image or video with caption and alt text';
    displayName: 'Media Block';
    icon: 'picture';
  };
  attributes: {
    altText: Schema.Attribute.String & Schema.Attribute.Required;
    caption: Schema.Attribute.String;
    media: Schema.Attribute.Media<'images' | 'videos'> &
      Schema.Attribute.Required;
  };
}

export interface PageBuilderProductShowcase extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_product_showcase';
  info: {
    description: 'Insurance product carousel/grid display';
    displayName: 'Product Showcase';
    icon: 'shoppingCart';
  };
  attributes: {
    layout: Schema.Attribute.Enumeration<['carousel', 'grid', 'list']> &
      Schema.Attribute.DefaultTo<'carousel'>;
    maxDisplay: Schema.Attribute.Integer;
    products: Schema.Attribute.Relation<
      'oneToMany',
      'api::insurance-product.insurance-product'
    >;
    showPrice: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface PageBuilderProgressSteps extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_progress_steps';
  info: {
    description: 'Step-by-step process visualization';
    displayName: 'Progress Steps';
    icon: 'arrowRight';
  };
  attributes: {
    layout: Schema.Attribute.Enumeration<['horizontal', 'vertical']> &
      Schema.Attribute.DefaultTo<'horizontal'>;
    steps: Schema.Attribute.Component<'page-builder.step-item', true>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageBuilderQnaItem extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_qna_item';
  info: {
    description: 'Single question and answer pair';
    displayName: 'Q&A Item';
    icon: 'question';
  };
  attributes: {
    answer: Schema.Attribute.Blocks & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageBuilderStatsBar extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_stats_bar';
  info: {
    description: 'Key metrics display section';
    displayName: 'Stats Bar';
    icon: 'chartBubble';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String;
    stats: Schema.Attribute.Component<'shared.stats-item', true>;
    title: Schema.Attribute.String;
  };
}

export interface PageBuilderStepItem extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_step_item';
  info: {
    description: 'Single step in a progress/process visualization';
    displayName: 'Step Item';
    icon: 'arrowRight';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    stepNumber: Schema.Attribute.Integer & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageBuilderStickyCtaBar extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_sticky_cta_bar';
  info: {
    description: 'Floating call-to-action bar';
    displayName: 'Sticky CTA Bar';
    icon: 'cursor';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String;
    ctaButton: Schema.Attribute.Component<'shared.link', false> &
      Schema.Attribute.Required;
    message: Schema.Attribute.String & Schema.Attribute.Required;
    position: Schema.Attribute.Enumeration<['bottom', 'top']> &
      Schema.Attribute.DefaultTo<'bottom'>;
    showCloseButton: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
  };
}

export interface PageBuilderTestimonialGrid extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_testimonial_grid';
  info: {
    description: 'Customer testimonials section';
    displayName: 'Testimonial Grid';
    icon: 'quote';
  };
  attributes: {
    subtitle: Schema.Attribute.Text;
    testimonials: Schema.Attribute.Component<
      'page-builder.testimonial-item',
      true
    >;
    title: Schema.Attribute.String;
  };
}

export interface PageBuilderTestimonialItem extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_testimonial_item';
  info: {
    description: 'Individual customer testimonial';
    displayName: 'Testimonial Item';
    icon: 'quote';
  };
  attributes: {
    authorAvatar: Schema.Attribute.Media<'images'>;
    authorName: Schema.Attribute.String & Schema.Attribute.Required;
    authorTitle: Schema.Attribute.String;
    productName: Schema.Attribute.String;
    quote: Schema.Attribute.Text & Schema.Attribute.Required;
    rating: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      >;
  };
}

export interface PageBuilderTextBlock extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_text_block';
  info: {
    description: 'Rich text content with layout options';
    displayName: 'Text Block';
    icon: 'pencil';
  };
  attributes: {
    content: Schema.Attribute.Blocks & Schema.Attribute.Required;
    layout: Schema.Attribute.Enumeration<['single-column', 'two-column']> &
      Schema.Attribute.DefaultTo<'single-column'>;
  };
}

export interface PageBuilderVideoBlock extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_video_block';
  info: {
    description: 'Embedded video (YouTube, Vimeo, direct, reel)';
    displayName: 'Video Block';
    icon: 'play';
  };
  attributes: {
    autoplay: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    description: Schema.Attribute.Text;
    showControls: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    thumbnail: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
    videoType: Schema.Attribute.Enumeration<
      ['youtube', 'vimeo', 'direct', 'reel']
    > &
      Schema.Attribute.DefaultTo<'youtube'>;
    videoUrl: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedAppLinks extends Struct.ComponentSchema {
  collectionName: 'components_shared_app_links';
  info: {
    description: 'Mobile app store links with badge images';
    displayName: 'App Links';
    icon: 'apps';
  };
  attributes: {
    app_store_badge: Schema.Attribute.Media<'images'>;
    app_store_url: Schema.Attribute.String;
    play_store_badge: Schema.Attribute.Media<'images'>;
    play_store_url: Schema.Attribute.String;
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

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_link';
  info: {
    description: 'Reusable link/CTA button';
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    target: Schema.Attribute.Enumeration<['_self', '_blank']> &
      Schema.Attribute.DefaultTo<'_self'>;
    url: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'outline', 'text']
    > &
      Schema.Attribute.DefaultTo<'primary'>;
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

export interface SharedScripts extends Struct.ComponentSchema {
  collectionName: 'components_shared_scripts';
  info: {
    description: 'Custom scripts for analytics and tracking';
    displayName: 'Third Party Scripts';
    icon: 'code';
  };
  attributes: {
    customScriptsBody: Schema.Attribute.Text;
    customScriptsHead: Schema.Attribute.Text;
    facebookPixelId: Schema.Attribute.String;
    googleTagManagerId: Schema.Attribute.String;
  };
}

export interface SharedSectionReference extends Struct.ComponentSchema {
  collectionName: 'components_shared_section_references';
  info: {
    description: 'Reuse a globally defined section from the Shared Sections collection';
    displayName: 'Shared Section Reference';
    icon: 'repeat';
  };
  attributes: {
    shared_section: Schema.Attribute.Relation<
      'oneToOne',
      'api::shared-section.shared-section'
    >;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seo';
  info: {
    description: 'SEO metadata for pages and content';
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    canonical_url: Schema.Attribute.String;
    keywords: Schema.Attribute.String;
    meta_description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    meta_image: Schema.Attribute.Media<'images'>;
    meta_robots: Schema.Attribute.String;
    meta_title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    og_description: Schema.Attribute.String;
    og_title: Schema.Attribute.String;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_link';
  info: {
    description: 'Social media platform link';
    displayName: 'Social Link';
    icon: 'globe';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images'>;
    platform: Schema.Attribute.Enumeration<
      ['facebook', 'twitter', 'linkedin', 'instagram', 'youtube', 'whatsapp']
    > &
      Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedStatsItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_stats_item';
  info: {
    description: 'Single statistic entry (label + value)';
    displayName: 'Stats Item';
    icon: 'chartBubble';
  };
  attributes: {
    icon: Schema.Attribute.String;
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
      'page-builder.accordion': PageBuilderAccordion;
      'page-builder.app-banner': PageBuilderAppBanner;
      'page-builder.banner': PageBuilderBanner;
      'page-builder.card-grid': PageBuilderCardGrid;
      'page-builder.card-item': PageBuilderCardItem;
      'page-builder.comparison-table': PageBuilderComparisonTable;
      'page-builder.featured-content': PageBuilderFeaturedContent;
      'page-builder.grievance-levels': PageBuilderGrievanceLevels;
      'page-builder.hero-section': PageBuilderHeroSection;
      'page-builder.insurance-product-cta': PageBuilderInsuranceProductCta;
      'page-builder.media-block': PageBuilderMediaBlock;
      'page-builder.product-showcase': PageBuilderProductShowcase;
      'page-builder.progress-steps': PageBuilderProgressSteps;
      'page-builder.qna-item': PageBuilderQnaItem;
      'page-builder.stats-bar': PageBuilderStatsBar;
      'page-builder.step-item': PageBuilderStepItem;
      'page-builder.sticky-cta-bar': PageBuilderStickyCtaBar;
      'page-builder.testimonial-grid': PageBuilderTestimonialGrid;
      'page-builder.testimonial-item': PageBuilderTestimonialItem;
      'page-builder.text-block': PageBuilderTextBlock;
      'page-builder.video-block': PageBuilderVideoBlock;
      'shared.app-links': SharedAppLinks;
      'shared.comparison-table': SharedComparisonTable;
      'shared.link': SharedLink;
      'shared.page-metadata': SharedPageMetadata;
      'shared.scripts': SharedScripts;
      'shared.section-reference': SharedSectionReference;
      'shared.seo': SharedSeo;
      'shared.social-link': SharedSocialLink;
      'shared.stats-item': SharedStatsItem;
      'shared.styling': SharedStyling;
    }
  }
}
