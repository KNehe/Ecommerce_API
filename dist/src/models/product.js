"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'A name is required']
    },
    price: {
        type: Number,
        required: [true, 'A price is required']
    },
    imageUrl: {
        type: String,
        required: [true, 'An image url is required']
    },
    category: {
        type: String,
        required: [true, 'A category id is required']
    },
    details: {
        type: String,
        required: [true, 'Product details are required']
    }
});
const Product = mongoose_1.default.model('Product', productSchema);
exports.default = Product;
