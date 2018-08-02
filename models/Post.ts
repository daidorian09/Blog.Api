import * as mongoose from 'mongoose'

const PostSchema: mongoose.Schema = new mongoose.Schema({
    header: {
        type: String,
        required: true,
    },
    text: {
        type: String
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

const Post = mongoose.model('posts', PostSchema)
export default Post