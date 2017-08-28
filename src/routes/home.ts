import { Request, Response, NextFunction } from 'express'
import express = require('express');

class Home{
  public homeRoutes: any;
  constructor(){
    this.express = express()
    this.mountRoutes()
  }

  private mountRoutes (): void {
    const router = express.Router()
    console.log('testing')
    router.get('/', (req, res) => {
      res.json({
        message: 'home index'
      })
    })
    this.express.use('/', router)
  }

  private wow (req: Request, res: Response, next: NextFunction): void {
    // cosnole.log()
    // return 'test';
    res.json({
      message: 'home index'
    })
  }
}

// var home = new Home()


// router.get('/', home.index);

// export default router;
export default new Home();
