"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authService_1 = __importDefault(require("../services/authService"));
const cartOrderService_1 = __importDefault(require("../services/cartOrderService"));
const productService_1 = __importDefault(require("../services/productService"));
const appError_1 = __importDefault(require("../utils/appError"));
const errorMessages_1 = require("../utils/errorMessages");
const statusCodes_1 = require("../utils/statusCodes");
const statusMessages_1 = require("../utils/statusMessages");
const successMessages_1 = require("../utils/successMessages");
const validators_1 = __importDefault(require("../utils/validators"));
const braintree_1 = __importDefault(require("braintree"));
const crypto_1 = __importDefault(require("crypto"));
class CartOrderController {
    constructor() {
        this.addToCart = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId, userId, quantity } = req.body;
                if (!productId || !userId || !quantity)
                    return next(new appError_1.default(errorMessages_1.PRODUCT_ID_AND_USER_ID_QUANTITY_REQUIRED, statusCodes_1.BAD_REQUEST));
                if (!validators_1.default.isObjectIdValid(productId) || !validators_1.default.isObjectIdValid(userId))
                    return next(new appError_1.default(errorMessages_1.BAD_FORMAT_ID, statusCodes_1.BAD_REQUEST));
                if (!(yield productService_1.default.findProductById(productId)))
                    return next(new appError_1.default(errorMessages_1.PRODUCT_NOT_EXISTS, statusCodes_1.BAD_REQUEST));
                if (!(yield authService_1.default.findUserById(userId)))
                    return next(new appError_1.default(errorMessages_1.USER_WITH_ID_NOT_FOUND, statusCodes_1.BAD_REQUEST));
                if ((yield cartOrderService_1.default.findCartItemByProductIdAnduserId(productId, userId)) != null) {
                    res.status(statusCodes_1.CREATED).json({
                        status: statusMessages_1.SUCCESS_MSG,
                        message: successMessages_1.ITEM_ALREADY_IN_CART
                    });
                }
                else {
                    console.log('new');
                    const newCartItem = yield cartOrderService_1.default.addToCart(productId, userId, quantity);
                    if (!newCartItem)
                        return next(new appError_1.default(errorMessages_1.ERROR_ADDING_TO_CART, statusCodes_1.INTERNAL_SERVER_ERROR));
                    res.status(statusCodes_1.CREATED).json({
                        status: statusMessages_1.SUCCESS_MSG,
                        message: successMessages_1.ADDED_TO_CART_SUCCESSFULLY
                    });
                }
            }
            catch (e) {
                console.log(e.message);
                return next(new appError_1.default(errorMessages_1.ERROR_ADDING_TO_CART, statusCodes_1.INTERNAL_SERVER_ERROR));
            }
        });
        this.getCart = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userid;
                if (!userId)
                    return next(new appError_1.default(errorMessages_1.USER_ID_REQUIRED, statusCodes_1.BAD_REQUEST));
                if (!validators_1.default.isObjectIdValid(userId))
                    return next(new appError_1.default(errorMessages_1.BAD_FORMAT_ID, statusCodes_1.BAD_REQUEST));
                if (!(yield authService_1.default.findUserById(userId)))
                    return next(new appError_1.default(errorMessages_1.USER_WITH_ID_NOT_FOUND, statusCodes_1.BAD_REQUEST));
                const cart = yield cartOrderService_1.default.fetchCart(userId);
                res.status(statusCodes_1.SUCCESS).json({
                    status: statusMessages_1.SUCCESS_MSG,
                    data: { cart }
                });
            }
            catch (e) {
                console.log(e.message);
                return next(new appError_1.default(errorMessages_1.ERROR_FETCHING_CART, statusCodes_1.INTERNAL_SERVER_ERROR));
            }
        });
        this.deleteCart = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userid;
                if (!userId)
                    return next(new appError_1.default(errorMessages_1.USER_ID_REQUIRED, statusCodes_1.BAD_REQUEST));
                if (!validators_1.default.isObjectIdValid(userId))
                    return next(new appError_1.default(errorMessages_1.BAD_FORMAT_ID, statusCodes_1.BAD_REQUEST));
                if (!(yield authService_1.default.findUserById(userId)))
                    return next(new appError_1.default(errorMessages_1.USER_WITH_ID_NOT_FOUND, statusCodes_1.BAD_REQUEST));
                const cart = yield cartOrderService_1.default.deleteCart(userId);
                if (!cart)
                    return next(new appError_1.default(errorMessages_1.ERROR_DELETING_CART, statusCodes_1.INTERNAL_SERVER_ERROR));
                res.status(statusCodes_1.NO_CONTENT).json({
                    status: statusMessages_1.SUCCESS_MSG
                });
            }
            catch (e) {
                console.log(e.message);
                return next(new appError_1.default(errorMessages_1.ERROR_DELETING_CART, statusCodes_1.INTERNAL_SERVER_ERROR));
            }
        });
        this.flutterStripeOrderhandler = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const order = req.body;
                const newOrder = yield cartOrderService_1.default.addOrder(order);
                res.status(statusCodes_1.SUCCESS).json({
                    status: statusMessages_1.SUCCESS_MSG,
                    data: newOrder
                });
            }
            catch (e) {
                console.log(e.message);
                return next(new appError_1.default(errorMessages_1.ERROR_SAVING_ORDER, statusCodes_1.INTERNAL_SERVER_ERROR));
            }
        });
        this.flutterPaypalRequesthandler = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const order = req.body;
                const nonce = req.params.nonce;
                const gateway = new braintree_1.default.BraintreeGateway({
                    environment: braintree_1.default.Environment.Sandbox,
                    merchantId: process.env.BRAINTREE_MERCHANT_ID || '',
                    publicKey: process.env.BRAINTREE_PUBLIC_KEY || '',
                    privateKey: process.env.BRAINTREE_PRIVATE_KEY || ''
                });
                const orderId = crypto_1.default.randomBytes(32).toString('hex');
                const saleRequest = {
                    amount: order.total,
                    paymentMethodNonce: nonce,
                    orderId: orderId,
                    options: {
                        submitForSettlement: true,
                    }
                };
                const result = yield gateway.transaction.sale(saleRequest);
                if (result.success) {
                    const newOrder = yield cartOrderService_1.default.addOrder(order);
                    res.status(statusCodes_1.SUCCESS).json({
                        status: statusMessages_1.SUCCESS_MSG,
                        data: newOrder
                    });
                }
                else {
                    return next(new appError_1.default(errorMessages_1.PAYPAL_TRANSACTION_FAILED, statusCodes_1.INTERNAL_SERVER_ERROR));
                }
            }
            catch (e) {
                console.log(e.message);
                return next(new appError_1.default(errorMessages_1.ERROR_SAVING_ORDER, statusCodes_1.INTERNAL_SERVER_ERROR));
            }
        });
        this.getOrders = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userid;
                if (!userId)
                    return next(new appError_1.default(errorMessages_1.USER_ID_REQUIRED, statusCodes_1.BAD_REQUEST));
                if (!validators_1.default.isObjectIdValid(userId))
                    return next(new appError_1.default(errorMessages_1.BAD_FORMAT_ID, statusCodes_1.BAD_REQUEST));
                const orders = yield cartOrderService_1.default.getOrdersByUserId(userId);
                res.status(statusCodes_1.SUCCESS).json({
                    status: statusMessages_1.SUCCESS_MSG,
                    data: { orders }
                });
            }
            catch (e) {
                console.log(e.message);
                return next(new appError_1.default(errorMessages_1.ERROR_FETCHING_CART, statusCodes_1.INTERNAL_SERVER_ERROR));
            }
        });
    }
}
exports.default = new CartOrderController();
