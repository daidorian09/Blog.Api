import * as mongoose from 'mongoose'

export interface IUser extends mongoose.Document {

    fullName: string

    email: string

    password : string

    salt : string

    accessFailedCount : number

    lastLoggedInAt : number

    isActive : boolean

    createdAt : Date

    modifiedAt : Date | null
}


const UserSchema: mongoose.Schema = new mongoose.Schema({
    fullName: {
        type: String,
        default: null,
        required: true,
        max: 150
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String
    },
    accessFailedCount: {
        type: Number,
        default: 0
    },
    lastLoggedInAt: {
        type: Date,
        default: null
    },
    isActive: {
        type: Boolean,
        default: false
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

const User = mongoose.model<IUser>("users", UserSchema)
Object.seal(User)

export default User