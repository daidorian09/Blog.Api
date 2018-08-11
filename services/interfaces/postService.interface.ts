import { IPost as Post } from '../../models/Post'
import { Response } from '../../dto/response.dto'

export interface IPostService {

    upsert(post: Post, token : string): Promise<Response>

    getPosts(follower : string, token : string) : Promise<Response>

    getPost(postId : string, userId : string, token : string) : Promise<Response>

    search(predicate? : Object) : Promise<Response>

    getMyPosts(author : string, token : string) : Promise<Response>

}