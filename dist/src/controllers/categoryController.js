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
const appError_1 = __importDefault(require("../utils/appError"));
const errorMessages_1 = require("../utils/errorMessages");
const statusCodes_1 = require("../utils/statusCodes");
const statusMessages_1 = require("../utils/statusMessages");
const validators_1 = __importDefault(require("../utils/validators"));
const categoryService_1 = __importDefault(require("./../services/categoryService"));
class CategoryController {
    constructor() {
        this.addCategory = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { category } = req.body;
                if (!category)
                    return next(new appError_1.default(errorMessages_1.CATEGORY_REQUIRED, statusCodes_1.BAD_REQUEST));
                if (yield categoryService_1.default.findCategory(category))
                    return next(new appError_1.default(errorMessages_1.CATEGORY_EXISTS, statusCodes_1.BAD_REQUEST));
                const newCategory = yield categoryService_1.default.addCategory(category);
                if (!newCategory)
                    return next(new appError_1.default(errorMessages_1.ERROR_ADDING_CATEGORY, statusCodes_1.INTERNAL_SERVER_ERROR));
                res.status(statusCodes_1.CREATED).json({
                    status: statusMessages_1.SUCCESS_MSG,
                    data: { newCategory }
                });
            }
            catch (e) {
                console.log(e.message);
                return next(new appError_1.default(errorMessages_1.ERROR_ADDING_CATEGORY, statusCodes_1.INTERNAL_SERVER_ERROR));
            }
        });
        this.getAllCategories = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield categoryService_1.default.getAllCategories();
                res.status(statusCodes_1.SUCCESS).json({
                    status: statusMessages_1.SUCCESS_MSG,
                    data: { categories }
                });
            }
            catch (e) {
                console.log(e.message);
                return next(new appError_1.default(errorMessages_1.ERROR_FETCHING_CATEGORIES, statusCodes_1.INTERNAL_SERVER_ERROR));
            }
        });
        this.updateCategory = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const { category } = req.body;
                if (!id)
                    return next(new appError_1.default(errorMessages_1.CATEGORY_ID_REQUIRED, statusCodes_1.BAD_REQUEST));
                if (!category)
                    return next(new appError_1.default(errorMessages_1.CATEGORY_REQUIRED, statusCodes_1.BAD_REQUEST));
                if (!validators_1.default.isObjectIdValid(id))
                    return next(new appError_1.default(errorMessages_1.BAD_FORMAT_ID, statusCodes_1.BAD_REQUEST));
                if (!(yield categoryService_1.default.findCategoryById(id)))
                    return next(new appError_1.default(errorMessages_1.CATEGORY_NOT_FOUND, statusCodes_1.BAD_REQUEST));
                const updatedCategory = yield categoryService_1.default.updateCategoryById(id, category);
                if (!updatedCategory)
                    return next(new appError_1.default(errorMessages_1.ERROR_UPDATING_CATEGORY, statusCodes_1.INTERNAL_SERVER_ERROR));
                res.status(statusCodes_1.SUCCESS).json({
                    status: statusMessages_1.SUCCESS_MSG,
                    data: { updatedCategory }
                });
            }
            catch (e) {
                console.log(e.message);
                return next(new appError_1.default(errorMessages_1.ERROR_UPDATING_CATEGORY, statusCodes_1.INTERNAL_SERVER_ERROR));
            }
        });
        this.deleteCategory = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                if (!id)
                    return next(new appError_1.default(errorMessages_1.CATEGORY_ID_REQUIRED, statusCodes_1.BAD_REQUEST));
                if (!validators_1.default.isObjectIdValid(id))
                    return next(new appError_1.default(errorMessages_1.BAD_FORMAT_ID, statusCodes_1.BAD_REQUEST));
                if (!(yield categoryService_1.default.findCategoryById(id)))
                    return next(new appError_1.default(errorMessages_1.CATEGORY_NOT_FOUND, statusCodes_1.BAD_REQUEST));
                const result = yield categoryService_1.default.deleteCategoryById(id);
                if (!result)
                    return next(new appError_1.default(errorMessages_1.ERROR_DELETING_CATEGORY, statusCodes_1.INTERNAL_SERVER_ERROR));
                res.status(statusCodes_1.NO_CONTENT).json({
                    status: statusMessages_1.SUCCESS_MSG
                });
            }
            catch (e) {
                console.log(e.message);
                return next(new appError_1.default(errorMessages_1.ERROR_DELETING_CATEGORY, statusCodes_1.INTERNAL_SERVER_ERROR));
            }
        });
    }
}
exports.default = new CategoryController();
