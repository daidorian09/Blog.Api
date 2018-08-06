import { Request, Response, Router } from 'express'
import { IPost as Post } from '../../models/Post'
import { PostService } from '../../services/post.service'
import passport from 'passport'

export class PostApi {
  public router: Router

  constructor() {
    this.router = Router()
    this.routes()
  }

  public async post(req: Request, res:Response): Promise<void> {
    const post : Post = <Post>req.body
    post.author = <string>req.user._id

    const result = await new PostService().upsert(post)

    res.status(result.statusCode).json(result)
  }

  public async displayPosts(req: Request, res:Response): Promise<void> {
    const follower = <string>req.user._id

    const result = await new PostService().displayPosts(follower)

    res.status(result.statusCode).json(result)
  }



  public routes() {
    this.router.post('/post', passport.authenticate('jwt', {
      session: false
    }), this.post)
    this.router.post('/display-posts', passport.authenticate('jwt', {
      session: false
    }), this.displayPosts)
  }
}

const postApi = new PostApi()
postApi.routes()

export default postApi.router