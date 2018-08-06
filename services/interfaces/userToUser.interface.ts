import { IUserToUser as UserToUser } from '../../models/UserToUser'
import { Response } from '../../dto/response.dto'

export interface IUserToUserService {
    find(predicate? : object) : Promise<UserToUser[]>

    follow(userToUser: UserToUser): Promise<Response>

    unfollow(userToUser : UserToUser) : Promise<Response>
}