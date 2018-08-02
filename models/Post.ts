import * as mongoose from 'mongoose'

const PostSchema: mongoose.Schema = new mongoose.Schema({
    header: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required : true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    isPrivate: {
        type: Boolean
    },
    tags: {
        type : Array
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

const Post = mongoose.model('posts', PostSchema)
export default Post