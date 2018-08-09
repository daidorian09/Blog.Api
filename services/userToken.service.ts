import { IUserTokenService } from './interfaces/userTokenService.interface'
import  UserToken, { IUserToken as UserTokenModel, TokenType } from '../models/UserToken'
import { GenericRepository } from '../repository/generic.repository'
import { Singleton } from 'typescript-ioc'

import { IAuthTokenValidatorStrategy } from '../lib/strategy/interfaces/authTokenValidatorStrategy';
import { SignInTokenValidatorStrategy } from '../lib/strategy/signInTokenValidatorStrategy';


type AuthenticationTokenValidators = {
    tokenType : TokenType,
    validatorStrategy : IAuthTokenValidatorStrategy
}


@Singleton
export class UserTokenService implements IUserTokenService {

    private readonly _genericRepository : GenericRepository<UserTokenModel> = new GenericRepository(UserToken)

    async find(predicate?: object): Promise<UserTokenModel> {
        return await this._genericRepository.findOne(predicate)
    }

    async saveToken(token: UserTokenModel): Promise<void> {
        await this._genericRepository.create(token)
    }

    async deActivateToken(userToken : UserTokenModel): Promise<void> {
        userToken.modifiedAt = Date.now()
        userToken.isActive = !userToken.isActive

        await this._genericRepository.update(userToken._id, userToken)
    }

    async validateUserAuthenticationToken (user: string, token: string, tokenType: TokenType): Promise<boolean> {

        const authTokenValidatorsArray: AuthenticationTokenValidators[] = []
        authTokenValidatorsArray.push({tokenType : TokenType.SignIn, validatorStrategy : new SignInTokenValidatorStrategy() })

        const validationResult = authTokenValidatorsArray.map(item => {
            if (item.tokenType === tokenType) {
                return item.validatorStrategy.isAuthenticationTokenValid(user, token)
            }
            return
        }).filter(async token => {
            return await token
        })

        const result = await validationResult[0]

        return !!result
        
    }

    private async isUserAuthenticationTokenActive(user: string, token: string, tokenType: TokenType) : Promise<boolean> {
        switch (tokenType) {
            case TokenType.SignIn:
            token = token.replace('Bearer ', '')

            const userToken = await this.find({applicationUser : user, isActive : true, tokenType : TokenType.SignIn, token : token})

            return !!userToken

            default : 
            return false
        }
    }
}