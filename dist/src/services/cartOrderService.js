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
const cart_1 = __importDefault(require("../models/cart"));
const order_1 = __importDefault(require("../models/order"));
class CartOrderService {
    constructor() {
        this.addToCart = (productId, userId, quantity) => __awaiter(this, void 0, void 0, function* () {
            return yield cart_1.default.create({ product: productId, user: userId, quantity });
        });
        this.findCartItemByProductIdAnduserId = (productId, userId) => __awaiter(this, void 0, void 0, function* () {
            const res = yield cart_1.default.find({ product: productId, user: userId }).exec();
            return res.length == 0 ? null : res;
        });
        this.fetchCart = (userId) => __awaiter(this, void 0, void 0, function* () {
            return yield cart_1.default.find({ user: userId })
                .populate({
                path: 'product'
            }).exec();
        });
        this.deleteCart = (userId) => __awaiter(this, void 0, void 0, function* () {
            return yield cart_1.default.deleteMany({ user: userId });
        });
        this.addOrder = (order) => __awaiter(this, void 0, void 0, function* () {
            return yield order_1.default.create(Object.assign({}, order));
        });
        this.getOrdersByUserId = (userId) => __awaiter(this, void 0, void 0, function* () {
            return yield order_1.default.find({ userId }).sort({ 'dateOrdered': -1 });
        });
    }
}
exports.default = new CartOrderService();
