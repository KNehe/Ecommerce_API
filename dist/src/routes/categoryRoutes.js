"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("../controllers/authController"));
const categoryController_1 = __importDefault(require("../controllers/categoryController"));
const roles_1 = require("../utils/roles");
const router = express_1.default.Router();
router
    .route('/')
    .post(authController_1.default.protectRoute, authController_1.default.restrictRoute([roles_1.ROLE_ADMIN]), categoryController_1.default.addCategory)
    .get(categoryController_1.default.getAllCategories);
router
    .route('/:id')
    .delete(authController_1.default.protectRoute, authController_1.default.restrictRoute([roles_1.ROLE_ADMIN]), categoryController_1.default.deleteCategory)
    .patch(authController_1.default.protectRoute, authController_1.default.restrictRoute([roles_1.ROLE_ADMIN]), categoryController_1.default.updateCategory);
exports.default = router;
