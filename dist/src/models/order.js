"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cart_item_schema_1 = __importDefault(require("./cart_item_schema"));
const shippingDetails_schema_1 = __importDefault(require("./shippingDetails_schema"));
const orderSchema = new mongoose_1.default.Schema({
    shippingDetails: {
        type: shippingDetails_schema_1.default,
        required: [true, 'Shipping details required']
    },
    shippingCost: {
        type: String,
        required: [true, 'Shipping cost is required']
    },
    tax: {
        type: String,
        required: [true, 'Tax is required']
    },
    total: {
        type: String,
        required: [true, 'Total cost is required']
    },
    totalItemPrice: {
        type: String,
        required: [true, 'Total item price is required']
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        default: null,
        ref: 'User'
    },
    paymentMethod: {
        type: String,
        required: [true, 'Payment Method is required']
    },
    userType: {
        type: String,
        required: [true, 'User type is required']
    },
    dateOrdered: {
        type: Date,
        default: Date.now()
    },
    cartItems: {
        type: [cart_item_schema_1.default],
        required: [true, 'Cart items are required']
    }
});
const orderModel = mongoose_1.default.model('Order', orderSchema);
exports.default = orderModel;
