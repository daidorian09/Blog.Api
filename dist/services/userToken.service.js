"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserToken_1 = __importDefault(require("../models/UserToken"));
const generic_repository_1 = require("../repository/generic.repository");
class UserTokenService {
    find(predicate) {
        throw new Error("Method not implemented.");
    }
    async saveToken(token) {
        await new generic_repository_1.GenericRepository(UserToken_1.default).create(token);
    }
    deActivateToken(email, password) {
        throw new Error("Method not implemented.");
    }
}
exports.UserTokenService = UserTokenService;
