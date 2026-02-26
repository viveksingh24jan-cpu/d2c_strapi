async function fixPermissions() {
  try {
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: { type: 'public' }
    });

    if (!publicRole) return;

    const permissions = [
      { action: 'api::page.page.find', api: 'api::page.page' },
      { action: 'api::page.page.findOne', api: 'api::page.page' },
      { action: 'api::global-config.global-config.bootstrap', api: 'api::global-config.global-config' },
      { action: 'api::global-config.global-config.find', api: 'api::global-config.global-config' }
    ];

    for (const p of permissions) {
      await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: p.action,
          role: publicRole.id
        }
      });
    }
    console.log('✅ Permissions fixed for Public role.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to fix permissions:', err);
    process.exit(1);
  }
}
fixPermissions();
