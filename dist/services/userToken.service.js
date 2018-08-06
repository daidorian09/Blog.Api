"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserToken_1 = __importDefault(require("../models/UserToken"));
const generic_repository_1 = require("../repository/generic.repository");
class UserTokenService {
    async find(predicate) {
        return await new generic_repository_1.GenericRepository(UserToken_1.default).findOne(predicate);
    }
    async saveToken(token) {
        await new generic_repository_1.GenericRepository(UserToken_1.default).create(token);
    }
    async deActivateToken(userToken) {
        userToken.modifiedAt = Date.now();
        userToken.isActive = !userToken.isActive;
        await new generic_repository_1.GenericRepository(UserToken_1.default).update(userToken._id, userToken);
    }
}
exports.UserTokenService = UserTokenService;
