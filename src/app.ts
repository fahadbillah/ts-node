import { Application, Request, Response, NextFunction } from 'express'
import express = require('express')
import bodyParser = require("body-parser");
// import { bodyParser } from '@types/body-parser'

// var response = express.request
// class App {
//   public application: Application;
  
//   constructor() {
//     this.express = express()
//     this.mountRoutes()
//   }

//   private mountRoutes (): void {
//     const router = express.Router()
//     router.get('/', (request, response) => {
//       response.json({
//         message: 'Hello World!'
//       })
//     })
//     this.express.use('/', router)

//     // this.express.use((req, res, next) => {

//     // })
//   }
// }

var app: Application = express()

app.use( bodyParser.urlencoded({extended: false}) )

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Hello World!'
  })
})

app.get('/test', (req: Request, res: Response) => {
  res.json({
    message: 'Hello World from test!'
  })
})

app.use((req: Request, res: Response, next: NextFunction) => {
  var err = new Error('Not Found');
  next({
    message: 'Not Found',
    status: 404,
    error: err
  });
})


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  res.json(err)
})



export default app;
