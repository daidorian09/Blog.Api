import mongoose from 'mongoose'

export interface IUser extends mongoose.Document {
    fullName: string

    email: string

    password: string

    salt: string

    accessFailedCount: number

    lastLoggedInAt: number | Date

    isActive: boolean

    createdAt: Date

    modifiedAt: Date | null | number
}

const UserSchema: mongoose.Schema = new mongoose.Schema({
    fullName: {
        type: String,
        default: null,
        required: true,
        max: 150,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
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

const User = mongoose.model<IUser>("users", UserSchema, 'users')
Object.seal(User)

export default User