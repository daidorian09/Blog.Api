import { Request, Response, Router } from 'express'
import { IUserToUser as UserToUser } from '../../models/UserToUser'
import { UserToUserService } from '../../services/userToUser.service'
import passport from 'passport'

export class UserApi {
  public router: Router

  private readonly _userToUserService : UserToUserService = new UserToUserService()

  constructor() {
    this.router = Router()
    this.routes()
  }

  public async follow(req: Request, res: Response): Promise <void> {
      
      const userToUser: UserToUser = <UserToUser> req.body
      userToUser.follower = req.user._id

      const result = await this._userToUserService.follow(userToUser)

      res.status(result.statusCode).json(result)
  }

  public async unfollow(req: Request, res: Response): Promise <void> {

      const userToUser: UserToUser = <UserToUser>req.body
      userToUser.follower = req.user._id

      const result = await this._userToUserService.unfollow(userToUser)

      res.status(result.statusCode).json(result)
  }

  public routes() {
      this.router.post('/follow', passport.authenticate('jwt', {
        session: false
      }), this.follow.bind(this))
      this.router.post('/unfollow', passport.authenticate('jwt', {
        session: false
      }), this.unfollow.bind(this))
  }
}

const userApi = new UserApi()
userApi.routes()

export default userApi.router