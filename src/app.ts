import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as compression from 'compression'
import * as cors from 'cors'
import * as logger from 'morgan'
import * as mongoose from 'mongoose'

import UserRouter from './routes/userRoute'

class Portal {
  public app: express.Application


  constructor() {
    this.app = express()
    this.config();
    this.routes();
  }

  public config(): void{
    // db connection
    const MONGO_URI = 'mongodb://localhost:27017/tstest';
    mongoose.connect(MONGO_URI, (err) => {
      if(err) console.log('connection error occurred!');
      console.log('connection successful!');
    });

    // other config
    this.app.use( bodyParser.urlencoded({extended: false}) ) 
    this.app.use( bodyParser.json() ) 
    this.app.use( logger('dev') );
    this.app.use(compression())
    this.app.use(cors())
  }

  public routes(): void{
    this.app.use('/user', UserRouter);
  }
}

export default new Portal().app;
