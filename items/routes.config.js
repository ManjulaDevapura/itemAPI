const ItemsController = require('./controllers/items.controller');
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const config = require('../common/config/env.config');

const ADMIN = config.permissionLevels.ADMIN;

exports.routesConfig = function (app) {
    app.post('/items', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        ItemsController.insert
    ]);
    app.get('/items', [
        ItemsController.list
    ]);
    app.get('/items/:itemId', [
        ItemsController.getById
    ]);
    app.patch('/items/:itemId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        ItemsController.patchById
    ]);
    app.delete('/items/:itemId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
        ItemsController.removeById
    ]);
};
