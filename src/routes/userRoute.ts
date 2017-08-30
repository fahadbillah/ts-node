import { Router, Request, Response, NextFunction } from 'express'
import User from '../models/User';

class UserRouter {
  router: Router;

  constructor() {
    this.router = Router();
  }

  public getUser(req: Request, res: Response, next: NextFunction): void{
    res.json({
      message: 'User 2 info!'
    })
  }

  public getUsers(req: Request, res: Response, next: NextFunction): void{
    User
    .find()
    .exec(function(err, userList) {
      if (err) return next(err);
      res.json(userList)
    })
  }

  public setUser(req: Request, res: Response, next: NextFunction): void{
    const user = new User(req.body);
    user.save(function (err, createdUser) {
      if (err) return next(err);
      res.send({
        success: true,
        userData: createdUser
      });
    });
  }

  public removeUser(req: Request, res: Response, next: NextFunction): void{
    User.findByIdAndUpdate(id, { $set: { size: 'large' }}, { new: true }, function (err, tank) {
      if (err) return handleError(err);
      res.send(tank);
    });
  }

  routes(){
    this.router.get('/:id', this.getUser);
    this.router.get('/', this.getUsers);
    this.router.post('/', this.setUser);
  }
}

const userRoutes = new UserRouter();
userRoutes.routes()

export default userRoutes.router;
