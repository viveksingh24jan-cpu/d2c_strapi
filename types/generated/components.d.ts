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

export interface SharedAppLinks extends Struct.ComponentSchema {
  collectionName: 'components_shared_app_links';
  info: {
    displayName: 'app_links';
  };
  attributes: {
    appStoreBadge: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    appStoreUrl: Schema.Attribute.String;
    playStoreBadge: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    playStoreUrl: Schema.Attribute.String;
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

export interface SharedPromoCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_promo_cards';
  info: {
    displayName: 'promo_card';
  };
  attributes: {
    ctaText: Schema.Attribute.String & Schema.Attribute.Required;
    ctaUrl: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.String & Schema.Attribute.Required;
    promoImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    > &
      Schema.Attribute.Required;
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
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
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
    shareImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    displayName: 'social_link';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
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
    Values: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'disclosures.disclosure-document': DisclosuresDisclosureDocument;
      'shared.app-links': SharedAppLinks;
      'shared.media': SharedMedia;
      'shared.promo-card': SharedPromoCard;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
      'shared.social-link': SharedSocialLink;
      'shared.stats': SharedStats;
    }
  }
}
