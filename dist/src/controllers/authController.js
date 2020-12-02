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
const statusCodes_1 = require("./../utils/statusCodes");
const statusMessages_1 = require("./../utils/statusMessages");
const appError_1 = __importDefault(require("./../utils/appError"));
const errorMessages_1 = require("./../utils/errorMessages");
const authService_1 = __importDefault(require("./../services/authService"));
const token_1 = __importDefault(require("./../utils/token"));
const password_1 = __importDefault(require("./../utils/password"));
const validators_1 = __importDefault(require("../utils/validators"));
const successMessages_1 = require("../utils/successMessages");
const mailService_1 = __importDefault(require("./../services/mailService"));
const authStrategy_1 = require("../utils/authStrategy");
class AuthController {
    constructor() {
        this.signUp = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password } = req.body;
                if (!name.trim() || !email.trim() || !password)
                    return next(new appError_1.default(errorMessages_1.NO_EMPTY_FIELD, statusCodes_1.BAD_REQUEST));
                if (!validators_1.default.isEmailValid(email))
                    return next(new appError_1.default(errorMessages_1.INVALID_EMAIL, statusCodes_1.BAD_REQUEST));
                if (!validators_1.default.isPasswordLong(password))
                    return next(new appError_1.default(errorMessages_1.SHORT_PASSWORD, statusCodes_1.BAD_REQUEST));
                if (!validators_1.default.isPasswordStrong(password))
                    return next(new appError_1.default(errorMessages_1.WEAK_PASSWORD, statusCodes_1.BAD_REQUEST));
                if ((yield authService_1.default.findUserByEmail(email)) != null)
                    return next(new appError_1.default(errorMessages_1.USER_WITH_EMAIL_EXISTS_MSG, statusCodes_1.BAD_REQUEST));
                const newUser = yield authService_1.default.signUp(name, email, password, authStrategy_1.EMAIL_PASSWORD);
                const token = token_1.default.createJwt(newUser._id);
                yield mailService_1.default.sendEmail(email, successMessages_1.SIGN_UP_THANK_YOU, successMessages_1.SIGN_UP_THANK_YOU_SUBJECT);
                res.status(statusCodes_1.CREATED).json({
                    status: statusMessages_1.SUCCESS_MSG,
                    data: {
                        token,
                        user: {
                            id: newUser._id,
                            name: newUser.name,
                            email: newUser.email,
                            role: newUser.role,
                            createdAt: newUser.createdAt
                        }
                    }
                });
            }
            catch (e) {
                console.log(e.message);
                return next(new appError_1.default(errorMessages_1.SIGN_UP_ERR_MSG, statusCodes_1.INTERNAL_SERVER_ERROR));
            }
        });
        this.signIn = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email.trim() || !password)
                    return next(new appError_1.default(errorMessages_1.NO_EMPTY_FIELD, statusCodes_1.BAD_REQUEST));
                const user = yield authService_1.default.findUserByEmail(email);
                if (!user || !(yield password_1.default.correctPassword(password, user.password)))
                    return next(new appError_1.default(errorMessages_1.INVALID_CREDENTIALS, statusCodes_1.UNAUTHORISED));
                const token = token_1.default.createJwt(user._id);
                res.status(statusCodes_1.SUCCESS).json({
                    status: statusMessages_1.SUCCESS_MSG,
                    data: {
                        token,
                        user: {
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                        }
                    }
                });
            }
            catch (e) {
                console.log(e.message);
                return next(new appError_1.default(errorMessages_1.SIGN_IN_ERR_MSG, statusCodes_1.INTERNAL_SERVER_ERROR));
            }
        });
        this.deleteUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id.trim();
                if (!validators_1.default.isObjectIdValid(id))
                    return next(new appError_1.default(errorMessages_1.BAD_FORMAT_ID, statusCodes_1.BAD_REQUEST));
                if (!(yield authService_1.default.findUserById(id)))
                    return next(new appError_1.default(errorMessages_1.USER_WITH_ID_NOT_FOUND, statusCodes_1.BAD_REQUEST));
                yield authService_1.default.deleteUser(id);
                res.status(statusCodes_1.NO_CONTENT).json({
                    status: statusCodes_1.SUCCESS,
                    data: null
                });
            }
            catch (e) {
                console.log(e.message);
                return next(new appError_1.default(errorMessages_1.DELETE_USER_MSG, statusCodes_1.INTERNAL_SERVER_ERROR));
            }
        });
        this.updateName = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id.trim();
                if (!validators_1.default.isObjectIdValid(id))
                    return next(new appError_1.default(errorMessages_1.BAD_FORMAT_ID, statusCodes_1.BAD_REQUEST));
                if (!(yield authService_1.default.findUserById(id)))
                    return next(new appError_1.default(errorMessages_1.USER_WITH_ID_NOT_FOUND, statusCodes_1.BAD_REQUEST));
                const { name } = req.body;
                if (!(name === null || name === void 0 ? void 0 : name.trim()))
                    return next(new appError_1.default(errorMessages_1.NAME_NOT_FOUND, statusCodes_1.BAD_REQUEST));
                const updatedUser = yield authService_1.default.updateName(id, name);
                res.status(statusCodes_1.SUCCESS).json({
                    status: statusMessages_1.SUCCESS_MSG,
                    data: {
                        id: updatedUser._id,
                        name: updatedUser.name,
                        email: updatedUser.email,
                        role: updatedUser.role
                    }
                });
            }
            catch (e) {
                console.log(e.message);
                return next(new appError_1.default(errorMessages_1.UPDATE_USER_ERR_MSG, statusCodes_1.INTERNAL_SERVER_ERROR));
            }
        });
        this.forgotPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                if (!(email === null || email === void 0 ? void 0 : email.trim()))
                    return next(new appError_1.default(errorMessages_1.EMAIL_REQUIRED, statusCodes_1.BAD_REQUEST));
                const user = yield authService_1.default.findUserByEmail(email);
                if (!user)
                    return next(new appError_1.default(errorMessages_1.USER_WITH_EMAIL_NOT_EXISTS, statusCodes_1.BAD_REQUEST));
                const resetToken = user.createPasswordResetToken();
                yield user.save({ validateBeforeSave: false });
                const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`;
                const message = `Forgot your password? Click to reset password ${resetUrl} . If you dint forget password please ignore this email`;
                yield mailService_1.default.sendEmail(email, message, successMessages_1.RESET_PASSWORD_SUBJECT);
                res.status(statusCodes_1.SUCCESS).json({
                    status: statusMessages_1.SUCCESS_MSG,
                    message: successMessages_1.RESET_PASSWORD_REQUEST_MSG
                });
            }
            catch (e) {
                console.log(e.message);
                return next(new appError_1.default(errorMessages_1.SEND_RESET_PASSWORD_EMAIL_ERR, statusCodes_1.INTERNAL_SERVER_ERROR));
            }
        });
        this.resetPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { password } = req.body;
                const resetToken = req.params.resetToken;
                if (!(password === null || password === void 0 ? void 0 : password.trim()))
                    return next(new appError_1.default(errorMessages_1.PASSWORD_REQUIRED_FOR_RESET, statusCodes_1.BAD_REQUEST));
                if (!(resetToken === null || resetToken === void 0 ? void 0 : resetToken.trim()))
                    return next(new appError_1.default(errorMessages_1.PASSWORD_RESET_TOKEN_REQUIRED, statusCodes_1.BAD_REQUEST));
                const user = yield authService_1.default.findUserByResetToken(resetToken);
                if (!user)
                    return next(new appError_1.default(errorMessages_1.PASSWORD_RESET_TOKEN_INVALID, statusCodes_1.BAD_REQUEST));
                if (new Date() > user.passwordResetExpires)
                    return next(new appError_1.default(errorMessages_1.PASSWORD_RESET_TOKEN_EXPIRED, statusCodes_1.BAD_REQUEST));
                user.password = password;
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;
                yield user.save({ validateBeforeSave: false });
                res.status(statusCodes_1.SUCCESS).json({
                    status: statusMessages_1.SUCCESS_MSG,
                    message: successMessages_1.PASSWORD_RESET_SUCCESSFULLY_MSG
                });
            }
            catch (e) {
                console.log(e.message);
                return next(new appError_1.default(errorMessages_1.RESET_PASSWORD_ERR, statusCodes_1.INTERNAL_SERVER_ERROR));
            }
        });
        this.facebookAuth = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                req.currentUser = req.user;
                const token = token_1.default.createJwt(req.currentUser._id);
                res.status(statusCodes_1.SUCCESS).json({
                    status: statusMessages_1.SUCCESS_MSG,
                    data: {
                        token,
                        user: {
                            id: req.currentUser._id,
                            name: req.currentUser.name,
                            email: req.currentUser.email,
                            role: req.currentUser.role
                        }
                    }
                });
            }
            catch (e) {
                console.log(e.message);
                return next(new appError_1.default(errorMessages_1.SIGN_IN_ERR_MSG, statusCodes_1.INTERNAL_SERVER_ERROR));
            }
        });
        this.googleAuth = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                req.currentUser = req.user;
                const token = token_1.default.createJwt(req.currentUser._id);
                res.status(statusCodes_1.SUCCESS).json({
                    status: statusMessages_1.SUCCESS_MSG,
                    data: {
                        token,
                        user: {
                            id: req.currentUser._id,
                            name: req.currentUser.name,
                            email: req.currentUser.email,
                            role: req.currentUser.role,
                        }
                    }
                });
            }
            catch (e) {
                console.log(e.message);
                return next(new appError_1.default(errorMessages_1.SIGN_IN_ERR_MSG, statusCodes_1.INTERNAL_SERVER_ERROR));
            }
        });
        this.protectRoute = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let token;
            if (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
                token = req.headers.authorization.split(' ')[1];
            if (!token)
                return next(new appError_1.default(errorMessages_1.JWT_TOKEN_NOT_FOUND, statusCodes_1.BAD_REQUEST));
            const { id, error } = token_1.default.decodeJwt(token);
            if (error)
                return next(new appError_1.default(errorMessages_1.INVALID_JWT_TOKEN, statusCodes_1.BAD_REQUEST));
            const user = yield authService_1.default.findUserById(id);
            if (!user)
                return next(new appError_1.default(errorMessages_1.USER_ASSOCIATED_WITH_TOKEN_NOT_FOUND, statusCodes_1.UNAUTHORISED));
            req.currentUser = user;
            next();
        });
        this.restrictRoute = (roles) => {
            return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                const userRole = req.currentUser.role || '';
                if (!roles.includes(userRole)) {
                    next(new appError_1.default(errorMessages_1.ROLE_NOT_ALLOWED, statusCodes_1.UNAUTHORISED));
                }
                next();
            });
        };
        this.sendNewOauthUserEMail = (email) => __awaiter(this, void 0, void 0, function* () {
            yield mailService_1.default.sendEmail(email, successMessages_1.SIGN_UP_THANK_YOU, successMessages_1.SIGN_UP_THANK_YOU_SUBJECT);
        });
        this.checkTokenExpiry = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { token } = req.body;
            if (!token)
                return next(new appError_1.default(errorMessages_1.JWT_TOKEN_NOT_FOUND, statusCodes_1.BAD_REQUEST));
            const { error } = token_1.default.decodeJwt(token);
            if (error) {
                res.status(statusCodes_1.UNAUTHORISED).json({
                    status: statusMessages_1.UNAUTHORISED_MSG,
                    message: errorMessages_1.INVALID_JWT_TOKEN
                });
            }
            else {
                res.status(statusCodes_1.SUCCESS).json({
                    status: statusMessages_1.AUTHORISED_MSG,
                    message: statusMessages_1.JWT_IS_VALID
                });
            }
        });
        this.updateEmail = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id.trim();
                if (!validators_1.default.isObjectIdValid(id))
                    return next(new appError_1.default(errorMessages_1.BAD_FORMAT_ID, statusCodes_1.BAD_REQUEST));
                if (!(yield authService_1.default.findUserById(id)))
                    return next(new appError_1.default(errorMessages_1.USER_WITH_ID_NOT_FOUND, statusCodes_1.BAD_REQUEST));
                const { email } = req.body;
                if (!(email === null || email === void 0 ? void 0 : email.trim()))
                    return next(new appError_1.default(errorMessages_1.EMAIL_NOT_FOUND, statusCodes_1.BAD_REQUEST));
                const updatedUser = yield authService_1.default.updateEmail(id, email);
                res.status(statusCodes_1.SUCCESS).json({
                    status: statusMessages_1.SUCCESS_MSG,
                    data: {
                        id: updatedUser._id,
                        name: updatedUser.name,
                        email: updatedUser.email,
                        role: updatedUser.role
                    }
                });
            }
            catch (e) {
                console.log(e.message);
                return next(new appError_1.default(errorMessages_1.UPDATE_USER_ERR_MSG, statusCodes_1.INTERNAL_SERVER_ERROR));
            }
        });
    }
}
exports.default = new AuthController();
