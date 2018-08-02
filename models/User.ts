import * as mongoose from 'mongoose'

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

const User = mongoose.model('users', UserSchema)
export default User