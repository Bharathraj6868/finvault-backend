const { AppError } = require('../utils/error');

const ROLE_PERMISSIONS = {
  viewer:   ['view_records', 'view_dashboard'],
  analyst:  ['view_records', 'view_dashboard', 'view_analytics'],
  admin:    ['view_records', 'view_dashboard', 'view_analytics', 'create_records', 'update_records', 'delete_records', 'manage_users']
};

function authorize(...requiredPermissions) {
  return (req, res, next) => {
    const userRole = req.user.role;
    const userPermissions = ROLE_PERMISSIONS[userRole] || [];

    const hasPermission = requiredPermissions.every(p => userPermissions.includes(p));
    if (!hasPermission) {
      return next(new AppError(403,
        `Access denied. Role '${userRole}' lacks permission: ${requiredPermissions.join(', ')}`
      ));
    }
    next();
  };
}

module.exports = { authorize, ROLE_PERMISSIONS };