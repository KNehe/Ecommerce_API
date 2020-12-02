"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const shippingSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    phoneContact: {
        type: String,
        required: [true, 'Phonr contact is required']
    },
    addressLine: {
        type: String,
        required: [true, 'Addressline is required']
    },
    city: {
        type: String,
        required: [true, 'City is required']
    },
    postalCode: {
        type: String,
        required: [true, 'Postal code is required']
    },
    country: {
        type: String,
        required: [true, 'Country is required']
    },
});
exports.default = shippingSchema;
