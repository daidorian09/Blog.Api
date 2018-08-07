import { Request, Response, Router } from 'express'
import { IPost as Post } from '../../models/Post'
import { PostService } from '../../services/post.service'
import passport from 'passport'

export class PostApi {
  public router: Router

  private readonly _postService : PostService = new PostService()

  constructor() {
    this.router = Router()
    this.routes()
  }

  public async post(req: Request, res:Response): Promise<void> {
    const post : Post = <Post>req.body
    post.author = <string>req.user._id

    const result = await this._postService.upsert(post)

    res.status(result.statusCode).json(result)
  }

  public async getPosts(req: Request, res:Response): Promise<void> {
    const follower = <string>req.user._id

    const result = await this._postService.getPosts(follower)

    res.status(result.statusCode).json(result)
  }

  public async getPost(req: Request, res:Response) : Promise<void> {
    const postId = <string>req.params.postId
    const follower =  <string>req.user._id

    const result = await this._postService.getPost(postId, follower)

    res.status(result.statusCode).json(result)
  }

  public async search(req: Request, res : Response) : Promise<void> {
    const query = req.params.q
    const userId =  <string>req.user._id

    const data  = {
      q : query,
      userId : userId
    }

    const result = await this._postService.search(data)

    res.status(result.statusCode).json(result)
  }
  public routes() {
    this.router.post('/post', passport.authenticate('jwt', {
      session: false
    }), this.post.bind(this))
    this.router.get('/get-posts', passport.authenticate('jwt', {
      session: false
    }), this.getPosts.bind(this))
    this.router.get('/get-post/:postId', passport.authenticate('jwt', {
      session: false
    }), this.getPost.bind(this))
    this.router.get('/search/:q', passport.authenticate('jwt', {
      session: false
    }), this.search.bind(this))
  }
}

const postApi = new PostApi()
postApi.routes()

export default postApi.router