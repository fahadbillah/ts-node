import { NextFunction, Request, Response, Router } from "express";
import * as mongoose from "mongoose";
import * as url from "url";
import Profiler from "../middlewares/profilerSystem";
import UserService from "../middlewares/userService";
import User from "../models/User";

class UserRouter {
  public router: Router;

  constructor() {
    this.router = Router();
  }

  public getUser(req: Request, res: Response, next: NextFunction): void {
    const singleUser: any = UserService.readSingleUser({_id: req.params.id});
    singleUser.then((user: any) => {
      res.json({
        data: user,
        success: true,
      });
    });
    // test
  }

  public getUsers(req: Request, res: Response, next: NextFunction): void {
    const urlParts = url.parse(req.url, true);
    const query = urlParts.query;
    // console.log(query);
    const userLst: any = UserService.readMultipleUser({
        accountStatus: "deactivated",
    } , 0, 1);
    userLst.then((users: any) => {
      res.json({
        data: users,
        profiler: Profiler.endProfiling(),
        success: true,
      });
    });
  }

  public setUser(req: Request, res: Response, next: NextFunction): void {
    const createdUser = UserService.createUser(req.body);
    res.json({
      data: createdUser,
      message: "New user created!",
      success: true,
    });
  }

  public updateUser(req: Request, res: Response, next: NextFunction): void {
    if (this.modifyUser(req.body.params.id, req.body)) {
      res.json({success: true, message: "User updated!", data: req.body});
    } else {
      res.json({success: false, message: "User update failed!"});
    }
  }

  public removeUser(req: Request, res: Response, next: NextFunction): void {
    // console.log(req);
    // res.json(req.params.id);
    User.findByIdAndUpdate(req.params.id, {
      $set: {
        accountStatus: "deactivated",
      },
    }, { new: true }, (err, removedUser) => {
      if (err) {
        return e(err);
      }
      res.json(removedUser);
    });
  }

  public routes() {
    this.router.get("/:id", this.getUser);
    this.router.get("/", this.getUsers);
    this.router.post("/", this.setUser);
    this.router.put("/:id", this.updateUser);
    this.router.delete("/:id", this.removeUser);
  }

  protected modifyUser(userId: string, newData: object ): boolean {
    return true;
  }
}

const userRoutes = new UserRouter();
userRoutes.routes();

export default userRoutes.router;
