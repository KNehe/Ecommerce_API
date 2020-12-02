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
const statusCodes_1 = require("../utils/statusCodes");
const statusMessages_1 = require("../utils/statusMessages");
const appError_1 = __importDefault(require("../utils/appError"));
const errorMessages_1 = require("../utils/errorMessages");
const uploadService_1 = __importDefault(require("../services/uploadService"));
const productService_1 = __importDefault(require("../services/productService"));
const successMessages_1 = require("../utils/successMessages");
const validators_1 = __importDefault(require("../utils/validators"));
const lodash_1 = __importDefault(require("lodash"));
class ProductController {
    constructor() {
        this.addProduct = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, price, imageUrl, category, details } = req.body;
                if (!name.trim() || !price || !imageUrl.trim() || !category.trim() || !details.trim())
                    return next(new appError_1.default(errorMessages_1.NAME_PRICE_IMGURL_CATEGORY_DETAILS_REQUIRED, statusCodes_1.BAD_REQUEST));
                if ((yield productService_1.default.findProductByName(name)) != null)
                    return next(new appError_1.default(errorMessages_1.PRODUCT_EXISTS, statusCodes_1.BAD_REQUEST));
                const newProduct = yield productService_1.default.addProduct({ name, price, imageUrl, category, details });
                res.status(statusCodes_1.CREATED).json({
                    status: statusMessages_1.SUCCESS_MSG,
                    data: {
                        message: successMessages_1.PRODUCT_ADDED,
                        newProduct,
                    }
                });
            }
            catch (e) {
                console.log(e.message);
                return next(new appError_1.default(errorMessages_1.ERROR_ADDING_PRODUCT, statusCodes_1.INTERNAL_SERVER_ERROR));
            }
        });
        this.addProductImage = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                uploadService_1.default.writeToFolder(req, res, (err) => __awaiter(this, void 0, void 0, function* () {
                    var _a, _b;
                    if (err) {
                        this.handleWriteToFolderError(err, next);
                    }
                    else {
                        const fileName = (_b = (_a = res === null || res === void 0 ? void 0 : res.req) === null || _a === void 0 ? void 0 : _a.file) === null || _b === void 0 ? void 0 : _b.filename;
                        if (!fileName)
                            return next(new appError_1.default(errorMessages_1.NO_IMAGE_PROVIDED, statusCodes_1.BAD_REQUEST));
                        const imgPath = `${__dirname}./../uploads/${fileName}`;
                        const imgCloudUrl = yield uploadService_1.default.uploadToCloud(imgPath);
                        res.status(statusCodes_1.CREATED).json({
                            status: statusMessages_1.SUCCESS_MSG,
                            data: {
                                imageUrl: imgCloudUrl
                            }
                        });
                    }
                }));
            }
            catch (e) {
                console.log(e.message);
                return next(new appError_1.default(errorMessages_1.ERROR_ADDING_IMAGE, statusCodes_1.INTERNAL_SERVER_ERROR));
            }
        });
        this.handleWriteToFolderError = (err, next) => {
            if (err.code == statusMessages_1.LIMIT_FILE_SIZE)
                return next(new appError_1.default(errorMessages_1.LIMIT_FILE_SIZE_ERROR, statusCodes_1.BAD_REQUEST));
            if (err.message == errorMessages_1.WRONG_IMG_MIME)
                return next(new appError_1.default(errorMessages_1.WRONG_IMG_MIME, statusCodes_1.BAD_REQUEST));
            return next(new appError_1.default(errorMessages_1.IMAGE_UPLOAD_ERROR, statusCodes_1.BAD_REQUEST));
        };
        this.getAllProducts = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield productService_1.default.getAllProducts();
                res.status(statusCodes_1.SUCCESS).json({
                    status: statusMessages_1.SUCCESS_MSG,
                    data: {
                        products
                    }
                });
            }
            catch (e) {
                console.log(e.message);
                return next(new appError_1.default(errorMessages_1.ERROR_FETCHING_PRODUCTS, statusCodes_1.INTERNAL_SERVER_ERROR));
            }
        });
        this.getAllProductById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const productId = req.params.id.trim();
                if (!productId)
                    return next(new appError_1.default(errorMessages_1.PRODUCT_ID_REQUIRED, statusCodes_1.BAD_REQUEST));
                if (!validators_1.default.isObjectIdValid(productId))
                    return next(new appError_1.default(errorMessages_1.BAD_FORMAT_ID, statusCodes_1.BAD_REQUEST));
                const product = yield productService_1.default.findProductById(productId);
                res.status(statusCodes_1.SUCCESS).json({
                    status: statusMessages_1.SUCCESS_MSG,
                    data: { product }
                });
            }
            catch (e) {
                console.log(e.message);
                return next(new appError_1.default(errorMessages_1.ERROR_FETCHING_PRODUCT, statusCodes_1.INTERNAL_SERVER_ERROR));
            }
        });
        this.deleteProduct = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const productId = req.params.id.trim();
                if (!productId)
                    return next(new appError_1.default(errorMessages_1.PRODUCT_ID_REQUIRED, statusCodes_1.BAD_REQUEST));
                if (!validators_1.default.isObjectIdValid(productId))
                    return next(new appError_1.default(errorMessages_1.BAD_FORMAT_ID, statusCodes_1.BAD_REQUEST));
                const product = yield productService_1.default.findProductById(productId);
                if (!product)
                    return next(new appError_1.default(errorMessages_1.PRODUCT_NOT_EXISTS, statusCodes_1.BAD_REQUEST));
                const result = yield productService_1.default.deleteProductById(productId);
                if (!result)
                    return next(new appError_1.default(errorMessages_1.ERROR_DELETING_PRODUCT, statusCodes_1.INTERNAL_SERVER_ERROR));
                res.status(statusCodes_1.NO_CONTENT).json({
                    status: statusMessages_1.SUCCESS_MSG
                });
            }
            catch (e) {
                console.log(e.message);
                return next(new appError_1.default(errorMessages_1.ERROR_DELETING_PRODUCT, statusCodes_1.INTERNAL_SERVER_ERROR));
            }
        });
        this.updateProductById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const productId = req.params.id.trim();
                if (!productId)
                    return next(new appError_1.default(errorMessages_1.PRODUCT_ID_REQUIRED, statusCodes_1.BAD_REQUEST));
                if (!validators_1.default.isObjectIdValid(productId))
                    return next(new appError_1.default(errorMessages_1.BAD_FORMAT_ID, statusCodes_1.BAD_REQUEST));
                const product = yield productService_1.default.findProductById(productId);
                if (!product)
                    return next(new appError_1.default(errorMessages_1.PRODUCT_NOT_EXISTS, statusCodes_1.BAD_REQUEST));
                const { name, price, imageUrl, category, details } = req.body;
                if (!name && !price && !imageUrl && !category && !details)
                    return next(new appError_1.default(errorMessages_1.ATLEAST_ONE_FIELD_REQUIRED, statusCodes_1.BAD_REQUEST));
                const dataToUpdate = lodash_1.default.pickBy(req.body, lodash_1.default.identity);
                const result = yield productService_1.default.updateProduct(productId, dataToUpdate);
                if (!result)
                    return next(new appError_1.default(errorMessages_1.ERROR_UPDATING_PRODUCT, statusCodes_1.INTERNAL_SERVER_ERROR));
                res.status(statusCodes_1.SUCCESS).json({
                    status: statusMessages_1.SUCCESS_MSG,
                    data: {
                        updatedProduct: result
                    }
                });
            }
            catch (e) {
                console.log(e.message);
                return next(new appError_1.default(errorMessages_1.ERROR_UPDATING_PRODUCT, statusCodes_1.INTERNAL_SERVER_ERROR));
            }
        });
        this.searchByNameOrCategory = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const value = req.params.value;
                if (!value.trim())
                    return next(new appError_1.default(errorMessages_1.SEARCH_VALUE_REQUIRED, statusCodes_1.BAD_REQUEST));
                const result = yield productService_1.default.searchByNameOrCategory(value);
                res.status(statusCodes_1.SUCCESS).json({
                    status: statusMessages_1.SUCCESS_MSG,
                    data: { result }
                });
            }
            catch (e) {
                console.log(e.message);
                return next(new appError_1.default(errorMessages_1.ERROR_SEARCHING, statusCodes_1.INTERNAL_SERVER_ERROR));
            }
        });
        this.searchByCategory = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const category = req.params.category;
                if (!category.trim())
                    return next(new appError_1.default(errorMessages_1.SEARCH_VALUE_REQUIRED, statusCodes_1.BAD_REQUEST));
                const result = yield productService_1.default.searchByCategory(category);
                res.status(statusCodes_1.SUCCESS).json({
                    status: statusMessages_1.SUCCESS_MSG,
                    data: { result }
                });
            }
            catch (e) {
                console.log(e.message);
                return next(new appError_1.default(errorMessages_1.ERROR_SEARCHING, statusCodes_1.INTERNAL_SERVER_ERROR));
            }
        });
    }
}
exports.default = new ProductController();
