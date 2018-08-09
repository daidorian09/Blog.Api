import { IPostService } from './interfaces/postService.interface'
import Post, { IPost as PostModel } from '../models/Post'
import { GenericRepository } from '../repository/generic.repository'

import { Response } from '../dto/response.dto'
import statusCodes from '../const/statusCodes.constant'

import { UserToUserService } from './userToUser.service'
import { UserTokenService } from './userToken.service'
import { TokenType } from '../models/UserToken'
import { Singleton } from 'typescript-ioc'

import { validatePostFields  } from '../lib/validation/post.validation'
import { mapErrorObject } from '../lib/errorObjectDictionaryMapper'

@Singleton
export class PostService implements IPostService {
 
    private readonly _genericRepository : GenericRepository<PostModel> = new GenericRepository(Post)
    private readonly _userToUserService : UserToUserService = new UserToUserService()
    private readonly _userTokenService : UserTokenService = new UserTokenService()
    private async find(predicate? : Object) : Promise<PostModel> {
        return await this._genericRepository.findOne(predicate)
    }

    async upsert(post : PostModel, token : string) : Promise<Response> {

        const userToken = await this._userTokenService.validateUserAuthenticationToken(post.author, token, TokenType.SignIn)

        if(!userToken) {
            return new Response(false, statusCodes.UNAUTHORIZED, {key:'user', value : 'access denied'})
        }

        const { error } = validatePostFields(post)

        if(error) {
            const {key, value } = mapErrorObject(error.details)
            return new Response(false, statusCodes.UNPROCESSABLE_ENTITY, { key : key, value : value})
        }

        const postEntity = await this.find({ header : post.header, isActive : true, author : post.author})

        if(postEntity) {
            postEntity.modifiedAt = Date.now()
            postEntity.tags = post.tags
            await this._genericRepository.update(postEntity._id, postEntity)
            return new Response(true, statusCodes.OK, {key : 'post' , value : postEntity._id})
        }

        const newPost = await this._genericRepository.create(post)

        return new Response(true, statusCodes.CREATED, {key : 'post', value : newPost._id})
    }

    async getPosts(follower : string, token : string) : Promise<Response> {

        const userToken = await this._userTokenService.validateUserAuthenticationToken(follower, token, TokenType.SignIn)

        if(!userToken) {
            return new Response(false, statusCodes.UNAUTHORIZED, {key:'user', value : 'access denied'})
        }

        const followeds = await this._userToUserService.find({follower : follower, isActive : true})

        if(followeds.length === 0 || !followeds) {
            return new Response(true, statusCodes.NO_CONTENT, {key:'posts', value: followeds})
        }

        const followedIds : Array<string> = []
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

    async getPost(postId : string, userId : string, token : string) : Promise<Response> {

        const userToken = await this._userTokenService.validateUserAuthenticationToken(userId, token, TokenType.SignIn)

        if(!userToken) {
            return new Response(false, statusCodes.UNAUTHORIZED, {key:'user', value : 'access denied'})
        }

        const post = await this.find({_id : postId, isActive : true})

        if(!post) {
            return new Response(false, statusCodes.NOT_FOUND, {key : 'post', value : 'post is not found'})
        }
        
        await this.increaseClickCount(post)
        
        if(post.author.toString() === userId.toString()) {
            return new Response(true, statusCodes.OK, {key : 'post', value : post})
        }

        const userToUser = await this._userToUserService.find({followed : post.author, follower : userId  ,isActive : true})

        if(!userToUser[0]) {
            return new Response(false, statusCodes.NOT_FOUND, {key : 'post', value : 'post is not found'})
        }        

        if(userToUser[0].followed.toString() === post.author.toString() && post.isPrivate) {
            return new Response(false, statusCodes.UNAUTHORIZED, {key : 'post', value: 'post status is private'})
        }
        
        return new Response(true, statusCodes.OK, {key : 'post', value : post})
    }

    async search(predicate?: any): Promise<Response> {
        const userToken = await this._userTokenService.validateUserAuthenticationToken(predicate.userId, predicate.token, TokenType.SignIn)

        if(!userToken) {
            return new Response(false, statusCodes.UNAUTHORIZED, {key:'user', value : 'access denied'})
        }

        const searchQueryArray :Array<string> = predicate.q.trim().split(/\s+/)
        const searchResult = await this._genericRepository.find({
            $or: [{
                tags: {
                    $in: searchQueryArray
                }
            }, {
                header: new RegExp(predicate.q.trim(), 'i')
            }],
                isActive: true,
                isPrivate : false
        })

        if(searchResult.length === 0) {
            return new Response(false, statusCodes.NOT_FOUND, {key:'search', value : searchResult})
        }

        return new Response(true, statusCodes.OK, {key : 'search', value : searchResult})
    }

    private async increaseClickCount(model : PostModel) : Promise<void> {
        model.clickCount = model.clickCount + 1
        model.modifiedAt = Date.now()

        await this._genericRepository.update(model._id, model)

    }
}