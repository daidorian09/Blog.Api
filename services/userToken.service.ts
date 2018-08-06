import { IUserTokenService } from './interfaces/userTokenService.interface'
import  UserToken, { IUserToken as UserTokenModel } from '../models/UserToken'
import { GenericRepository } from '../repository/generic.repository'

export class UserTokenService implements IUserTokenService {
    async find(predicate?: object): Promise<UserTokenModel> {
        return await new GenericRepository(UserToken).findOne(predicate) as UserTokenModel
    }

    async saveToken(token: UserTokenModel): Promise<void> {
        await new GenericRepository(UserToken).create(token)
    }

    async deActivateToken(userToken : UserTokenModel): Promise<void> {
        userToken.modifiedAt = Date.now()
        userToken.isActive = !userToken.isActive

        await new GenericRepository(UserToken).update(userToken._id, userToken)
    }
}