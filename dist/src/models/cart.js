"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cartSchema = new mongoose_1.default.Schema({
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, 'A product id is required'],
        ref: "Product"
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: [true, 'A user id is required'],
        ref: "User"
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required']
    }
});
const Cart = mongoose_1.default.model('Cart', cartSchema);
exports.default = Cart;
