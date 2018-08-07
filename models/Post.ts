import mongoose from 'mongoose'

export interface IPost extends mongoose.Document {

    header: string

    text: string

    author : string

    isPrivate : string

    tags : Array<string>

    isActive : boolean

    createdAt : Date

    modifiedAt : Date | null | number
}

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


const Post = mongoose.model<IPost>('posts', PostSchema)
PostSchema.index({header: 'text', tags: 'text'}, {default_language: 'english'});

Object.seal(Post)
export default Post