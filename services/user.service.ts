import { IUserService } from './interfaces/userService.interface'
import { PasswordService } from './password.service'
import { UserTokenService } from './userToken.service'
import jwtStrategy from '../lib/jwtStrategy'


import { GenericRepository } from '../repository/generic.repository'
import User, { IUser as UserModel } from '../models/User'
import { Response } from '../dto/response.dto'
import statusCodes from '../const/statusCodes.constant'
import validationConfig from '../const/validationConfig.constat'
import { IUserToken as UserToken, TokenType } from '../models/UserToken'

import { calculateExpireDate } from '../lib/expireDateCalculator'

require('dotenv').config()


export class UserService implements IUserService {
    async find(predicate?: object): Promise<UserModel> {
        
        return await new GenericRepository(User).findOne(predicate) as UserModel

    } 
    async createUser(entity: UserModel): Promise<Response> {

        const user = await this.find({email : entity.email})

        if(user) {
           return new Response(false, statusCodes.CONFLICT, {key : 'user', value : `${user.email} has already registered`})
        }

        const passwordService = new  PasswordService()
        entity.salt = await passwordService.generateSalt()
        entity.password = await passwordService.hashPassword(entity.password + entity.salt)

        const newUser = await new GenericRepository(User).create(entity)

        const token = jwtStrategy.generateJwtToken(newUser._id, TokenType.ConfirmAccount)
        const expiredAt = calculateExpireDate(process.env.CONFIRMATION_TOKEN_EXPIRE_DATE)

        const userToken = <UserToken>{
            applicationUser : newUser._id,
            token : token,
            tokenType : TokenType.ConfirmAccount,
            expiredAt : expiredAt
        }

        const userTokenService = new UserTokenService()
        await userTokenService.saveToken(userToken)

        return new Response(true, statusCodes.CREATED, {key : 'user', value : newUser.id})
    }
    
    async signIn(email: string, password: string): Promise<Response> {
       
        const user = await this.find({email : email})

        if(!user) {
            return new Response(false, statusCodes.NOT_FOUND, {key : 'email', value : 'User is not found'})
        }

        if(!user.isActive) {
            return new Response(false, statusCodes.BAD_REQUEST, {key : 'activation', value : 'User did not active its account'})
        }

        if(user.accessFailedCount == validationConfig.MaximumNumberOfAccessCount) {
            return new Response(false, statusCodes.BAD_REQUEST, {key : 'account', value : `${email}'s account has been suspended for invalid activities`})
        }

        const userTokenService = new UserTokenService()
        const hasUserToken = await userTokenService.find({applicationUser : user._id, tokenType : TokenType.SignIn, isActive : true})

        if(hasUserToken) {
            return new Response(true, statusCodes.OK, {key : 'token', value : `Bearer ${hasUserToken.token}`})
        }

        const passwordAndSalt = password + user.salt

        const passwordService = new  PasswordService()
        const canUserSignIn = await passwordService.validatePassword(passwordAndSalt, user.password)

        if(!canUserSignIn) {
            return await this.increaseAccessFailedCount(user);
        }

        await this.logUserLoginDate(user);

        const token = jwtStrategy.generateJwtToken(user._id, TokenType.SignIn)
        const expiredAt = calculateExpireDate(process.env.JWT_EXPIRE_DATE)

        const userToken = <UserToken>{
            applicationUser : user._id,
            token : token,
            tokenType : TokenType.SignIn,
            expiredAt : expiredAt
        }

        await userTokenService.saveToken(userToken)

        return new Response(true, statusCodes.OK, {key : 'token', value : `Bearer ${token}`})
    }

    async signOut(token: string): Promise<Response> {
        token = token.replace('Bearer ', '')
        const userTokenService = new UserTokenService()
        const userToken = await userTokenService.find({token : token, tokenType : TokenType.SignIn, isActive : true})

        if(!userToken) {
            return new Response(false, statusCodes.UNAUTHORIZED, {key : 'user', value : 'user can not sign out'})
        }

        await userTokenService.deActivateToken(userToken)

        return new Response(true, statusCodes.OK, {key : 'id', value : userToken.applicationUser})
    }


    private async logUserLoginDate(user: UserModel) : Promise<void> {
        user.lastLoggedInAt = Date.now();
        user.accessFailedCount = 0;
        await new GenericRepository(User).update(user._id, user);
    }

    private async increaseAccessFailedCount(user: UserModel) {
        user.accessFailedCount = user.accessFailedCount + 1;
        await new GenericRepository(User).update(user._id, user);
        return new Response(false, statusCodes.BAD_REQUEST, { key: 'password', value: 'password is invalid' });
    }
}