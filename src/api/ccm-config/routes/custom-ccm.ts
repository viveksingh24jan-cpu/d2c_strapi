
export default {
  routes: [
    {
      method: 'GET',
      path: '/ccm/resolve',
      handler: 'api::ccm-config.ccm-config.resolve',
      config: {
        auth: false, // Set to true in production
      },
    },
  ],
};
