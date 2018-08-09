import { IAuthTokenValidatorStrategy } from './interfaces/authTokenValidatorStrategy'
import { UserTokenService } from '../../services/userToken.service'
import { TokenType } from '../../models/UserToken'

export class SignInTokenValidatorStrategy implements IAuthTokenValidatorStrategy {
    
    private readonly _userTokenService = new UserTokenService()
    async isAuthenticationTokenValid(user: string, token: string): Promise<boolean> {
        token = token.replace('Bearer ', '')
        
        const signInToken =  await this._userTokenService.find({applicationUser : user, isActive : true, tokenType : TokenType.SignIn, token : token})

        return !!signInToken
    }
}