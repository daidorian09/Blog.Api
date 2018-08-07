import { IUserTokenService } from './interfaces/userTokenService.interface'
import  UserToken, { IUserToken as UserTokenModel } from '../models/UserToken'
import { GenericRepository } from '../repository/generic.repository'
import { Singleton } from 'typescript-ioc';

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
}