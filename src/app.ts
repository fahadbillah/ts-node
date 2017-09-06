import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as cors from "cors";
import * as express from "express";
import { NextFunction, Request, Response, ErrorRequestHandler } from "express";
import * as mongoose from "mongoose";
import * as logger from "morgan";
import * as path from "path";

import Profiler from "./middlewares/profilerSystem";
import IError from "./interfaces/IError";
import UserRouter from "./routes/userRoute";

class Portal {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  public config(): void {
    // db connection
    const MONGO_URI = "mongodb://localhost:27017/tstest";
    mongoose.connect(MONGO_URI, (err) => {
      if (err) {
        console.log("connection error occurred!");
      }
      console.log("connection successful!");
    });

    // other config
    this.app.set("views", path.join(__dirname, "../views"));
    this.app.set("view engine", "jade");
    this.app.use( bodyParser.urlencoded({extended: false}) );
    this.app.use( bodyParser.json() );
    this.app.use( logger("dev") );
    this.app.use(compression());
    this.app.use(cors());
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      // console.log("testing");
      Profiler.startProfiling();
      return next();
    });
  }

  public routes(): void {
    this.app.use("/", (req, res) => {
      res.render("index");
    });
    this.app.use("/user", UserRouter);
    // this.pageNotFound();
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      console.log("testinggg");
      let err: IError = {
        type: new Error("Page not found"),
        status: 404,
        message: "Page not found!",
      };
      next(err);
    });
    this.errorHandler();
  }

  public pageNotFound (): void {
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      console.log("testinggg");
      let err: IError = {
        type: new Error("Page not found"),
        status: 404,
        message: "Page not found!",
      };
      next(err);
    });
  }

  public errorHandler (): void {
    this.app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
      res.send(err);
    });
  }
}

export default new Portal().app;
