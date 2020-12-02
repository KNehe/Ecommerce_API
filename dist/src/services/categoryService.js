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
const categories_1 = __importDefault(require("../models/categories"));
/* eslint-disable @typescript-eslint/no-explicit-any */
class CategoryService {
    constructor() {
        this.addCategory = (category) => __awaiter(this, void 0, void 0, function* () {
            return yield categories_1.default.create({ category });
        });
        this.findCategory = (category) => __awaiter(this, void 0, void 0, function* () {
            return yield categories_1.default.findOne({ category });
        });
        this.getAllCategories = () => __awaiter(this, void 0, void 0, function* () {
            return yield categories_1.default.find();
        });
        this.findCategoryById = (id) => __awaiter(this, void 0, void 0, function* () {
            return yield categories_1.default.findById(id);
        });
        this.updateCategoryById = (id, category) => __awaiter(this, void 0, void 0, function* () {
            return yield categories_1.default.findByIdAndUpdate(id, { category }, { new: true, useFindAndModify: false });
        });
        this.deleteCategoryById = (id) => __awaiter(this, void 0, void 0, function* () {
            return yield categories_1.default.findByIdAndDelete(id);
        });
    }
}
exports.default = new CategoryService();
