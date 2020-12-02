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
const statusCodes_1 = require("../utils/statusCodes");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const errorMessages_1 = require("../utils/errorMessages");
const appError_1 = __importDefault(require("./../utils/appError"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './../../.env' });
const cloudinary_1 = __importDefault(require("cloudinary"));
class UploadService {
    constructor() {
        this.cloudinaryInstance = cloudinary_1.default.v2;
        this.storage = multer_1.default.diskStorage({
            destination: (req, file, cb) => {
                cb(null, `${__dirname}./../uploads`);
            },
            filename: (req, file, cb) => {
                cb(null, file.fieldname + '_' + Date.now() + '.jpg');
            }
        });
        this.maxSize = 1 * 1000 * 1000;
        this.writeToFolder = multer_1.default({
            storage: this.storage,
            limits: { fileSize: this.maxSize },
            fileFilter: (req, file, cb) => {
                const fileTypes = /jpeg|jpg|png|mkv/;
                const mimetype = fileTypes.test(file.mimetype);
                const extName = fileTypes.test(path_1.default.extname(file.originalname).toLocaleLowerCase());
                if (mimetype && extName) {
                    return cb(null, true);
                }
                else {
                    cb(new appError_1.default(errorMessages_1.WRONG_IMG_MIME, statusCodes_1.BAD_REQUEST));
                }
            }
        }).single('image');
        this.uploadToCloud = (pathToFile) => __awaiter(this, void 0, void 0, function* () {
            const uploadResult = yield this.cloudinaryInstance.uploader.upload(pathToFile, { tags: 'logo', folder: 'ecommerce_app_images', use_filename: true }, function (err) {
                if (err)
                    return new appError_1.default(errorMessages_1.IMAGE_UPLOAD_ERROR, statusCodes_1.INTERNAL_SERVER_ERROR);
            });
            const { url } = uploadResult;
            return url;
        });
        this.cloudinaryInstance.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    }
}
exports.default = new UploadService();
