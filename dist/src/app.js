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
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const statusCodes_1 = require("./utils/statusCodes");
const cors_1 = __importDefault(require("cors"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const cartOrderRoutes_1 = __importDefault(require("./routes/cartOrderRoutes"));
const passport_facebook_1 = require("passport-facebook");
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = __importDefault(require("dotenv"));
const authService_1 = __importDefault(require("./services/authService"));
const appError_1 = __importDefault(require("./utils/appError"));
const errorMessages_1 = require("./utils/errorMessages");
const authStrategy_1 = require("./utils/authStrategy");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const authController_1 = __importDefault(require("./controllers/authController"));
dotenv_1.default.config();
const app = express_1.default();
app.use(express_1.default.json());
if (process.env.NODE_ENV === "development") {
    app.use(morgan_1.default('dev'));
}
app.use(cors_1.default());
passport_1.default.use(new passport_facebook_1.Strategy({
    clientID: process.env.FACEBOOK_APP_ID || '',
    clientSecret: process.env.FACEBOOK_APP_SECRET || '',
    callbackURL: `${process.env.BASE_URL}api/v1/users/auth/facebook`,
    profileFields: ['id', 'emails', 'name'],
}, (__, _, profile, cb) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userMails = profile != null ? profile.emails : null;
        if (!userMails || (userMails === null || userMails === void 0 ? void 0 : userMails.length) === 0)
            return cb(new appError_1.default(errorMessages_1.FB_EMAIL_REQUIRED, statusCodes_1.BAD_REQUEST), false);
        const user = yield authService_1.default.findUserByEmail(userMails[0].value);
        if (!user) {
            const name = ((_a = profile.name) === null || _a === void 0 ? void 0 : _a.givenName) + " " + ((_b = profile.name) === null || _b === void 0 ? void 0 : _b.familyName);
            const user = yield authService_1.default.createFaceBookOrGoogleUser(userMails[0].value, name, authStrategy_1.FACEBOOK_STRATEGY);
            if (!user)
                return cb(new appError_1.default(errorMessages_1.FB_AUTH_FAILED, statusCodes_1.BAD_REQUEST), false);
            yield authController_1.default.sendNewOauthUserEMail(userMails[0].value);
            return cb(null, user);
        }
        cb(null, user);
    }
    catch (e) {
        console.log(e.message);
        return cb(new appError_1.default(errorMessages_1.FB_AUTH_FAILED, statusCodes_1.BAD_REQUEST), false);
    }
})));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: `${process.env.BASE_URL}api/v1/users/auth/google`
}, (_, __, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    try {
        const userMails = profile != null ? profile.emails : null;
        if (!userMails || (userMails === null || userMails === void 0 ? void 0 : userMails.length) === 0)
            return done(new appError_1.default(errorMessages_1.GOOGLE_EMAIL_REQUIRED, statusCodes_1.BAD_REQUEST), false);
        const user = yield authService_1.default.findUserByEmail(userMails[0].value);
        if (!user) {
            const name = ((_c = profile.name) === null || _c === void 0 ? void 0 : _c.givenName) + " " + ((_d = profile.name) === null || _d === void 0 ? void 0 : _d.familyName);
            const user = yield authService_1.default.createFaceBookOrGoogleUser(userMails[0].value, name, authStrategy_1.GOOGLE_STRATEGY);
            if (!user)
                return done(new appError_1.default(errorMessages_1.GOOGLE_AUTH_FAILED, statusCodes_1.BAD_REQUEST), false);
            yield authController_1.default.sendNewOauthUserEMail(userMails[0].value);
            return done('', user);
        }
        done('', user);
    }
    catch (e) {
        console.log(e.message);
        return done(new appError_1.default(errorMessages_1.GOOGLE_AUTH_FAILED, statusCodes_1.BAD_REQUEST), false);
    }
})));
app.use(passport_1.default.initialize());
app.use("/api/v1/users", userRoutes_1.default);
app.use("/api/v1/products", productRoutes_1.default);
app.use('/api/v1/cart', cartOrderRoutes_1.default);
app.use('/api/v1/categories', categoryRoutes_1.default);
app.all("*", (req, res, next) => {
    res.status(statusCodes_1.NOT_FOUND).send(`${req.originalUrl} not found`);
    next();
});
//global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err, req, res, next) => {
    return res.status(400).json({
        status: err.status,
        message: err.message,
        statusCode: err.statusCode
    });
    next();
});
exports.default = app;
