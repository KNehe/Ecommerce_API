"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-useless-escape */
const mongoose_1 = __importDefault(require("mongoose"));
class Validators {
    constructor() {
        this.isObjectIdValid = (id) => {
            const ObjectId = mongoose_1.default.Types.ObjectId;
            return ObjectId.isValid(id);
        };
        this.isEmailValid = (email) => {
            // eslint-disable-next-line no-useless-escape
            const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return emailReg.test(String(email).toLowerCase());
        };
        this.isPasswordLong = (password) => password.length < 6 ? false : true;
        this.isPasswordStrong = (password) => {
            const isStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/.test(password);
            return isStrong;
        };
    }
}
exports.default = new Validators();
