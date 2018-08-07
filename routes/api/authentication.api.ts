import { Request, Response, Router } from 'express'
import { IUser as User } from '../../models/User'
import { UserService } from '../../services/user.service'
import passport from 'passport'

export class AuthenticationApi {
  public router: Router

  private _userService: UserService = new UserService()

  constructor() {
    this.router = Router()
    this.routes()
  }
  private async signUp(req: Request, res:Response): Promise<void> {
    const user : User = <User>req.body

    const result = await this._userService.createUser(user)

    res.status(result.statusCode).json(result)
  }

  private async signIn(req: Request, res : Response) : Promise<void> {

    const user : User = <User>req.body

    const result = await this._userService.signIn(user.email, user.password)

    res.status(result.statusCode).json(result)
  }

  private async signOut(req:Request, res: Response) : Promise<void> {
    const token = <string>req.headers.authorization

    const result = await this._userService.signOut(token)

    res.status(result.statusCode).json(result)
  }

  private async confirmAccount(req : Request, res : Response) : Promise<void> {
    const token = <string>req.params.token

    const result = await this._userService.confirmAccount(token)

    res.status(result.statusCode).json(result)

  }


  public routes() {
    this.router.post('/sign-up', this.signUp.bind(this))
    this.router.post('/sign-in', this.signIn.bind(this))
    this.router.post('/sign-out', passport.authenticate('jwt', {
      session: false
    }), this.signOut.bind(this))
    this.router.post('/confirm-account/:token', this.confirmAccount.bind(this))
  }
}

const authenticationApi = new AuthenticationApi()
authenticationApi.routes()

export default authenticationApi.router