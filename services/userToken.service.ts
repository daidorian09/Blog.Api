import { IUserTokenService } from './interfaces/userTokenService.interface'
import  UserToken, { IUserToken as userTokenModel } from '../models/UserToken'
import { GenericRepository } from '../repository/generic.repository'

export class UserTokenService implements IUserTokenService {


    find(predicate?: object): Promise<userTokenModel> {
        throw new Error("Method not implemented.");
    }

    async saveToken(token: userTokenModel): Promise<void> {
        await new GenericRepository(UserToken).create(token)
    }

    deActivateToken(email: string, password: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}