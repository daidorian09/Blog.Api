import { IPost as Post } from '../../models/Post'
import { Response } from '../../dto/response.dto'

export interface IPostService {

    upsert(post: Post): Promise<Response>

    getPosts(follower : string) : Promise<Response>

    getPost(postId : string, userId : string) : Promise<Response>

    search(predicate? : Object) : Promise<Response>


}