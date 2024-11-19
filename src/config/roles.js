const roles = {
  ADMIN: 'admin',
  USER: 'user',
  PRO: 'pro'
};

const permissions = {
  CREATE_WORKOUT: 'create:workout',
  READ_WORKOUT: 'read:workout',
  UPDATE_WORKOUT: 'update:workout',
  DELETE_WORKOUT: 'delete:workout',
  MANAGE_USERS: 'manage:users',
  ACCESS_PREMIUM: 'access:premium',
  EXPORT_DATA: 'export:data'
};

const rolePermissions = {
  [roles.ADMIN]: Object.values(permissions),
  [roles.PRO]: [
    permissions.CREATE_WORKOUT,
    permissions.READ_WORKOUT,
    permissions.UPDATE_WORKOUT,
    permissions.DELETE_WORKOUT,
    permissions.ACCESS_PREMIUM,
    permissions.EXPORT_DATA
  ],
  [roles.USER]: [
    permissions.CREATE_WORKOUT,
    permissions.READ_WORKOUT,
    permissions.UPDATE_WORKOUT
  ]
};

module.exports = { roles, permissions, rolePermissions };