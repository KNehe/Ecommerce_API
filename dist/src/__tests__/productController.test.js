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
const app_1 = __importDefault(require("../app"));
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const productService_1 = __importDefault(require("../services/productService"));
const product_1 = __importDefault(require("../models/product"));
const errorMessages_1 = require("../utils/errorMessages");
const statusCodes_1 = require("../utils/statusCodes");
const successMessages_1 = require("../utils/successMessages");
const statusMessages_1 = require("../utils/statusMessages");
const rawTestData_1 = require("../utils/rawTestData");
const PORT = Number(process.env.PORT || 3000);
const DB = process.env.TEST_DATABASE || '';
let server;
beforeAll((done) => __awaiter(void 0, void 0, void 0, function* () {
    server = app_1.default.listen(PORT);
    jest.setTimeout(50000);
    yield mongoose_1.default.connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
    });
    done();
}));
beforeEach((done) => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.db.collection('products').deleteMany({});
    jest.clearAllMocks();
    done();
}));
afterEach((done) => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.db.collection('products').deleteMany({});
    done();
}));
afterAll((done) => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
    server.close();
    done();
}));
describe('Update product by id', () => {
    test('Should not update product if user is not an admin', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .patch(`${rawTestData_1.base_url}/products/5fc62c4f73593406f0886077$`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_user_jwt}`)
            .then((response) => {
            expect(response.body.message).toBe(errorMessages_1.ROLE_NOT_ALLOWED);
        });
        done();
    }));
    test('Should not update product if id is has a wrong format', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const wrongId = 'xfd';
        yield supertest_1.default(app_1.default)
            .patch(`${rawTestData_1.base_url}/products/${wrongId}`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_admin_jwt}`)
            .then((response) => {
            expect(response.body.message).toBe(errorMessages_1.BAD_FORMAT_ID);
        });
        done();
    }));
    test('Should not update product if product does not exist', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const findProductByIdSpy = jest.spyOn(productService_1.default, 'findProductById');
        yield supertest_1.default(app_1.default)
            .patch(`${rawTestData_1.base_url}/products/5fc62c4f73593406f0886077`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_admin_jwt}`)
            .then((response) => {
            expect(response.body.statusCode).toBe(statusCodes_1.BAD_REQUEST);
            expect(response.body.status).toBe('fail');
            expect(response.body.message).toBe(errorMessages_1.PRODUCT_NOT_EXISTS);
        });
        expect(findProductByIdSpy).toBeCalledTimes(1);
        done();
    }));
    test('Should not update product if no field is provided for update', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const findProductByIdSpy = jest.spyOn(productService_1.default, 'findProductById');
        const product = { name: 'Shoe', price: 200, details: 'details', category: 'Shoes', imageUrl: 'https://fdf.jpd' };
        const newProduct = yield productService_1.default.addProduct(product);
        yield supertest_1.default(app_1.default)
            .patch(`${rawTestData_1.base_url}/products/${newProduct._id}`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_admin_jwt}`)
            .send({})
            .then((response) => {
            expect(response.body.statusCode).toBe(statusCodes_1.BAD_REQUEST);
            expect(response.body.message).toBe(errorMessages_1.ATLEAST_ONE_FIELD_REQUIRED);
        });
        expect(findProductByIdSpy).toBeCalledTimes(1);
        done();
    }));
    test('Should update product', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const findProductByIdSpy = jest.spyOn(productService_1.default, 'findProductById');
        const updateProductSpy = jest.spyOn(productService_1.default, 'updateProduct');
        const product = { name: 'Shoe', price: 200, details: 'details', category: 'Shoes', imageUrl: 'https://fdf.jpd' };
        const newProduct = yield productService_1.default.addProduct(product);
        yield supertest_1.default(app_1.default)
            .patch(`${rawTestData_1.base_url}/products/${newProduct._id}`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_admin_jwt}`)
            .send({ name: 'fish' })
            .then((response) => {
            expect(response.body.status).toBe(statusMessages_1.SUCCESS_MSG);
            expect(response.body.data.updatedProduct.name).not.toBe(product.name);
            expect(response.body.data.updatedProduct.name).toBe('fish');
            expect(response.body.data.updatedProduct.price).toBe(product.price);
        });
        expect(findProductByIdSpy).toBeCalledTimes(1);
        expect(updateProductSpy).toBeCalledTimes(1);
        done();
    }));
});
describe('Get products route', () => {
    test('Should get all products', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const getProductsSpy = jest.spyOn(productService_1.default, 'getAllProducts');
        yield product_1.default.create({ name: 'Shoe', price: 200, details: 'details', category: 'Shoes', imageUrl: 'https://fdf.jpd' });
        yield product_1.default.create({ name: 'Shoe', price: 200, details: 'details', category: 'Shoes', imageUrl: 'https://fdf.jpd' });
        yield supertest_1.default(app_1.default)
            .get(`${rawTestData_1.base_url}/products/`)
            .expect(200)
            .then((response) => {
            expect(Array.isArray(response.body.data.products)).toBeTruthy();
            expect(response.body.data.products.length).toBeTruthy();
            expect(response.body.data.products[0].name).toEqual('Shoe');
            expect(response.body.data.products[0].details).toEqual('details');
            expect(response.body.data.products[0].category).toEqual('Shoes');
        });
        expect(getProductsSpy).toHaveBeenCalledTimes(1);
        done();
    }));
    test('Should get no products', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const getProductsSpy = jest.spyOn(productService_1.default, 'getAllProducts');
        yield supertest_1.default(app_1.default)
            .get(`${rawTestData_1.base_url}/products/`)
            .expect(200)
            .then((response) => {
            expect(response.body.data.products.length).toBe(0);
        });
        expect(getProductsSpy).toHaveBeenCalledTimes(1);
        done();
    }));
});
describe('Add product', () => {
    test('Should not add product if any required field is missing', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .post(`${rawTestData_1.base_url}/products/`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_admin_jwt}`)
            .send({ name: 'shoe' })
            .expect(400)
            .then((response) => {
            expect(response.body.message).toBe(errorMessages_1.NAME_PRICE_IMGURL_CATEGORY_DETAILS_REQUIRED);
        });
        done();
    }));
    test('Should not add product when no body provided', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .post(`${rawTestData_1.base_url}/products/`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_admin_jwt}`)
            .then((response) => {
            expect(response.body.statusCode).toBe(statusCodes_1.INTERNAL_SERVER_ERROR);
            expect(response.body.message).toBe(errorMessages_1.ERROR_ADDING_PRODUCT);
        });
        done();
    }));
    test('Should not add product when user is not an admin', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .post(`${rawTestData_1.base_url}/products/`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_user_jwt}`)
            .then((response) => {
            expect(response.body.statusCode).toBe(statusCodes_1.UNAUTHORISED);
            expect(response.body.message).toBe(errorMessages_1.ROLE_NOT_ALLOWED);
        });
        done();
    }));
    test('Should not add product when jwt is invalid', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .post(`${rawTestData_1.base_url}/products/`)
            .set('Authorization', `Bearer ${rawTestData_1.invalid_jwt}`)
            .then((response) => {
            expect(response.body.statusCode).toBe(statusCodes_1.BAD_REQUEST);
            expect(response.body.message).toBe(errorMessages_1.INVALID_JWT_TOKEN);
        });
        done();
    }));
    test('Should add product', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .post(`${rawTestData_1.base_url}/products/`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_admin_jwt}`)
            .send({ name: 'new prod', price: '100', imageUrl: 'https://fff/f.png', category: 'img', details: 'details' })
            .expect(statusCodes_1.CREATED)
            .then((response) => {
            expect(response.body.status).toBe(statusMessages_1.SUCCESS_MSG);
            expect(response.body.data.message).toBe(successMessages_1.PRODUCT_ADDED);
            expect(response.body.data.newProduct.name).toBe('new prod');
            expect(response.body.data.newProduct.category).toBe('img');
        });
        done();
    }));
});
describe('Add product image', () => {
    test('Should not add product image if jwt token not provided', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .post(`${rawTestData_1.base_url}/products/addProductImage`)
            .expect(400)
            .then((response) => {
            expect(response.body.message).toBe(errorMessages_1.JWT_TOKEN_NOT_FOUND);
        });
        done();
    }));
    test('Should not add product image if jwt token is invalid', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .post(`${rawTestData_1.base_url}/products/addProductImage`)
            .set('Authorization', `Bearer ${rawTestData_1.invalid_jwt}`)
            .expect(400)
            .then((response) => {
            expect(response.body.message).toBe(errorMessages_1.INVALID_JWT_TOKEN);
        });
        done();
    }));
    test('Should not add product image if user is not admin', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .post(`${rawTestData_1.base_url}/products/addProductImage`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_user_jwt}`)
            .then((response) => {
            expect(response.body.statusCode).toBe(statusCodes_1.UNAUTHORISED);
            expect(response.body.message).toBe(errorMessages_1.ROLE_NOT_ALLOWED);
        });
        done();
    }));
    test('Should not add product image when no image is provided', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .post(`${rawTestData_1.base_url}/products/addProductImage`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_admin_jwt}`)
            .expect(400)
            .then((response) => {
            expect(response.body.message).toBe(errorMessages_1.NO_IMAGE_PROVIDED);
        });
        done();
    }));
});
describe('Get product by id', () => {
    test('Should not get product if id is has a wrong format', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const wrongId = 'xfd';
        yield supertest_1.default(app_1.default)
            .get(`${rawTestData_1.base_url}/products/${wrongId}`)
            .then((response) => {
            expect(response.body.message).toBe(errorMessages_1.BAD_FORMAT_ID);
        });
        done();
    }));
    test('Should get product by id', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const findProductByIdSpy = jest.spyOn(productService_1.default, 'findProductById');
        const addProductSpy = jest.spyOn(productService_1.default, 'addProduct');
        const product = { name: 'Shoe', price: 200, details: 'details', category: 'Shoes', imageUrl: 'https://fdf.jpd' };
        const newProduct = yield productService_1.default.addProduct(product);
        yield supertest_1.default(app_1.default)
            .get(`${rawTestData_1.base_url}/products/${newProduct._id}`)
            .then((response) => {
            expect(response.body.status).toBe(statusMessages_1.SUCCESS_MSG);
            expect(response.body.data.product.name).toBe(product.name);
        });
        expect(findProductByIdSpy).toBeCalledTimes(1);
        expect(addProductSpy).toBeCalledTimes(1);
        done();
    }));
});
describe('Delete product by id', () => {
    test('Should not delete product if user is not an admin', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .delete(`${rawTestData_1.base_url}/products/5fc62c4f73593406f0886077$`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_user_jwt}`)
            .then((response) => {
            expect(response.body.message).toBe(errorMessages_1.ROLE_NOT_ALLOWED);
        });
        done();
    }));
    test('Should not delete product if id is has a wrong format', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const wrongId = 'xfd';
        yield supertest_1.default(app_1.default)
            .delete(`${rawTestData_1.base_url}/products/${wrongId}`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_admin_jwt}`)
            .then((response) => {
            expect(response.body.message).toBe(errorMessages_1.BAD_FORMAT_ID);
        });
        done();
    }));
    test('Should not delete product if product does not exist', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const findProductByIdSpy = jest.spyOn(productService_1.default, 'findProductById');
        yield supertest_1.default(app_1.default)
            .delete(`${rawTestData_1.base_url}/products/5fc62c4f73593406f0886077`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_admin_jwt}`)
            .then((response) => {
            expect(response.body.statusCode).toBe(statusCodes_1.BAD_REQUEST);
            expect(response.body.status).toBe('fail');
            expect(response.body.message).toBe(errorMessages_1.PRODUCT_NOT_EXISTS);
        });
        expect(findProductByIdSpy).toBeCalledTimes(1);
        done();
    }));
    test('Should delete product', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const findProductByIdSpy = jest.spyOn(productService_1.default, 'findProductById');
        const deleteSpy = jest.spyOn(productService_1.default, 'deleteProductById');
        const product = { name: 'Shoe', price: 200, details: 'details', category: 'Shoes', imageUrl: 'https://fdf.jpd' };
        const newProduct = yield productService_1.default.addProduct(product);
        const emptyObject = {};
        yield supertest_1.default(app_1.default)
            .delete(`${rawTestData_1.base_url}/products/${newProduct._id}`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_admin_jwt}`)
            .expect(statusCodes_1.NO_CONTENT)
            .then((response) => {
            expect(response.body).toStrictEqual(emptyObject);
        });
        expect(findProductByIdSpy).toBeCalledTimes(1);
        expect(deleteSpy).toBeCalledTimes(1);
        done();
    }));
});
describe('Product Search', () => {
    test('Should search by name or category and return nothing', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const searchSpy = jest.spyOn(productService_1.default, 'searchByNameOrCategory');
        yield supertest_1.default(app_1.default)
            .get(`${rawTestData_1.base_url}/products/search/food`)
            .expect(200)
            .then((response) => {
            expect(response.body.data.result.length).toBe(0);
        });
        expect(searchSpy).toHaveBeenCalledTimes(1);
        done();
    }));
    test('Should search by name or category and return a result', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const searchSpy = jest.spyOn(productService_1.default, 'searchByNameOrCategory');
        const product = { name: 'Shoe', price: 200, details: 'details', category: 'food', imageUrl: 'https://fdf.jpd' };
        const newProduct = yield productService_1.default.addProduct(product);
        yield supertest_1.default(app_1.default)
            .get(`${rawTestData_1.base_url}/products/search/food`)
            .then((response) => {
            expect(response.body.data.result[0].name).toBe(newProduct.name);
            expect(response.body.data.result.length).toBe(1);
        });
        expect(searchSpy).toHaveBeenCalledTimes(1);
        done();
    }));
    test('Should search by  category and return nothing', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const searchSpy = jest.spyOn(productService_1.default, 'searchByCategory');
        yield supertest_1.default(app_1.default)
            .get(`${rawTestData_1.base_url}/products/search/category/phones`)
            .then((response) => {
            expect(response.body.data.result.length).toBe(0);
        });
        expect(searchSpy).toHaveBeenCalledTimes(1);
        done();
    }));
    test('Should search by category and return a result', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const searchSpy = jest.spyOn(productService_1.default, 'searchByCategory');
        const product = { name: 'Shoe', price: 200, details: 'details', category: 'phones', imageUrl: 'https://fdf.jpd' };
        const newProduct = yield productService_1.default.addProduct(product);
        yield supertest_1.default(app_1.default)
            .get(`${rawTestData_1.base_url}/products/search/category/phones`)
            .then((response) => {
            expect(response.body.data.result[0].name).toBe(newProduct.name);
            expect(response.body.data.result.length).toBe(1);
        });
        expect(searchSpy).toHaveBeenCalledTimes(1);
        done();
    }));
});
