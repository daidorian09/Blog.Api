import { IUser as User } from '../../models/User'
import { Response } from '../../dto/response.dto'

export interface IUserService {
    find(predicate?: object): Promise <User>

    createUser(entity: User): Promise<Response>

    signIn(email : string, password : string) : Promise<Response>

    signOut(token : string) : Promise<Response>

    confirmAccount(token : string) : Promise<Response>
}