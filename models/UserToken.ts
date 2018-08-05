import mongoose from 'mongoose'
export enum TokenType {
    ConfirmAccount,
    SignIn
}

export interface IUserToken extends mongoose.Document {
    token : string

    applicationUser : string

    tokenType : TokenType

    isActive : boolean

    createdAt: Date

    modifiedAt: Date | null

    expiredAt: Date | null | number
}

const UserTokenSchema: mongoose.Schema = new mongoose.Schema({
    token: {
        type: String
    },
    applicationUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    tokenType : {
        type : Number
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
    },
    expiredAt : {
        type : Date,
        default : null
    }
})

const UserToken = mongoose.model<IUserToken>('userTokens', UserTokenSchema)

Object.seal(UserToken)
export default UserToken