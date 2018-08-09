import { IUserToUserService } from './interfaces/userToUser.interface'
import  UserToUser, { IUserToUser as userToUserModel } from '../models/UserToUser'
import { GenericRepository } from '../repository/generic.repository'

import { Response } from '../dto/response.dto'
import statusCodes from '../const/statusCodes.constant'
import { UserService } from './user.service'
import { Singleton } from 'typescript-ioc'
import { UserTokenService } from './userToken.service'
import { TokenType } from '../models/UserToken'

@Singleton
export class UserToUserService implements IUserToUserService {

    private readonly _userService : UserService = new UserService()
    private readonly _genericRepository : GenericRepository<userToUserModel> = new GenericRepository(UserToUser)

    private readonly _userToken : UserTokenService = new UserTokenService()

    async find(predicate?: object | undefined): Promise<userToUserModel[]> {

        return await this._genericRepository.find(predicate)
    }     
    
    async follow(userToUser: userToUserModel, token : string): Promise<Response> {

        const userToken = await this._userToken.validateUserAuthenticationToken(userToUser.follower, token, TokenType.SignIn)

        if(!userToken) {
            return new Response(false, statusCodes.UNAUTHORIZED, {key:'user', value : 'access denied'})
        }
        
        const candidateFollowedUserValidationResponse = await this.validateCandidateFollowedUser(userToUser.followed)

        if(candidateFollowedUserValidationResponse) {
            return candidateFollowedUserValidationResponse
        }

        if(userToUser.follower === userToUser.followed) {
            return new Response(false, statusCodes.BAD_REQUEST, {key : 'followed', value : 'follower can not follow on yourself'})
        }

        const followedUser = await this.findFollowedUser(userToUser)

        if(followedUser) {
            return new Response(false, statusCodes.BAD_REQUEST, {key : 'followed', value : 'follower has already followed the other user'})
        }

        const newUserToUser = await this._genericRepository.create(userToUser)

        return new Response(true, statusCodes.CREATED, {key : 'id', value : newUserToUser._id})
    }
    async unfollow(userToUser: userToUserModel, token : string): Promise<Response> {

        const userToken = await this._userToken.validateUserAuthenticationToken(userToUser.follower, token, TokenType.SignIn)

        if(!userToken) {
            return new Response(false, statusCodes.UNAUTHORIZED, {key:'user', value : 'access denied'})
        }


        const candidateFollowedUserValidationResponse = await this.validateCandidateFollowedUser(userToUser.followed)

        if(candidateFollowedUserValidationResponse) {
            return candidateFollowedUserValidationResponse
        }

        if(userToUser.follower === userToUser.followed) {
            return new Response(false, statusCodes.BAD_REQUEST, {key : 'followed', value : 'follower can not unfollow on yourself'})
        }

        const followedUser = await this.findFollowedUser(userToUser)

        if(!followedUser) {
            return new Response(false, statusCodes.BAD_REQUEST, {key : 'userToUser', value : 'invalid followed user'})     
        }

        followedUser.isActive = !followedUser.isActive
        followedUser.modifiedAt = Date.now()
        
        await this._genericRepository.update(followedUser._id, followedUser)

        return new Response(true, statusCodes.OK, {key : 'id', value: followedUser._id})
    }   

    private async findFollowedUser(userToUser: userToUserModel) : Promise<userToUserModel> {
        const followedUser = await this.find({
            follower: userToUser.follower,
            followed: userToUser.followed,
            isActive: true
        })
        return followedUser[0]
    }

    private async validateCandidateFollowedUser(followed : string) : Promise<Response | void> {
        const candidateFollowedUser = await this._userService.find({_id : followed})

        if(!candidateFollowedUser) {
            return new Response(false, statusCodes.BAD_REQUEST, {key : 'followed', value : 'followed user is not found'})
        }

        if(!candidateFollowedUser.isActive) {
            return new Response(false, statusCodes.BAD_REQUEST, {key : 'followed', value : 'followed user did not confirm its account'})
        }
    }
}