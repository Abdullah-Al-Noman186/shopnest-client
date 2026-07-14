"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = require("./config/db");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const wishlist_routes_1 = __importDefault(require("./routes/wishlist.routes"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/products", product_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/wishlist", wishlist_routes_1.default);
app.use("/api/cart", cart_routes_1.default);
app.use("/api/orders", order_routes_1.default);
// Health check
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", message: "ShopNest API is running." });
});
// Error handler
app.use(error_middleware_1.errorHandler);
// Start
(0, db_1.connectDB)().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
