import { IUserToken as UserToken, TokenType } from '../../models/UserToken'

export interface IUserTokenService {
    find(predicate?: object): Promise <UserToken>

    saveToken(token: UserToken): Promise<void>

    deActivateToken(UserToken : UserToken) : Promise<void>
    
    validateUserAuthenticationToken(user : string, token : string, tokenType : TokenType) : Promise<boolean>
}