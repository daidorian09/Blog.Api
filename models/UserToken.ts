import * as mongoose from 'mongoose'

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

const UserToken = mongoose.model('userTokens', UserTokenSchema)
export default UserToken