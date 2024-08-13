'use strict';

module.exports = ({ strapi }) => ({
  SSO_TYPE_KEYCLOAK: '1',
  ssoRoles() {
    return [
      {
        oauthType: this.SSO_TYPE_KEYCLOAK,
        name: 'Keycloak',
      },
    ];
  },
  async keycloakRoles() {
    return await strapi.query('plugin::strapi-plugin-sso.roles').findOne({
      oauthType: this.SSO_TYPE_KEYCLOAK,
    });
  },
  async find() {
    return await strapi.query('plugin::strapi-plugin-sso.roles').findMany();
  },
  async update(roles) {
    const query = strapi.query('plugin::strapi-plugin-sso.roles');
    await Promise.all(
      roles.map((role) => {
        return query.findOne({ oauthType: role['oauthType'] }).then((ssoRole) => {
          if (ssoRole) {
            query.update({
              where: { oauthType: role['oauthType'] },
              data: { roles: role.role },
            });
          } else {
            query.create({
              data: {
                oauthType: role['oauthType'],
                roles: role.role,
              },
            });
          }
        });
      }),
    );
  },
});
