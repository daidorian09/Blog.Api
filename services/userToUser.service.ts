import { IUserToUserService } from './interfaces/userToUser.interface'
import  UserToUser, { IUserToUser as userToUserModel } from '../models/UserToUser'
import { GenericRepository } from '../repository/generic.repository'

import { Response } from '../dto/response.dto'
import statusCodes from '../const/statusCodes.constant';

export class UserToUserService implements IUserToUserService {
    async find(predicate?: object | undefined): Promise<userToUserModel[]> {
        return await new GenericRepository(UserToUser).find(predicate) as userToUserModel[]
    }
     
    
    async follow(userToUser: userToUserModel): Promise<Response> {

        if(userToUser.follower === userToUser.followed) {
            return new Response(false, statusCodes.BAD_REQUEST, {key : 'followed', value : 'follower can not follow on yourself'})
        }

        const folowedUser = await this.findFollowedUser(userToUser)

        if(folowedUser) {
            return new Response(false, statusCodes.BAD_REQUEST, {key : 'followed', value : 'follower has already followed the other user'})
        }

        const newUserToUser = await new GenericRepository(UserToUser).create(userToUser)

        return new Response(true, statusCodes.CREATED, {key : 'id', value : newUserToUser._id})
    }
    async unfollow(userToUser: userToUserModel): Promise<Response> {
        if(userToUser.follower === userToUser.followed) {
            return new Response(false, statusCodes.BAD_REQUEST, {key : 'followed', value : 'follower can not unfollow on yourself'})
        }

        const followedUser = await this.findFollowedUser(userToUser)

        if(!followedUser) {
            return new Response(false, statusCodes.BAD_REQUEST, {key : 'userToUser', value : 'invalid followed user'})     
        }

        followedUser.isActive = !followedUser.isActive
        followedUser.modifiedAt = Date.now()
        
        await new GenericRepository(UserToUser).update(followedUser._id, followedUser) 

        return new Response(true, statusCodes.OK, {key : 'id', value: followedUser._id})
    }   

    private async findFollowedUser(userToUser: userToUserModel) {
        const followedUser = await this.find({
            follower: userToUser.follower,
            followed: userToUser.followed,
            isActive: true
        })
        return followedUser[0]
    }


}