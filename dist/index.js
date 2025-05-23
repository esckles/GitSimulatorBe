"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const dbConfig_1 = require("./utils/dbConfig");
const mainApp_1 = require("./mainApp");
dotenv_1.default.config();
const corsOption = {
  origin: ["http://localhost:5173", "https://gitsimulator-fe.web.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsOption));
(0, mainApp_1.mainApp)(app);
app.listen(process.env.PORT, () => {
  (0, dbConfig_1.dbConfig)();
});
