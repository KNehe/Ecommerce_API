"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("../controllers/authController"));
const roles_1 = require("../utils/roles");
const productController_1 = __importDefault(require("./../controllers/productController"));
const router = express_1.default.Router();
router
    .route('/')
    .post(authController_1.default.protectRoute, authController_1.default.restrictRoute([roles_1.ROLE_ADMIN]), productController_1.default.addProduct)
    .get(productController_1.default.getAllProducts);
router.post("/addProductImage", authController_1.default.protectRoute, authController_1.default.restrictRoute([roles_1.ROLE_ADMIN]), productController_1.default.addProductImage);
router
    .route('/:id')
    .get(productController_1.default.getAllProductById)
    .delete(authController_1.default.protectRoute, authController_1.default.restrictRoute([roles_1.ROLE_ADMIN]), productController_1.default.deleteProduct)
    .patch(authController_1.default.protectRoute, authController_1.default.restrictRoute([roles_1.ROLE_ADMIN]), productController_1.default.updateProductById);
router.get('/search/:value', productController_1.default.searchByNameOrCategory);
router.get('/search/category/:category', productController_1.default.searchByCategory);
exports.default = router;
