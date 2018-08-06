import * as bodyParser from 'body-parser'
import mongoose from 'mongoose'
import express from 'express'
import jwtStrategy from './lib/jwtStrategy'
require('dotenv').config()

import { AuthenticationApi } from './routes/api/authentication.api'
import { UserApi } from './routes/api/user.api'
import { PostApi } from './routes/api/post.api'

const authApi = new AuthenticationApi()
const userApi = new UserApi()
const postApi = new PostApi()

class App {
  // set app to be of type express.Application
  public app: express.Application

  constructor() {
    this.app = express()
    this.config()
        .routes()
  }

  // application config
  public config(): this {  

    const mongoDbURI: string | undefined =  process.env.MONGODB_URI || ''
    mongoose.Promise = global.Promise

    this.validateMongoDbUri(mongoDbURI);

    mongoose.connect(mongoDbURI, {
        useNewUrlParser : true
    })

    this.app.use(jwtStrategy.init())

    // express middleware
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(bodyParser.json())

    return this

  }

    private validateMongoDbUri(mongoDbURI?: string | undefined) : void {
        if (!mongoDbURI) {
            throw Error('MongoConnection is missing')
        }
    }

  // application routes
  public routes(): this {
    const router: express.Router = express.Router();

    this.app.use('/', router)
    this.app.use('/api/auth', authApi.router)
    this.app.use('/api/user', userApi.router)
    this.app.use('/api/post', postApi.router)

    return this
  }
}

// export
export default new App().app