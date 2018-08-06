import { IPost as Post } from '../../models/Post'
import { Response } from '../../dto/response.dto'

export interface IPostService {
    find(predicate?: object): Promise<Post>

    upsert(post: Post): Promise<Response>
}