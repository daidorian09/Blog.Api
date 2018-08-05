import { Request, Response, Router } from 'express'
import { IUser as User } from '../../models/User'
import { UserService } from '../../services/user.service'
import passport from 'passport'

export class AuthenticationApi {
  public router: Router

  constructor() {
    this.router = Router()
    this.routes()
  }

  // get a single post by params of 'slug'
  public one(req: Request, res: Response): void {
    const { slug } = req.params

    res.status(200).json({
        key : "test",
        value : "test"
    })
  }

  public async signUp(req: Request, res:Response): Promise<void> {
    const user : User = <User>req.body

    const result = await new UserService().createUser(user)

    res.status(result.statusCode).json(result)
  }

  public async signIn(req: Request, res : Response) : Promise<void> {

    const user : User = <User>req.body

    const result = await new UserService().signIn(user.email, user.password)

    res.status(result.statusCode).json(result)
  }

  private signOut(req:Request, res: Response, ) : void {
    const user = req.user

    res.status(200).json(user)
  }


  public routes() {
    this.router.get('/test', this.one)
    this.router.post('/sign-up', this.signUp)
    this.router.post('/sign-in', this.signIn)
    this.router.post('/sign-out', passport.authenticate('jwt', {
      session: false
    }), this.signOut)
  }
}

const authenticationApi = new AuthenticationApi()
authenticationApi.routes()

export default authenticationApi.router