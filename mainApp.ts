import { Application, Request, Response } from "express";
import morgan from "morgan";
import router from "./router/router";

export const mainApp = async (app: Application) => {
  app.use(morgan("dev"));
  app.use("/api_v1", router);
  try {
    app.get("/", (req: Request, res: Response) => {
      res.status(200).json({ message: "Welcome to default API", status: 200 });
    });
  } catch (error) {
    return error;
  }
};
