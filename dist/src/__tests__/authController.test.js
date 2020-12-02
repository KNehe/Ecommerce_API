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
const errorMessages_1 = require("../utils/errorMessages");
const statusCodes_1 = require("../utils/statusCodes");
const statusMessages_1 = require("../utils/statusMessages");
const rawTestData_1 = require("../utils/rawTestData");
const authService_1 = __importDefault(require("../services/authService"));
const authStrategy_1 = require("../utils/authStrategy");
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
    jest.clearAllMocks();
    done();
}));
afterAll((done) => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
    server.close();
    done();
}));
describe('Sign up', () => {
    test('Should sign up user ', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const signUpSpy = jest.spyOn(authService_1.default, 'signUp');
        const deleteUserSpy = jest.spyOn(authService_1.default, 'deleteUser');
        yield supertest_1.default(app_1.default)
            .post(`${rawTestData_1.base_url}/users/signup`)
            .send({ name: "nehe", email: 'nehee@gmail.com', password: "1Aa#@bB" })
            .then((response) => __awaiter(void 0, void 0, void 0, function* () {
            expect(response.body.status).toBe(statusMessages_1.SUCCESS_MSG);
            expect(response.body.data.user.name).toBe('nehe');
            expect(response.body.data.token).toBeTruthy();
            yield authService_1.default.deleteUser(response.body.data.user.id);
        }));
        expect(signUpSpy).toHaveBeenCalledTimes(1);
        expect(deleteUserSpy).toHaveBeenCalledTimes(1);
        done();
    }));
    test('Should not sign up user with invalid email', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const signUpSpy = jest.spyOn(authService_1.default, 'signUp');
        yield supertest_1.default(app_1.default)
            .post(`${rawTestData_1.base_url}/users/signup`)
            .send({ name: "nehe", email: 'nehemgmail.com', password: "1Aa#@bB" })
            .then((response) => __awaiter(void 0, void 0, void 0, function* () {
            expect(response.body.statusCode).toBe(statusCodes_1.BAD_REQUEST);
            expect(response.body.message).toBe(errorMessages_1.INVALID_EMAIL);
        }));
        expect(signUpSpy).toHaveBeenCalledTimes(0);
        done();
    }));
    test('Should not sign up user with short password', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const signUpSpy = jest.spyOn(authService_1.default, 'signUp');
        yield supertest_1.default(app_1.default)
            .post(`${rawTestData_1.base_url}/users/signup`)
            .send({ name: "nehe", email: 'ne@gmail.com', password: "1dd" })
            .then((response) => __awaiter(void 0, void 0, void 0, function* () {
            expect(response.body.statusCode).toBe(statusCodes_1.BAD_REQUEST);
            expect(response.body.message).toBe(errorMessages_1.SHORT_PASSWORD);
        }));
        expect(signUpSpy).toHaveBeenCalledTimes(0);
        done();
    }));
    test('Should not sign up user with weak password', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const signUpSpy = jest.spyOn(authService_1.default, 'signUp');
        yield supertest_1.default(app_1.default)
            .post(`${rawTestData_1.base_url}/users/signup`)
            .send({ name: "nehe", email: 'e@gmail.com', password: "1dd1111111" })
            .then((response) => __awaiter(void 0, void 0, void 0, function* () {
            expect(response.body.statusCode).toBe(statusCodes_1.BAD_REQUEST);
            expect(response.body.message).toBe(errorMessages_1.WEAK_PASSWORD);
        }));
        expect(signUpSpy).toHaveBeenCalledTimes(0);
        done();
    }));
    test('Should not sign up user if any required field is missing', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const signUpSpy = jest.spyOn(authService_1.default, 'signUp');
        yield supertest_1.default(app_1.default)
            .post(`${rawTestData_1.base_url}/users/signup`)
            .send({ email: 'nehe@gmail.com', password: "1Aa#@bB" })
            .then((response) => __awaiter(void 0, void 0, void 0, function* () {
            expect(response.body.message).toBe(errorMessages_1.SIGN_UP_ERR_MSG);
            expect(response.body.statusCode).toBe(statusCodes_1.INTERNAL_SERVER_ERROR);
        }));
        expect(signUpSpy).toHaveBeenCalledTimes(0);
        done();
    }));
    test('Should not sign up user if any required field is empty', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const signUpSpy = jest.spyOn(authService_1.default, 'signUp');
        yield supertest_1.default(app_1.default)
            .post(`${rawTestData_1.base_url}/users/signup`)
            .send({ name: '', email: 'nehe@gmail.com', password: "" })
            .then((response) => __awaiter(void 0, void 0, void 0, function* () {
            expect(response.body.message).toBe(errorMessages_1.NO_EMPTY_FIELD);
            expect(response.body.statusCode).toBe(statusCodes_1.BAD_REQUEST);
        }));
        expect(signUpSpy).toHaveBeenCalledTimes(0);
        done();
    }));
    test('Should not sign up user if user with email exists', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const signUpSpy = jest.spyOn(authService_1.default, 'signUp');
        const deleteUserSpy = jest.spyOn(authService_1.default, 'deleteUser');
        const testUser = yield authService_1.default.signUp("nehe", 'nehe@gmail.com', "1Aa#@bB", authStrategy_1.EMAIL_PASSWORD);
        yield supertest_1.default(app_1.default)
            .post(`${rawTestData_1.base_url}/users/signup`)
            .send({ name: "nehe", email: 'nehe@gmail.com', password: "1Aa#@bB" })
            .then((response) => __awaiter(void 0, void 0, void 0, function* () {
            expect(response.body.message).toBe(errorMessages_1.USER_WITH_EMAIL_EXISTS_MSG);
            expect(response.body.statusCode).toBe(statusCodes_1.BAD_REQUEST);
        }));
        yield authService_1.default.deleteUser(testUser._id);
        expect(signUpSpy).toHaveBeenCalledTimes(1);
        expect(deleteUserSpy).toHaveBeenCalledTimes(1);
        done();
    }));
});
describe('Sign in', () => {
    test('Should sign in user', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const findUserByEmailSpy = jest.spyOn(authService_1.default, 'findUserByEmail');
        const deleteUserSpy = jest.spyOn(authService_1.default, 'deleteUser');
        const testUser = yield authService_1.default.signUp("nehe", 'nehe@gmail.com', "1Aa#@bB", authStrategy_1.EMAIL_PASSWORD);
        yield supertest_1.default(app_1.default)
            .post(`${rawTestData_1.base_url}/users/signin`)
            .send({ email: 'nehe@gmail.com', password: "1Aa#@bB" })
            .then((response) => __awaiter(void 0, void 0, void 0, function* () {
            expect(response.body.status).toBe(statusMessages_1.SUCCESS_MSG);
            expect(response.body.data.user.name).toBe('nehe');
            expect(response.body.data.token).toBeTruthy();
        }));
        yield authService_1.default.deleteUser(testUser._id);
        expect(findUserByEmailSpy).toHaveBeenCalledTimes(1);
        expect(deleteUserSpy).toHaveBeenCalledTimes(1);
        done();
    }));
    test('Should not sign in user if user does not exist by email', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const findUserByEmailSpy = jest.spyOn(authService_1.default, 'findUserByEmail');
        yield supertest_1.default(app_1.default)
            .post(`${rawTestData_1.base_url}/users/signin`)
            .send({ email: 'nehe@gmail.com', password: "1Aa#@bB" })
            .then((response) => __awaiter(void 0, void 0, void 0, function* () {
            expect(response.body.message).toBe(errorMessages_1.INVALID_CREDENTIALS);
        }));
        expect(findUserByEmailSpy).toHaveBeenCalledTimes(1);
        done();
    }));
    test('Should not sign in user with wrong password', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const findUserByEmailSpy = jest.spyOn(authService_1.default, 'findUserByEmail');
        const deleteUserSpy = jest.spyOn(authService_1.default, 'deleteUser');
        const testUser = yield authService_1.default.signUp("nehe", 'testg@gmail.com', "1Aa#@bB", authStrategy_1.EMAIL_PASSWORD);
        yield supertest_1.default(app_1.default)
            .post(`${rawTestData_1.base_url}/users/signin`)
            .send({ email: 'nehe@gmail.com', password: "false password word" })
            .then((response) => __awaiter(void 0, void 0, void 0, function* () {
            expect(response.body.message).toBe(errorMessages_1.INVALID_CREDENTIALS);
            expect(response.body.statusCode).toBe(statusCodes_1.UNAUTHORISED);
        }));
        yield authService_1.default.deleteUser(testUser._id);
        expect(findUserByEmailSpy).toHaveBeenCalledTimes(1);
        expect(deleteUserSpy).toHaveBeenCalledTimes(1);
        done();
    }));
    test('Should not sign in user if any required field is empty', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .post(`${rawTestData_1.base_url}/users/signin`)
            .send({ name: '', email: 'real@gmail.com', password: "" })
            .then((response) => __awaiter(void 0, void 0, void 0, function* () {
            expect(response.body.message).toBe(errorMessages_1.NO_EMPTY_FIELD);
            expect(response.body.statusCode).toBe(statusCodes_1.BAD_REQUEST);
        }));
        done();
    }));
    test('Should not sign up user if any required field is missing', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .post(`${rawTestData_1.base_url}/users/signin`)
            .send({ password: "1Aa#@bB" })
            .then((response) => __awaiter(void 0, void 0, void 0, function* () {
            expect(response.body.message).toBe(errorMessages_1.SIGN_IN_ERR_MSG);
            expect(response.body.statusCode).toBe(statusCodes_1.INTERNAL_SERVER_ERROR);
        }));
        done();
    }));
});
describe('Delete user', () => {
    test('Should not delete user if jwt not found', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .delete(`${rawTestData_1.base_url}/users/delete/user-id`)
            .then((response) => {
            expect(response.body.message).toBe(errorMessages_1.JWT_TOKEN_NOT_FOUND);
        });
        done();
    }));
    test('Should not delete user if user is not an admin', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .delete(`${rawTestData_1.base_url}/users/delete/user-id`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_user_jwt}`)
            .then((response) => {
            expect(response.body.message).toBe(errorMessages_1.ROLE_NOT_ALLOWED);
        });
        done();
    }));
    test('Should not delete user if id is has a wrong format', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .delete(`${rawTestData_1.base_url}/users/delete/user-id`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_admin_jwt}`)
            .then((response) => {
            expect(response.body.message).toBe(errorMessages_1.BAD_FORMAT_ID);
        });
        done();
    }));
});
describe('Update name', () => {
    test('Should not update name if jwt not found', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .patch(`${rawTestData_1.base_url}/users/updatename/user-id`)
            .then((response) => {
            expect(response.body.message).toBe(errorMessages_1.JWT_TOKEN_NOT_FOUND);
        });
        done();
    }));
    test('Should not update name if id got bad format', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .patch(`${rawTestData_1.base_url}/users/updatename/user-id`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_user_jwt}`)
            .then((response) => {
            expect(response.body.message).toBe(errorMessages_1.BAD_FORMAT_ID);
        });
        done();
    }));
    test('Should not update name if user not found', (done) => __awaiter(void 0, void 0, void 0, function* () {
        yield supertest_1.default(app_1.default)
            .patch(`${rawTestData_1.base_url}/users/updatename/5fc699273d00090f84062923`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_admin_jwt}`)
            .then((response) => {
            expect(response.body.message).toBe(errorMessages_1.USER_WITH_ID_NOT_FOUND);
        });
        done();
    }));
    test('Should not update name if new name not provided', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const testUser = yield authService_1.default.signUp("nehe", 'nehe1@gmail.com', "1Aa#@bB", authStrategy_1.EMAIL_PASSWORD);
        yield supertest_1.default(app_1.default)
            .patch(`${rawTestData_1.base_url}/users/updatename/${testUser._id}`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_admin_jwt}`)
            .send({ name: '' })
            .then((response) => {
            expect(response.body.message).toBe(errorMessages_1.NAME_NOT_FOUND);
        });
        yield authService_1.default.deleteUser(testUser._id);
        done();
    }));
    test('Should update name ', (done) => __awaiter(void 0, void 0, void 0, function* () {
        const testUser = yield authService_1.default.signUp("nehe", 'nehe2@gmail.com', "1Aa#@bB", authStrategy_1.EMAIL_PASSWORD);
        yield supertest_1.default(app_1.default)
            .patch(`${rawTestData_1.base_url}/users/updatename/${testUser._id}`)
            .set('Authorization', `Bearer ${rawTestData_1.valid_admin_jwt}`)
            .send({ name: 'new name' })
            .then((response) => {
            expect(response.body.data.name).toBe("new name");
        });
        yield authService_1.default.deleteUser(testUser._id);
        done();
    }));
});
