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
    const token = <string>req.headers.authorization
    const result = await this._postService.upsert(post, token)

    res.status(result.statusCode).json(result)
  }

  public async getPosts(req: Request, res:Response): Promise<void> {
    const follower = <string>req.user._id
    const token = <string>req.headers.authorization
    const result = await this._postService.getPosts(follower, token)

    res.status(result.statusCode).json(result)
  }

  public async getPost(req: Request, res:Response) : Promise<void> {
    const postId = <string>req.params.postId
    const follower =  <string>req.user._id
    const token = <string>req.headers.authorization

    const result = await this._postService.getPost(postId, follower, token)

    res.status(result.statusCode).json(result)
  }

  public async search(req: Request, res : Response) : Promise<void> {
    const query = req.params.q
    const userId =  <string>req.user._id
    const token = <string>req.headers.authorization

    const data  = {
      q : query,
      userId : userId,
      token : token
    }

    const result = await this._postService.search(data)

    res.status(result.statusCode).json(result)
  }

  public async getMyPosts(req : Request, res : Response) : Promise<void> {
    const author =  <string>req.user._id
    const token = <string>req.headers.authorization

    const result = await this._postService.getMyPosts(author, token)

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
    this.router.get('/getMy-posts', passport.authenticate('jwt', {
      session: false
    }), this.getPost.bind(this))
  }
}

const postApi = new PostApi()
postApi.routes()

export default postApi.router