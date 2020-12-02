"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("../controllers/authController"));
const cartOrderController_1 = __importDefault(require("../controllers/cartOrderController"));
const router = express_1.default.Router();
router.post('/', authController_1.default.protectRoute, cartOrderController_1.default.addToCart);
router.post('/flutter/stripepayment', cartOrderController_1.default.flutterStripeOrderhandler);
router.post('/braintree/paypalpayment/:nonce', cartOrderController_1.default.flutterPaypalRequesthandler);
router
    .route('/:userid')
    .get(authController_1.default.protectRoute, cartOrderController_1.default.getCart)
    .delete(cartOrderController_1.default.deleteCart);
router.get('/orders/user/:userid', authController_1.default.protectRoute, cartOrderController_1.default.getOrders);
exports.default = router;
