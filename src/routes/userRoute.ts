import { NextFunction, Request, Response, Router } from "express";
import * as mongoose from "mongoose";
import User from "../models/User";

class UserRouter {
  public router: Router;

  constructor() {
    this.router = Router();
  }

  public getUser(req: Request, res: Response, next: NextFunction): void {
    User
    .aggregate([
      {
        $match: {$and: [{ _id: mongoose.Types.ObjectId(req.params.id) }, { accountStatus: "deactivated" }]},
        // count: {$sum: 1},
      },
      {$group: {_id: {
        accountStatus: "$accountStatus",
        userName: "$userName",
      }, count: {$sum: 1}}},
    ])
    .exec((err, singleUser) => {
      if (err) {
        return next(err);
      }
      if (singleUser.length > 0) {
        res.json({
          data: singleUser,
          message: "User found!",
          success: true,
        });
      } else {
        res.json({
          message: "No user found with this id",
          success: false,
        });
      }
    });
  }

  public getUsers(req: Request, res: Response, next: NextFunction): void {
    User
    .find({
      accountStatus: "not_yet_active",
    })
    .exec((err, userList) => {
      if (err) {
        return next(err);
      }
      res.json(userList);
    });
  }

  public setUser(req: Request, res: Response, next: NextFunction): void {
    const user = new User(req.body);
    user.save((err, createdUser) => {
      if (err) {
        return next(err);
      }
      res.send({
        success: true,
        userData: createdUser,
      });
    });
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
        return next(err);
      }
      res.json(removedUser);
    });
  }

  public routes() {
    this.router.get("/:id", this.getUser);
    this.router.get("/", this.getUsers);
    this.router.post("/", this.setUser);
    this.router.delete("/:id", this.removeUser);
  }
}

const userRoutes = new UserRouter();
userRoutes.routes();

export default userRoutes.router;
