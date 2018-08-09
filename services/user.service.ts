import { IUserService } from './interfaces/userService.interface'
import { PasswordService } from './password.service'
import { UserTokenService } from './userToken.service'
import { GenericRepository } from '../repository/generic.repository'

import User, { IUser as UserModel } from '../models/User'
import { Response } from '../dto/response.dto'
import statusCodes from '../const/statusCodes.constant'
import validationConfig from '../const/validationConfig.constant'
import { IUserToken as UserToken, TokenType } from '../models/UserToken'


import { calculateExpireDate } from '../lib/expireDateCalculator'
import { subtractDate } from '../lib/dateSubtractor'
import jwtStrategy from '../lib/jwtStrategy'
import { Singleton } from 'typescript-ioc'

import { validateSignUpFields } from '../lib/validation/signUp.validation'
import { validateSignInFields } from '../lib/validation/signIn.validation'
import { mapErrorObject } from '../lib/errorObjectDictionaryMapper'
import { ConcreteNotificationFactory } from './concreteNotificationFactory.service'

require('dotenv').config()


@Singleton
export class UserService implements IUserService {       
    private readonly _genericRepository : GenericRepository<UserModel> = new GenericRepository(User)
    private readonly _passwordService : PasswordService = new PasswordService()
    private readonly _userTokenService : UserTokenService = new UserTokenService()
    async find(predicate?: object): Promise<UserModel> {

        return await this._genericRepository.findOne(predicate)
    } 
    async createUser(entity: UserModel): Promise<Response> {

        try {
            const { error } = validateSignUpFields(entity)

        if(error) {
            const {key, value } = mapErrorObject(error.details)
            return new Response(false, statusCodes.UNPROCESSABLE_ENTITY, { key : key, value : value})
        }

        const user = await this.find({email : entity.email})
        if (user) {

            return await this.reSignUpCreatedUser(user)
        }

        entity.salt = await this._passwordService.generateSalt()
        entity.password = await this._passwordService.hashPassword(entity.password + entity.salt)

        const newUser = await this._genericRepository.create(entity)

        const token =  await this.saveTokenForUser(newUser._id, TokenType.ConfirmAccount)

        await this.sendNotification(token, newUser.email)

        return new Response(true, statusCodes.CREATED, {key : 'user', value : newUser._id})
        } catch (error) {
            return new Response(false, statusCodes.SERVER, {key : 'server', value : error.message})
        }        
    }

    private async reSignUpCreatedUser(createdUser : UserModel) : Promise<Response> {

        const oldUserToken = await this._userTokenService.find({
            applicationUser: createdUser._id,
            isActive: true,
            tokenType: TokenType.ConfirmAccount
        })

        if (oldUserToken && !createdUser.isActive) {

            const isTokenValid = subtractDate(<Date>oldUserToken.expiredAt)

            if (isTokenValid) {
                return new Response(false, statusCodes.CONFLICT, {
                    key: 'user',
                    value: `${createdUser.email} has already registered`
                })
            }

            await this._userTokenService.deActivateToken(oldUserToken)
            const token = await this.saveTokenForUser(createdUser._id, TokenType.ConfirmAccount)

            await this.sendNotification(token, createdUser.email)

            return new Response(true, statusCodes.CREATED, {key: 'user', value: createdUser._id})

        }
        return new Response(false, statusCodes.CONFLICT, {
            key: 'user',
            value: `${createdUser.email} has already registered`
        })
    }
    
    private async saveTokenForUser(userId : string, tokenType : TokenType) : Promise<string> {
        const token = <string>jwtStrategy.generateJwtToken(userId, tokenType)

        const expiredAt = this.getExpireDate(tokenType)
        
        await this.saveUserToken(userId, token, expiredAt, tokenType)

        return token
    }

    private async sendNotification(token : string, receiver : string) : Promise<void> {
        const abstractFactory = new ConcreteNotificationFactory()

        const emailService = abstractFactory.createEmailService()
        await emailService.sendEmail(token, receiver)
    }

    private getExpireDate(tokenType : TokenType) : Date {
        switch (tokenType) {
            case TokenType.ConfirmAccount:
                return <Date> calculateExpireDate(process.env.CONFIRMATION_TOKEN_EXPIRE_DATE)
            case TokenType.SignIn:
                return <Date> calculateExpireDate(process.env.JWT_EXPIRE_DATE)
            default:
                throw new Error('tokenType is not found')
        }
    }

    async signIn(email: string, password: string): Promise<Response> {

        try {
            const { error } = validateSignInFields(email, password)

        if(error) {
            const {key, value } = mapErrorObject(error.details)
            return new Response(false, statusCodes.UNPROCESSABLE_ENTITY, { key : key, value : value})
        }
       
        const user = await this.find({email : email})

        if(!user) {
            return new Response(false, statusCodes.NOT_FOUND, {key : 'email', value : 'User is not found'})
        }

        if(!user.isActive) {
            return new Response(false, statusCodes.BAD_REQUEST, {key : 'activation', value : 'User did not active its account'})
        }

        if(user.accessFailedCount == validationConfig.MAXIMUM_NUMBER_OF_ACCESS_COUNT) {
            return new Response(false, statusCodes.BAD_REQUEST, {key : 'account', value : `${email}'s account has been suspended for invalid activities`})
        }

        const passwordAndSalt = password + user.salt
        const canUserSignIn = await this._passwordService.validatePassword(passwordAndSalt, user.password)

        if(!canUserSignIn) {
            return await this.increaseAccessFailedCount(user)
        }

        const hasUserToken = await this._userTokenService.find({applicationUser : user._id, tokenType : TokenType.SignIn, isActive : true})

        if(hasUserToken) {
            return new Response(true, statusCodes.OK, {key : 'token', value : `Bearer ${hasUserToken.token}`})
        }       

        await this.logUserLoginDate(user)

        const token = await this.saveTokenForUser(user._id, TokenType.SignIn)

        return new Response(true, statusCodes.OK, {key : 'token', value : `Bearer ${token}`})
        } catch (error) {
            return new Response(false, statusCodes.SERVER, {key : 'server', value : error.message})
        }        
    }

    async signOut(token: string): Promise<Response> {

        try {
            token = token.replace('Bearer ', '')
            const userToken = await this._userTokenService.find({token : token, tokenType : TokenType.SignIn, isActive : true})
    
            if(!userToken) {
                return new Response(false, statusCodes.UNAUTHORIZED, {key : 'user', value : 'user can not sign out'})
            }
    
            await this._userTokenService.deActivateToken(userToken)
    
            return new Response(true, statusCodes.OK, {key : 'id', value : userToken.applicationUser})
        } catch (error) {
            return new Response(false, statusCodes.SERVER, {key : 'server', value : error.message})
        }        
    }

    async confirmAccount(token : string) : Promise<Response> {

        try {
            const userToken = await this._userTokenService.find({token : token, tokenType : TokenType.ConfirmAccount, isActive : true})

        if(!userToken) {
            return new Response(false, statusCodes.NOT_FOUND, {key : 'token' , value : 'token is not found'})
        }

        const isTokenValid= subtractDate(<Date>userToken.expiredAt)

        const user = await this.find({_id : userToken.applicationUser, isActive : false})

        if(!user) {
            return new Response(false, statusCodes.NOT_FOUND, {key : 'user', value : 'account owner is not found'})
        }

        if(isTokenValid) {
            await this._userTokenService.deActivateToken(userToken)

            user.isActive = !user.isActive
            user.modifiedAt = Date.now()

            await this._genericRepository.update(user._id, user)

            return new Response(true, statusCodes.OK, {key : 'user' , value : 'account is confirmed'})
        }

        await this._userTokenService.deActivateToken(userToken)        
        return new Response(false, statusCodes.BAD_REQUEST, {key : 'token' , value : 'token is expired'})
        } catch (error) {
            return new Response(false, statusCodes.SERVER, {key : 'server', value : error.message})
        }         
    }


    private async logUserLoginDate(user: UserModel) : Promise<void> {
        user.lastLoggedInAt = Date.now();
        user.accessFailedCount = 0;
        await new GenericRepository(User).update(user._id, user);
    }

    private async increaseAccessFailedCount(user: UserModel) : Promise<Response> {
        user.accessFailedCount = user.accessFailedCount + 1
        user.modifiedAt = Date.now()
        await this._genericRepository.update(user._id, user)
        return new Response(false, statusCodes.BAD_REQUEST, { key: 'password', value: 'password is invalid' })
    }

    private async saveUserToken(userId: string, token: string | undefined, expiredAt: Date | undefined, tokenType: TokenType): Promise < void > {
        const userToken = < UserToken > {
            applicationUser: userId,
            token: token,
            tokenType: tokenType,
            expiredAt: expiredAt
        };
        await this._userTokenService.saveToken(userToken)
    }
}


