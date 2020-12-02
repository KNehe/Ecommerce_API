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
const user_1 = __importDefault(require("./../models/user"));
class AuthService {
    constructor() {
        this.signUp = (name, email, password, strategy) => __awaiter(this, void 0, void 0, function* () {
            return yield user_1.default.create({ name, email, password, strategy });
        });
        this.findUserByEmail = (email) => __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.default.findOne({ email });
            if (!user)
                return null;
            return user;
        });
        this.deleteUser = (id) => __awaiter(this, void 0, void 0, function* () {
            return yield user_1.default.findByIdAndDelete(id);
        });
        this.findUserById = (id) => __awaiter(this, void 0, void 0, function* () {
            return yield user_1.default.findById(id);
        });
        this.updateName = (userId, name) => __awaiter(this, void 0, void 0, function* () {
            return yield user_1.default.findByIdAndUpdate(userId, { $set: { name } }, { new: true, useFindAndModify: false });
        });
        this.findUserByResetToken = (resetToken) => __awaiter(this, void 0, void 0, function* () {
            return yield user_1.default.findOne({ passwordResetToken: resetToken });
        });
        this.createFaceBookOrGoogleUser = (email, name, strategy) => __awaiter(this, void 0, void 0, function* () {
            return yield user_1.default.create({ email, name, strategy, password: "User doesn't require password" });
        });
        this.updateEmail = (userId, email) => __awaiter(this, void 0, void 0, function* () {
            return yield user_1.default.findByIdAndUpdate(userId, { $set: { email } }, { new: true, useFindAndModify: false });
        });
    }
}
exports.default = new AuthService();
