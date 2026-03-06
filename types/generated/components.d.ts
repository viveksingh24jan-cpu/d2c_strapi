import type { Schema, Struct } from '@strapi/strapi';

export interface CcmPdfSection extends Struct.ComponentSchema {
  collectionName: 'components_ccm_pdf_sections';
  info: {
    description: 'A reusable section for Policy PDF documents';
    displayName: 'PDF Section';
    icon: 'layer-group';
  };
  attributes: {
    content: Schema.Attribute.Blocks;
    isDynamicCoverages: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    sectionTitle: Schema.Attribute.String & Schema.Attribute.Required;
    showSignature: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    xmlTag: Schema.Attribute.String;
  };
}

export interface DisclosuresDisclosureDocument extends Struct.ComponentSchema {
  collectionName: 'components_disclosures_disclosure_documents';
  info: {
    description: 'IRDAI compliant document attachment with dynamic routing';
    displayName: 'Disclosure Document';
    icon: 'file';
  };
  attributes: {
    actionType: Schema.Attribute.Enumeration<
      ['pdf_viewer', 'docx_viewer', 'internal_page', 'external_link']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'pdf_viewer'>;
    description: Schema.Attribute.Text;
    externalUrl: Schema.Attribute.String;
    fileAsset: Schema.Attribute.Media<'files'>;
    internalLink: Schema.Attribute.Relation<'oneToOne', 'api::page.page'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
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
    items: Schema.Attribute.Component<'page-builder.accordion-item', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageBuilderAccordionItem extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_accordion_items';
  info: {
    description: 'Flexible container for Q&A, Grievance levels, or generic collapsible content';
    displayName: 'Accordion Item';
    icon: 'plus';
  };
  attributes: {
    badge: Schema.Attribute.String;
    content: Schema.Attribute.Blocks & Schema.Attribute.Required;
    cta: Schema.Attribute.Component<'shared.link', false>;
    icon: Schema.Attribute.String;
    isOpenByDefault: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    subtitle: Schema.Attribute.String;
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
    appLinks: Schema.Attribute.Component<'shared.app-links', false>;
    backgroundColor: Schema.Attribute.String;
    bannerType: Schema.Attribute.Enumeration<
      ['announcement', 'promo', 'alert', 'info', 'app-promotion']
    > &
      Schema.Attribute.DefaultTo<'info'>;
    content: Schema.Attribute.Blocks;
    ctaButton: Schema.Attribute.Component<'shared.link', false>;
    dismissible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    icon: Schema.Attribute.String;
    qrCode: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

export interface PageBuilderBranchLocator extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_branch_locators';
  info: {
    description: 'Automatically displays branches from the directory';
    displayName: 'Branch Locator (Automated)';
    icon: 'pin-map';
  };
  attributes: {
    filterType: Schema.Attribute.Enumeration<
      [
        'all',
        'head-office',
        'regional-office',
        'branch-office',
        'ombudsman-office',
      ]
    > &
      Schema.Attribute.DefaultTo<'all'>;
    introText: Schema.Attribute.Text;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Our Branches'>;
    viewLayout: Schema.Attribute.Enumeration<['list', 'grid', 'map']> &
      Schema.Attribute.DefaultTo<'list'>;
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
    customClassName: Schema.Attribute.String;
    layout: Schema.Attribute.Enumeration<
      ['grid-2', 'grid-3', 'grid-4', 'masonry', 'bento-grid']
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
    colSpan: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<1>;
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
    rowSpan: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<1>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<
      ['standard', 'glassmorphism', 'outline', 'primary']
    > &
      Schema.Attribute.DefaultTo<'standard'>;
  };
}

export interface PageBuilderCharts extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_charts';
  info: {
    description: 'Displays data using Bar, Pie, or Line charts';
    displayName: 'Data Visualization / Chart';
    icon: 'chartPie';
  };
  attributes: {
    chartType: Schema.Attribute.Enumeration<
      ['bar', 'pie', 'doughnut', 'line', 'radar']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'bar'>;
    config: Schema.Attribute.JSON;
    data: Schema.Attribute.JSON & Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    showLegend: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageBuilderComparisonTable extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_comparison_tables';
  info: {
    description: 'Enterprise-grade feature/product comparison grid';
    displayName: 'Comparison Table';
    icon: 'grid';
  };
  attributes: {
    badge: Schema.Attribute.String;
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

export interface PageBuilderCtaSection extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_cta_sections';
  info: {
    description: 'A high-conversion section with headline, description, and primary/secondary CTAs';
    displayName: 'CTA Section (Strip)';
    icon: 'megaphone';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images'>;
    ctaPrimary: Schema.Attribute.Component<'shared.link', false>;
    ctaSecondary: Schema.Attribute.Component<'shared.link', false>;
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<
      ['standard', 'centered', 'full-width-strip', 'dark', 'light']
    > &
      Schema.Attribute.DefaultTo<'standard'>;
  };
}

export interface PageBuilderDocumentCta extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_document_ctas';
  info: {
    description: 'Manually select specific documents/integrations from the registry to display on this page';
    displayName: 'Document Link / CTA';
    icon: 'download';
  };
  attributes: {
    description: Schema.Attribute.Text;
    displayIcon: Schema.Attribute.Enumeration<
      ['pdf', 'external-link', 'form', 'none']
    > &
      Schema.Attribute.DefaultTo<'pdf'>;
    documents: Schema.Attribute.Relation<
      'oneToMany',
      'api::download-document.download-document'
    >;
    title: Schema.Attribute.String;
    variant: Schema.Attribute.Enumeration<['button', 'card', 'simple-link']> &
      Schema.Attribute.DefaultTo<'button'>;
  };
}

export interface PageBuilderDocumentListing extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_document_listings';
  info: {
    description: 'Automatically pulls documents from the registry by category (Regulatory, Financial, etc.)';
    displayName: 'Document Listing (Automated)';
    icon: 'file';
  };
  attributes: {
    category: Schema.Attribute.Enumeration<
      ['Regulatory', 'Financial', 'Governance', 'Metrics']
    > &
      Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    viewType: Schema.Attribute.Enumeration<['list', 'grid', 'accordion']> &
      Schema.Attribute.DefaultTo<'list'>;
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
    description: 'CTA for a specific vehicle product (4W, 2W, CV)';
    displayName: 'Insurance Product CTA';
    icon: 'car';
  };
  attributes: {
    cta: Schema.Attribute.Component<'shared.cta', false>;
    description: Schema.Attribute.Text;
    product: Schema.Attribute.Relation<
      'oneToOne',
      'api::insurance-product.insurance-product'
    >;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageBuilderLeadershipGrid extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_leadership_grids';
  info: {
    description: 'Automatically displays leadership profiles by category';
    displayName: 'Leadership Grid (Automated)';
    icon: 'user';
  };
  attributes: {
    category: Schema.Attribute.Enumeration<['Board', 'KMP', 'All']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Board'>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Our Leadership'>;
  };
}

export interface PageBuilderMediaBlock extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_media_blocks';
  info: {
    description: 'Unified component for Image, Local Video, External Embeds, and Lottie';
    displayName: 'Media Block';
    icon: 'picture';
  };
  attributes: {
    altText: Schema.Attribute.String;
    aspectRatio: Schema.Attribute.Enumeration<
      ['original', '1:1', '4:3', '16:9', '21:9']
    > &
      Schema.Attribute.DefaultTo<'original'>;
    autoplay: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    caption: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    externalUrl: Schema.Attribute.String;
    file: Schema.Attribute.Media<'images' | 'videos' | 'files'>;
    showControls: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    thumbnail: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<
      [
        'image',
        'illustration',
        'infographic',
        'lottie',
        'video-local',
        'video-external',
      ]
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'image'>;
  };
}

export interface PageBuilderModals extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_modals';
  info: {
    description: 'Configurable popup modal content';
    displayName: 'Modal Overlay';
    icon: 'expand';
  };
  attributes: {
    content: Schema.Attribute.Blocks;
    delaySeconds: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    modalId: Schema.Attribute.String & Schema.Attribute.Required;
    size: Schema.Attribute.Enumeration<
      ['small', 'medium', 'large', 'full-screen']
    > &
      Schema.Attribute.DefaultTo<'medium'>;
    title: Schema.Attribute.String;
    triggerOnLoad: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface PageBuilderProductGrid extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_product_grids';
  info: {
    description: 'Display a grid of insurance products pulled directly from the registry';
    displayName: 'Product Selection Grid';
    icon: 'grid';
  };
  attributes: {
    mode: Schema.Attribute.Enumeration<['automated', 'manual']> &
      Schema.Attribute.DefaultTo<'automated'>;
    products: Schema.Attribute.Relation<
      'oneToMany',
      'api::insurance-product.insurance-product'
    >;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
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

export interface PageBuilderTabItem extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_tab_items';
  info: {
    description: '';
    displayName: 'Tab Item';
    icon: 'window';
  };
  attributes: {
    content: Schema.Attribute.DynamicZone<
      [
        'page-builder.text-block',
        'page-builder.card-grid',
        'page-builder.accordion',
        'page-builder.comparison-table',
        'page-builder.media-block',
        'page-builder.product-grid',
        'page-builder.document-listing',
        'page-builder.branch-locator',
        'shared.link',
        'shared.cta',
      ]
    >;
    icon: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PageBuilderTabs extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_tabs';
  info: {
    description: 'Horizontal tabs for organized content delivery';
    displayName: 'Tabs Content';
    icon: 'layers';
  };
  attributes: {
    activeTab: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    tabs: Schema.Attribute.Component<'page-builder.tab-item', true>;
    title: Schema.Attribute.String;
  };
}

export interface PageBuilderTestimonialShowcase extends Struct.ComponentSchema {
  collectionName: 'components_page_builder_testimonial_showcases';
  info: {
    description: 'Dynamic or manual selection of customer testimonials';
    displayName: 'Testimonial Showcase';
    icon: 'quote';
  };
  attributes: {
    category: Schema.Attribute.Enumeration<
      ['all', 'motor', 'health', 'travel', 'claims']
    > &
      Schema.Attribute.DefaultTo<'all'>;
    layout: Schema.Attribute.Enumeration<['grid', 'slider', 'single']> &
      Schema.Attribute.DefaultTo<'grid'>;
    manualTestimonials: Schema.Attribute.Relation<
      'oneToMany',
      'api::testimonial.testimonial'
    >;
    mode: Schema.Attribute.Enumeration<
      ['automated-by-category', 'manual-selection']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'automated-by-category'>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String;
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

export interface ProductAddon extends Struct.ComponentSchema {
  collectionName: 'components_product_addons';
  info: {
    description: 'Optional coverage items to be purchased separately';
    displayName: 'Add-on';
    icon: 'plus';
  };
  attributes: {
    addonCostLabel: Schema.Attribute.String;
    badge: Schema.Attribute.String;
    deductibleWording: Schema.Attribute.String;
    detailedDescription: Schema.Attribute.Blocks;
    detailedHeading: Schema.Attribute.String;
    features: Schema.Attribute.Component<'product.feature', true>;
    icon: Schema.Attribute.Media<'images'>;
    infoTooltip: Schema.Attribute.Text;
    limitValue: Schema.Attribute.String;
    lookupKeyword: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    unitLabel: Schema.Attribute.String;
  };
}

export interface ProductComparisonAttribute extends Struct.ComponentSchema {
  collectionName: 'components_product_comparison_attributes';
  info: {
    description: 'Rows for comparison table (e.g. CSR, Cashless Network)';
    displayName: 'Comparison Attribute';
    icon: 'layer';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images'>;
    isHighlighted: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    numericValue: Schema.Attribute.Decimal;
    tooltip: Schema.Attribute.Text;
    value: Schema.Attribute.String & Schema.Attribute.Required;
    valueType: Schema.Attribute.Enumeration<
      ['text', 'percentage', 'boolean', 'rating', 'currency']
    > &
      Schema.Attribute.DefaultTo<'text'>;
  };
}

export interface ProductComparisonSettings extends Struct.ComponentSchema {
  collectionName: 'components_product_comparison_settings';
  info: {
    description: 'How this coverage appears in a side-by-side grid';
    displayName: 'Comparison Grid Settings';
    icon: 'table';
  };
  attributes: {
    displayValue: Schema.Attribute.String;
    gridGroup: Schema.Attribute.String;
    gridIcon: Schema.Attribute.Media<'images'>;
    gridLabel: Schema.Attribute.String;
    showInGrid: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
  };
}

export interface ProductCoverage extends Struct.ComponentSchema {
  collectionName: 'components_product_coverages';
  info: {
    description: 'Main coverage configuration (Basic, Add-on, Discount)';
    displayName: 'Coverage';
    icon: 'shield';
  };
  attributes: {
    advantages: Schema.Attribute.Component<'product.feature', true>;
    badge: Schema.Attribute.String;
    detailedContent: Schema.Attribute.Blocks;
    icon: Schema.Attribute.Media<'images'>;
    image: Schema.Attribute.Media<'images'>;
    infoTooltip: Schema.Attribute.Text;
    lookupKeyword: Schema.Attribute.String;
    shortDescription: Schema.Attribute.Text;
    sortOrder: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<['basic', 'addon', 'discount']> &
      Schema.Attribute.DefaultTo<'basic'>;
  };
}

export interface ProductExclusion extends Struct.ComponentSchema {
  collectionName: 'components_product_exclusions';
  info: {
    description: 'Standard exclusions for the plan';
    displayName: 'Exclusion';
    icon: 'cancel';
  };
  attributes: {
    category: Schema.Attribute.Enumeration<
      ['general', 'medical', 'lifestyle', 'occupational', 'standard']
    > &
      Schema.Attribute.DefaultTo<'general'>;
    description: Schema.Attribute.Text;
    detailedContent: Schema.Attribute.Blocks;
    icon: Schema.Attribute.Media<'images'>;
    isPermanent: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductFeature extends Struct.ComponentSchema {
  collectionName: 'components_product_features';
  info: {
    description: 'Individual feature or advantage with icon and tooltip';
    displayName: 'Feature';
    icon: 'bulletList';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images'>;
    infoTooltip: Schema.Attribute.Text;
    isHighlighted: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductInclusion extends Struct.ComponentSchema {
  collectionName: 'components_product_inclusions';
  info: {
    description: 'Standard coverage items included in the plan';
    displayName: 'Inclusion';
    icon: 'check';
  };
  attributes: {
    detailedDescription: Schema.Attribute.Blocks;
    detailedHeading: Schema.Attribute.String;
    features: Schema.Attribute.Component<'product.feature', true>;
    icon: Schema.Attribute.Media<'images'>;
    infoTooltip: Schema.Attribute.Text;
    lookupKeyword: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductKeyBenefit extends Struct.ComponentSchema {
  collectionName: 'components_product_key_benefits';
  info: {
    description: 'Highlighted benefit for product/plan cards';
    displayName: 'Key Benefit';
    icon: 'star';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images'>;
    isPrimary: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductPlanCoverage extends Struct.ComponentSchema {
  collectionName: 'components_product_plan_coverages';
  info: {
    description: 'Links a Keyword from Registry with optional overrides';
    displayName: 'Plan Coverage Link';
    icon: 'link';
  };
  attributes: {
    coverage: Schema.Attribute.Relation<'oneToOne', 'api::coverage.coverage'>;
    descriptionOverride: Schema.Attribute.Blocks;
    iconOverride: Schema.Attribute.Media<'images'>;
    isIncluded: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    limitOverride: Schema.Attribute.String;
    sortOrder: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    titleOverride: Schema.Attribute.String;
  };
}

export interface ProductWaitingPeriod extends Struct.ComponentSchema {
  collectionName: 'components_product_waiting_periods';
  info: {
    description: 'Specific waiting periods for conditions';
    displayName: 'Waiting Period';
    icon: 'clock';
  };
  attributes: {
    conditionName: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    detailedContent: Schema.Attribute.Blocks;
    duration: Schema.Attribute.String;
    icon: Schema.Attribute.Media<'images'>;
    waivedByAddon: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface SharedActionLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_action_links';
  info: {
    description: 'Unified link pattern for files, pages, or URLs';
    displayName: 'Action Link';
    icon: 'link';
  };
  attributes: {
    file: Schema.Attribute.Media<'files'>;
    page: Schema.Attribute.Relation<'oneToOne', 'api::page.page'>;
    type: Schema.Attribute.Enumeration<
      ['file', 'internal_page', 'external_url']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'file'>;
    url: Schema.Attribute.String;
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

export interface SharedAward extends Struct.ComponentSchema {
  collectionName: 'components_shared_awards';
  info: {
    description: 'Industry recognitions and award badges';
    displayName: 'Award';
    icon: 'award';
  };
  attributes: {
    awardDate: Schema.Attribute.Date;
    awardImage: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    awardLink: Schema.Attribute.String;
    awardName: Schema.Attribute.String & Schema.Attribute.Required;
    issuingOrganization: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedCta extends Struct.ComponentSchema {
  collectionName: 'components_shared_ctas';
  info: {
    description: 'Configurable buttons and links';
    displayName: 'Dynamic CTA';
    icon: 'cursor';
  };
  attributes: {
    actionUrl: Schema.Attribute.String & Schema.Attribute.Required;
    iconName: Schema.Attribute.String;
    isVisible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'ghost', 'link']
    > &
      Schema.Attribute.DefaultTo<'primary'>;
  };
}

export interface SharedFaq extends Struct.ComponentSchema {
  collectionName: 'components_shared_faqs';
  info: {
    description: 'Simple Question and Answer pair';
    displayName: 'FAQ';
    icon: 'question';
  };
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedFooterColumn extends Struct.ComponentSchema {
  collectionName: 'components_shared_footer_columns';
  info: {
    description: 'Standardized footer column with title and links';
    displayName: 'Footer Column';
    icon: 'bulletList';
  };
  attributes: {
    links: Schema.Attribute.Component<'shared.link', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
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

export interface SharedRegulatoryDisclosure extends Struct.ComponentSchema {
  collectionName: 'components_shared_regulatory_disclosures';
  info: {
    description: 'IRDAI/Legal mandatory disclaimers';
    displayName: 'Regulatory Disclosure';
    icon: 'handshaking';
  };
  attributes: {
    displayMode: Schema.Attribute.Enumeration<
      ['footer', 'plan-card', 'checkout']
    > &
      Schema.Attribute.DefaultTo<'footer'>;
    gstNote: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Premium is exclusive of GST'>;
    irdaRegistration: Schema.Attribute.String;
    mandatoryDisclaimer: Schema.Attribute.Blocks;
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
  collectionName: 'components_shared_seos';
  info: {
    description: 'Enterprise-grade SEO with Robots, Structured Data, and Global Fallback';
    displayName: 'Advanced SEO';
    icon: 'search';
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaImage: Schema.Attribute.Media<'images'>;
    metaKeywords: Schema.Attribute.Text;
    metaRobots: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'index, follow'>;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    structuredData: Schema.Attribute.JSON;
    useGlobalFallback: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
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

export interface SharedUiConfig extends Struct.ComponentSchema {
  collectionName: 'components_shared_ui_configs';
  info: {
    description: 'Visibility and Layout control';
    displayName: 'UI UX Config';
    icon: 'cog';
  };
  attributes: {
    isVisibleInFooter: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    isVisibleInMenu: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    isVisibleOnHomepage: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    showBreadcrumbs: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    showInComparisonGrid: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
    sortOrder: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    themeColor: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'ccm.pdf-section': CcmPdfSection;
      'disclosures.disclosure-document': DisclosuresDisclosureDocument;
      'page-builder.accordion': PageBuilderAccordion;
      'page-builder.accordion-item': PageBuilderAccordionItem;
      'page-builder.banner': PageBuilderBanner;
      'page-builder.branch-locator': PageBuilderBranchLocator;
      'page-builder.card-grid': PageBuilderCardGrid;
      'page-builder.card-item': PageBuilderCardItem;
      'page-builder.charts': PageBuilderCharts;
      'page-builder.comparison-table': PageBuilderComparisonTable;
      'page-builder.cta-section': PageBuilderCtaSection;
      'page-builder.document-cta': PageBuilderDocumentCta;
      'page-builder.document-listing': PageBuilderDocumentListing;
      'page-builder.featured-content': PageBuilderFeaturedContent;
      'page-builder.hero-section': PageBuilderHeroSection;
      'page-builder.insurance-product-cta': PageBuilderInsuranceProductCta;
      'page-builder.leadership-grid': PageBuilderLeadershipGrid;
      'page-builder.media-block': PageBuilderMediaBlock;
      'page-builder.modals': PageBuilderModals;
      'page-builder.product-grid': PageBuilderProductGrid;
      'page-builder.progress-steps': PageBuilderProgressSteps;
      'page-builder.stats-bar': PageBuilderStatsBar;
      'page-builder.step-item': PageBuilderStepItem;
      'page-builder.sticky-cta-bar': PageBuilderStickyCtaBar;
      'page-builder.tab-item': PageBuilderTabItem;
      'page-builder.tabs': PageBuilderTabs;
      'page-builder.testimonial-showcase': PageBuilderTestimonialShowcase;
      'page-builder.text-block': PageBuilderTextBlock;
      'product.addon': ProductAddon;
      'product.comparison-attribute': ProductComparisonAttribute;
      'product.comparison-settings': ProductComparisonSettings;
      'product.coverage': ProductCoverage;
      'product.exclusion': ProductExclusion;
      'product.feature': ProductFeature;
      'product.inclusion': ProductInclusion;
      'product.key-benefit': ProductKeyBenefit;
      'product.plan-coverage': ProductPlanCoverage;
      'product.waiting-period': ProductWaitingPeriod;
      'shared.action-link': SharedActionLink;
      'shared.app-links': SharedAppLinks;
      'shared.award': SharedAward;
      'shared.cta': SharedCta;
      'shared.faq': SharedFaq;
      'shared.footer-column': SharedFooterColumn;
      'shared.link': SharedLink;
      'shared.regulatory-disclosure': SharedRegulatoryDisclosure;
      'shared.scripts': SharedScripts;
      'shared.section-reference': SharedSectionReference;
      'shared.seo': SharedSeo;
      'shared.social-link': SharedSocialLink;
      'shared.stats-item': SharedStatsItem;
      'shared.styling': SharedStyling;
      'shared.ui-config': SharedUiConfig;
    }
  }
}
