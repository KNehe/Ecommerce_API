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
const nodemailer_1 = __importDefault(require("nodemailer"));
const appError_1 = __importDefault(require("../utils/appError"));
const errorMessages_1 = require("../utils/errorMessages");
const statusCodes_1 = require("../utils/statusCodes");
class MailService {
    constructor() {
        this.sendEmail = (to, message, subject) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const transporter = nodemailer_1.default.createTransport({
                    service: 'gmail',
                    port: process.env.EMAIL_PORT,
                    secure: true,
                    auth: {
                        user: process.env.EMAIL_AUTH_USERNAME,
                        pass: process.env.EMAIL_AUTH_PASSWORD,
                    },
                });
                const mailOptions = {
                    from: process.env.EMAIL_FROM,
                    to,
                    subject,
                    html: message,
                };
                // eslint-disable-next-line no-unused-vars
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                transporter.sendMail(mailOptions, (err, data) => {
                    if (err) {
                        // eslint-disable-next-line prefer-promise-reject-errors
                        reject(err);
                    }
                    resolve(true);
                });
            }).catch(function (error) {
                console.log("NODE MAILER ERROR", error);
                return new appError_1.default(errorMessages_1.SEND_EMAIL_ERROR, statusCodes_1.INTERNAL_SERVER_ERROR);
            });
        });
    }
}
exports.default = new MailService();
