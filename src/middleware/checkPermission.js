const { rolePermissions } = require('../config/roles');
const { AuthorizationError } = require('../common/errors/AppError');

const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    const userPermissions = rolePermissions[userRole];

    if (!userPermissions.includes(requiredPermission)) {
      throw new AuthorizationError('Insufficient permissions');
    }

    next();
  };
};

module.exports = checkPermission;