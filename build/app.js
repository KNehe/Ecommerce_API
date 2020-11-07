"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const app = express_1.default();
app.use(express_1.default.json());
if (process.env.NODE_ENV === "development") {
    app.use(morgan_1.default('dev'));
}
app.get('/', (req, res) => res.send('Welcome to Nehemiah\'s Ecommerce API built using Express + TypeScript + MongoDB'));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
    return res.status(400).json({
        error: err.message,
    });
});
exports.default = app;
