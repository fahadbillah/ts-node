import { Router, Request, Response, NextFunction } from 'express'
import User from '../models/User';

class UserRouter {
  router: Router;

  constructor() {
    this.router = Router();
  }

  public getUser(req: Request, res: Response): void{
    res.json({
      message: 'User 2 info!'
    })
  }

  public getUsers(req: Request, res: Response): void{
    res.json({
      message: 'All user list!'
    })
  }

  public setUser(req: Request, res: Response): void{
    
  }

  public removeUser(req: Request, res: Response): void{
    
  }

  routes(){
    this.router.get('/:id', this.getUser);
    this.router.get('/', this.getUsers);
  }
}

const userRoutes = new UserRouter();
userRoutes.routes()

export default userRoutes.router;
