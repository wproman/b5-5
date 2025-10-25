"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import morgan from 'morgan';
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
require("./config/passport");
const globalErrorHandler_1 = require("./middleware/globalErrorHandler");
const notFound_1 = __importDefault(require("./middleware/notFound"));
const routes_1 = require("./routes");
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'fallback_secret_change_in_production',
    resave: false,
    saveUninitialized: false
}));
app.use((0, express_session_1.default)({
    secret: process.env.XPRESS_SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: [
        'https://ride-app-gamma.vercel.app',
        'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use("/api/v1", routes_1.router);
// Sample Route
app.get("/", (_req, res) => {
    res.json({ message: "API Working with MongoDB 🚀" });
});
// Global Error Handler
app.use(globalErrorHandler_1.globalErrorHandler);
// 404 Not Found
app.use(notFound_1.default);
// Export the app for use in server.ts
exports.default = app;
