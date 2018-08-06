import mongoose from 'mongoose'

export interface IUserToUser extends mongoose.Document {
    follower : string

    followed : string

    isActive : boolean

    createdAt: Date

    modifiedAt: Date | null | number
}

const UserToUserSchema: mongoose.Schema = new mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    followed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    modifiedAt: {
        type: Date,
        default: null
    }
})

const UserToUser = mongoose.model<IUserToUser>('userToUser', UserToUserSchema, 'userToUser')

Object.seal(UserToUser)
export default UserToUser