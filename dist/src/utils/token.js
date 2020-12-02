"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appError_1 = __importDefault(require("./appError"));
const statusCodes_1 = require("./statusCodes");
const errorMessages_1 = require("./errorMessages");
class TokenUtils {
    constructor() {
        this.createJwt = (id) => {
            const secret = process.env.JWT_SECRET;
            const jwtExpiryTime = process.env.JWT_EXPIRY_TIME;
            if (!secret) {
                throw new appError_1.default(errorMessages_1.NO_JWT_SECRET_MSG, statusCodes_1.INTERNAL_SERVER_ERROR);
            }
            if (!jwtExpiryTime) {
                throw new appError_1.default(errorMessages_1.NO_JWT_EXPIRY_TIME_MSG, statusCodes_1.INTERNAL_SERVER_ERROR);
            }
            return jsonwebtoken_1.default.sign({ id: id }, secret, { expiresIn: jwtExpiryTime });
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.decodeJwt = (token) => {
            try {
                const secret = process.env.JWT_SECRET;
                if (!secret) {
                    throw new appError_1.default(errorMessages_1.NO_JWT_SECRET_MSG, statusCodes_1.INTERNAL_SERVER_ERROR);
                }
                return jsonwebtoken_1.default.verify(token, secret);
            }
            catch (error) {
                return { error };
            }
        };
    }
}
exports.default = new TokenUtils();
