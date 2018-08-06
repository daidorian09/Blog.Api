import { IPostService } from './interfaces/postService.interface'
import Post, { IPost as PostModel } from '../models/Post'
import { GenericRepository } from '../repository/generic.repository'

import { Response } from '../dto/response.dto'
import statusCodes from '../const/statusCodes.constant'
import { UserService } from './user.service';
import { UserToUserService } from './userToUser.service';
import { UserTokenService } from './userToken.service';
import { TokenType } from '../models/UserToken';

export class PostService implements IPostService {

    private readonly _genericRepository : GenericRepository<PostModel>
    private readonly _userToUserService : UserToUserService

    private readonly _userTokenService : UserTokenService

    constructor() {
        this._genericRepository = new GenericRepository(Post)
        this._userToUserService = new UserToUserService()
        this._userTokenService = new UserTokenService()
    }
    async find(predicate? : Object) : Promise<PostModel> {
        return await this._genericRepository.findOne(predicate) as PostModel
    }

    async upsert(post : PostModel) : Promise<Response> {

        const userToken = await this.findUserToken(post.author)

        if(!userToken) {
            return new Response(false, statusCodes.UNAUTHORIZED, {key:'user', value : 'access denied'})
        }

        const postEntity = await this.find({ header : post.header, isActive : true, author : post.author})

        if(postEntity) {
            postEntity.modifiedAt = Date.now()
            await this._genericRepository.update(postEntity._id, post)
            return new Response(true, statusCodes.OK, {key : 'post' , value : postEntity._id})
        }

        const newPost = await this._genericRepository.create(post)

        return new Response(true, statusCodes.CREATED, {key : 'post', value : newPost._id})
    }

    async displayPosts(follower : string) : Promise<Response> {

        const userToken = await this.findUserToken(follower)

        if(!userToken) {
            return new Response(false, statusCodes.UNAUTHORIZED, {key:'user', value : 'access denied'})
        }

        const followeds = await this._userToUserService.find({follower : follower, isActive : true})

        if(followeds.length === 0 || !followeds) {
            return new Response(true, statusCodes.NO_CONTENT, {key:'posts', value: followeds})
        }

        const followedIds : string[] = []
         followeds.filter(item => {
            if(item.followed) {
                followedIds.push(item.followed)
            }
        })

        const followedsPosts = await this._genericRepository.find({
            author : {
                $in: followedIds
            },
            isActive : true
        })

        if(followedsPosts.length === 0 || !followedsPosts) {
            return new Response(true, statusCodes.NO_CONTENT, {key:'posts', value: followeds})
        }

        return new Response(true, statusCodes.OK, {key : "posts", value: followedsPosts })
    }

    private async findUserToken(applicationUser : string) : Promise<boolean> {
        const userToken = await this._userTokenService.find({applicationUser : applicationUser, isActive : true, tokenType : TokenType.SignIn})

        return !!userToken

    }
}