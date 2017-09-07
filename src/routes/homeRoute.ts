import { NextFunction, Request, Response, Router } from "express";
import Profiler from "../middlewares/profilerSystem";

class HomeRouter {
  public router: Router;

  constructor() {
    this.router = Router();
  }

  public getHome(req: Request, res: Response, next: NextFunction): void {
      res.render("index");
  }

  public routes() {
    this.router.get("/", this.getHome);
  }
}

const homeRouter = new HomeRouter();
homeRouter.routes();

export default homeRouter.router;
