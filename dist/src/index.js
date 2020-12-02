"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
process.on("uncaughtException", err => {
    console.log("Uncaught exception shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
});
dotenv_1.default.config({ path: '.env' });
const app_1 = __importDefault(require("./app"));
const DB = process.env.DATABASE || '';
mongoose_1.default.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
})
    .then(() => {
    console.log("⚡️ DB connection successfull...");
});
const PORT = Number(process.env.PORT || 3000);
const server = app_1.default.listen(PORT, () => {
    console.log(`⚡️[Server]: is running at https://localhost:${PORT}`);
});
process.on('unhandledRejection', err => {
    console.log("Unhanlded rejection shutting down ...", err);
    server.close(() => {
        process.exit(1);
    });
});
