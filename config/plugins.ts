export default ({ env }) => ({
  'plugin-all-in-one-accessibility': {
    enabled: true,
  },
  
  // Best in Class Practice: Separate asset storage from CMS server
  // Configure 'upload' provider (e.g., S3, Cloudinary, Strapi Cloud)
  'upload': {
    config: {
      provider: env('UPLOAD_PROVIDER', 'local'),
      providerOptions: env('UPLOAD_PROVIDER_OPTIONS', {}),
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },

  // Future Scalability: Caching layer
  // 'rest-cache': {
  //   config: {
  //     provider: {
  //       name: 'memory',
  //       options: {
  //         max: 32768,
  //         updateType: 'immutable',
  //       },
  //     },
  //     strategy: {
  //       contentTypes: ['api::page.page', 'api::article.article'],
  //     },
  //   },
  // },

  // Modern Search: MeiliSearch integration
  // 'meilisearch': {
  //   config: {
  //     host: env('MEILI_HOST', 'http://localhost:7700'),
  //     apiKey: env('MEILI_MASTER_KEY', 'masterKey'),
  //   },
  // },
});
