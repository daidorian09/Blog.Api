import { IUserToken as UserToken } from '../../models/UserToken'

export interface IUserTokenService {
    find(predicate?: object): Promise <UserToken>

    saveToken(token: UserToken): Promise<void>

    deActivateToken(email : string, password : string) : Promise<boolean>
}