"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
var TokenType;
(function (TokenType) {
    TokenType[TokenType["ConfirmAccount"] = 0] = "ConfirmAccount";
    TokenType[TokenType["SignIn"] = 1] = "SignIn";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
const UserTokenSchema = new mongoose_1.default.Schema({
    token: {
        type: String
    },
    applicationUser: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'users'
    },
    tokenType: {
        type: Number
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
    expiredAt: {
        type: Date,
        default: null
    }
});
const UserToken = mongoose_1.default.model('userTokens', UserTokenSchema, 'userTokens');
Object.seal(UserToken);
exports.default = UserToken;
