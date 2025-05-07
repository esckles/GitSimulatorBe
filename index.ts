import express, { Application } from "express";
import cors from "cors";
import env from "dotenv";
import { dbConfig } from "./utils/dbConfig";
import { mainApp } from "./mainApp";
env.config();

const corsOption = {
  origin: ["https://gitsimulator-fe.web.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
const app: Application = express();
app.use(express.json());
app.use(cors(corsOption));
mainApp(app);

app.listen(process.env.PORT as string, () => {
  dbConfig();
});
