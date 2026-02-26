export default {
  routes: [
    {
      method: 'GET',
      path: '/bootstrap',
      handler: 'api::global-config.global-config.bootstrap',
      config: {
        auth: false, // Usually public for site init
      },
    },
  ],
};
