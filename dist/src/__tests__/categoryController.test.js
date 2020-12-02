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
const app_1 = __importDefault(require("./../app"));
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const errorMessages_1 = require("../utils/errorMessages");
const statusCodes_1 = require("../utils/statusCodes");
const statusMessages_1 = require("../utils/statusMessages");
const rawTestData_1 = require("../utils/rawTestData");
const categoryService_1 = __importDefault(require("../services/categoryService"));
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
    yield mongoose_1.default.connection.db.collection('categories').deleteMany({});
    jest.clearAllMocks();
    done();
}));
afterEach((done) => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.db.collection('categories').deleteMany({});
    done();
}));
afterAll((done) => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
    server.close();
    done();
}));
describe('Add category', () => {
    test('Should add catgory', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const addCategorySpy = jest.spyOn(categoryService_1.default, 'addCategory');
        yield supertest_1.default(app_1.default)
            .post(`${rawTestData_1.base_url}/categories/`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_admin_jwt}`)
            .send({ category: "Shoes" })
            .then((response) => {
            expect(response.body.status).toBe(statusMessages_1.SUCCESS_MSG);
            expect(response.body.data.newCategory.category).toBe('Shoes');
        });
        expect(addCategorySpy).toHaveBeenCalledTimes(1);
        done();
    }));
    test('Should not add catgory if token is invalid', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .post(`${rawTestData_1.base_url}/categories/`)
            .set('Authorization', `Bearer faketoekn`)
            .then((response) => {
            expect(response.body.statusCode).toBe(statusCodes_1.BAD_REQUEST);
            expect(response.body.message).toBe(errorMessages_1.INVALID_JWT_TOKEN);
        });
        done();
    }));
    test('Should not add catgory if user not an admin', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .post(`${rawTestData_1.base_url}/categories/`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_user_jwt}`)
            .then((response) => {
            expect(response.body.statusCode).toBe(statusCodes_1.UNAUTHORISED);
            expect(response.body.message).toBe(errorMessages_1.ROLE_NOT_ALLOWED);
        });
        done();
    }));
    test('Should not add catgory if required field is empty', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .post(`${rawTestData_1.base_url}/categories/`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_admin_jwt}`)
            .send({})
            .then((response) => {
            expect(response.body.statusCode).toBe(statusCodes_1.BAD_REQUEST);
            expect(response.body.message).toBe(errorMessages_1.CATEGORY_REQUIRED);
        });
        done();
    }));
    test('Should not add catgory if it already exists', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const addCategorySpy = jest.spyOn(categoryService_1.default, 'addCategory');
        yield categoryService_1.default.addCategory("Shoes");
        yield supertest_1.default(app_1.default)
            .post(`${rawTestData_1.base_url}/categories/`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_admin_jwt}`)
            .send({ category: "Shoes" })
            .then((response) => {
            expect(response.body.statusCode).toBe(statusCodes_1.BAD_REQUEST);
            expect(response.body.message).toBe(errorMessages_1.CATEGORY_EXISTS);
        });
        expect(addCategorySpy).toHaveBeenCalledTimes(1);
        done();
    }));
});
describe('Get categories', () => {
    test('Should return no categories if any was not created', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const getAllCategoriesSpy = jest.spyOn(categoryService_1.default, 'getAllCategories');
        yield supertest_1.default(app_1.default)
            .get(`${rawTestData_1.base_url}/categories/`)
            .expect(200)
            .then((response) => {
            expect(response.body.data.categories.length).toBe(0);
        });
        expect(getAllCategoriesSpy).toHaveBeenCalledTimes(1);
        done();
    }));
    test('Should return categories', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const getAllCategoriesSpy = jest.spyOn(categoryService_1.default, 'getAllCategories');
        const addCategorySpy = jest.spyOn(categoryService_1.default, 'addCategory');
        yield categoryService_1.default.addCategory("Shoes");
        yield supertest_1.default(app_1.default)
            .get(`${rawTestData_1.base_url}/categories/`)
            .expect(200)
            .then((response) => {
            expect(response.body.data.categories.length).toBe(1);
            expect(response.body.data.categories[0].category).toBe('Shoes');
        });
        expect(getAllCategoriesSpy).toHaveBeenCalledTimes(1);
        expect(addCategorySpy).toHaveBeenCalledTimes(1);
        done();
    }));
});
describe('Delete category', () => {
    test('Should delete catgory', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const deleteCategorySpy = jest.spyOn(categoryService_1.default, 'deleteCategoryById');
        const addCategorySpy = jest.spyOn(categoryService_1.default, 'addCategory');
        const newCategory = yield categoryService_1.default.addCategory("Pens");
        yield supertest_1.default(app_1.default)
            .delete(`${rawTestData_1.base_url}/categories/${newCategory._id}`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_admin_jwt}`)
            .expect(statusCodes_1.NO_CONTENT)
            .then((response) => {
            expect(response.body).toStrictEqual({});
        });
        expect(deleteCategorySpy).toHaveBeenCalledTimes(1);
        expect(addCategorySpy).toHaveBeenCalledTimes(1);
        done();
    }));
    test('Should not delete category if token is invalid', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .delete(`${rawTestData_1.base_url}/categories/5fb385ee50297c27f8afb507`)
            .set('Authorization', `Bearer faketoekn`)
            .then((response) => {
            expect(response.body.statusCode).toBe(statusCodes_1.BAD_REQUEST);
            expect(response.body.message).toBe(errorMessages_1.INVALID_JWT_TOKEN);
        });
        done();
    }));
    test('Should not delete category if user not an admin', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .delete(`${rawTestData_1.base_url}/categories/5fb385ee50297c27f8afb507`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_user_jwt}`)
            .then((response) => {
            expect(response.body.statusCode).toBe(statusCodes_1.UNAUTHORISED);
            expect(response.body.message).toBe(errorMessages_1.ROLE_NOT_ALLOWED);
        });
        done();
    }));
    test('Should not delete category if category does not exist', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .delete(`${rawTestData_1.base_url}/categories/5fb385ee50297c27f8afb507`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_admin_jwt}`)
            .send({})
            .then((response) => {
            expect(response.body.statusCode).toBe(statusCodes_1.BAD_REQUEST);
            expect(response.body.message).toBe(errorMessages_1.CATEGORY_NOT_FOUND);
        });
        done();
    }));
    test('Should not delete category if category id is invalid ', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .delete(`${rawTestData_1.base_url}/categories/wrongid`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_admin_jwt}`)
            .then((response) => {
            expect(response.body.statusCode).toBe(statusCodes_1.BAD_REQUEST);
            expect(response.body.message).toBe(errorMessages_1.BAD_FORMAT_ID);
        });
        done();
    }));
});
describe('Update category', () => {
    test('Should update catgory', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const updateCategoryByIdSpy = jest.spyOn(categoryService_1.default, 'updateCategoryById');
        const addCategorySpy = jest.spyOn(categoryService_1.default, 'addCategory');
        const newCategory = yield categoryService_1.default.addCategory("Pens");
        yield supertest_1.default(app_1.default)
            .patch(`${rawTestData_1.base_url}/categories/${newCategory._id}`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_admin_jwt}`)
            .send({ category: 'New Pens' })
            .expect(statusCodes_1.SUCCESS)
            .then((response) => {
            expect(response.body.data.updatedCategory.category).toBe('New Pens');
        });
        expect(updateCategoryByIdSpy).toHaveBeenCalledTimes(1);
        expect(addCategorySpy).toHaveBeenCalledTimes(1);
        done();
    }));
    test('Should not update category if token is invalid', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .patch(`${rawTestData_1.base_url}/categories/an-id`)
            .set('Authorization', `Bearer faketoekn`)
            .then((response) => {
            expect(response.body.statusCode).toBe(statusCodes_1.BAD_REQUEST);
            expect(response.body.message).toBe(errorMessages_1.INVALID_JWT_TOKEN);
        });
        done();
    }));
    test('Should not update category if user not an admin', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .patch(`${rawTestData_1.base_url}/categories/5fb385ee50297c27f8afb507`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_user_jwt}`)
            .then((response) => {
            expect(response.body.statusCode).toBe(statusCodes_1.UNAUTHORISED);
            expect(response.body.message).toBe(errorMessages_1.ROLE_NOT_ALLOWED);
        });
        done();
    }));
    test('Should not update category if category is not provided', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .patch(`${rawTestData_1.base_url}/categories/5fb385ee50297c27f8afb507`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_admin_jwt}`)
            .then((response) => {
            expect(response.body.statusCode).toBe(statusCodes_1.BAD_REQUEST);
            expect(response.body.message).toBe(errorMessages_1.CATEGORY_REQUIRED);
        });
        done();
    }));
    test('Should not update category if category if category does not exist', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .patch(`${rawTestData_1.base_url}/categories/5fb385ee50297c27f8afb507`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_admin_jwt}`)
            .send({ category: 'Laptop' })
            .then((response) => {
            expect(response.body.statusCode).toBe(statusCodes_1.BAD_REQUEST);
            expect(response.body.message).toBe(errorMessages_1.CATEGORY_NOT_FOUND);
        });
        done();
    }));
    test('Should not update category if category id is invalid ', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .patch(`${rawTestData_1.base_url}/categories/wrongid`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_admin_jwt}`)
            .send({ category: 'category' })
            .then((response) => {
            expect(response.body.statusCode).toBe(statusCodes_1.BAD_REQUEST);
            expect(response.body.message).toBe(errorMessages_1.BAD_FORMAT_ID);
        });
        done();
    }));
});
