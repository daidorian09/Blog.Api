"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PostSchema = new mongoose_1.default.Schema({
    header: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'users'
    },
    isPrivate: {
        type: Boolean
    },
    tags: {
        type: Array
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
});
const Post = mongoose_1.default.model('posts', PostSchema);
Object.seal(Post);
exports.default = Post;
