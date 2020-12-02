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
/* eslint-disable @typescript-eslint/no-explicit-any */
const product_1 = __importDefault(require("../models/product"));
class ProductService {
    constructor() {
        this.addProduct = (data) => __awaiter(this, void 0, void 0, function* () {
            return yield product_1.default.create(Object.assign({}, data));
        });
        this.findProductById = (productId) => __awaiter(this, void 0, void 0, function* () {
            return yield product_1.default.findById(productId);
        });
        this.updateProduct = (productId, data) => __awaiter(this, void 0, void 0, function* () {
            return yield product_1.default.findByIdAndUpdate(productId, { $set: Object.assign(Object.assign({}, data), { category: data.category }) }, { new: true, useFindAndModify: false });
        });
        this.findProductByName = (name) => __awaiter(this, void 0, void 0, function* () {
            return yield product_1.default.findOne({ name });
        });
        this.getAllProducts = () => __awaiter(this, void 0, void 0, function* () {
            return yield product_1.default.aggregate([{ $sample: { size: 40 } }]);
        });
        this.deleteProductById = (productId) => __awaiter(this, void 0, void 0, function* () {
            return yield product_1.default.findByIdAndDelete(productId);
        });
        this.searchByNameOrCategory = (value) => __awaiter(this, void 0, void 0, function* () {
            const result = yield product_1.default.find({ $or: [{ name: { $regex: value, $options: 'i' } }, { category: { $regex: value, $options: 'i' } }] });
            return result != null ? result : null;
        });
        this.searchByCategory = (category) => __awaiter(this, void 0, void 0, function* () {
            const result = yield product_1.default.find({ category: { $regex: category, $options: 'i' } });
            return result != null ? result : null;
        });
    }
}
exports.default = new ProductService();
