"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const password_service_1 = require("./password.service");
const userToken_service_1 = require("./userToken.service");
const jwtStrategy_1 = __importDefault(require("../lib/jwtStrategy"));
const generic_repository_1 = require("../repository/generic.repository");
const User_1 = __importDefault(require("../models/User"));
const response_dto_1 = require("../dto/response.dto");
const statusCodes_constant_1 = __importDefault(require("../const/statusCodes.constant"));
const UserToken_1 = require("../models/UserToken");
const expireDateCalculator_1 = require("../lib/expireDateCalculator");
require('dotenv').config();
class UserService {
    async find(predicate) {
        return await new generic_repository_1.GenericRepository(User_1.default).findOne(predicate);
    }
    async createUser(entity) {
        const user = await this.find({ email: entity.email });
        if (user) {
            return new response_dto_1.Response(false, statusCodes_constant_1.default.CONFLICT, { key: 'user', value: `${user.email} has already registered` });
        }
        const passwordService = new password_service_1.PasswordService();
        entity.salt = await passwordService.generateSalt();
        entity.password = await passwordService.hashPassword(entity.password + entity.salt);
        const newUser = await new generic_repository_1.GenericRepository(User_1.default).create(entity);
        const token = jwtStrategy_1.default.generateJwtToken(newUser._id, UserToken_1.TokenType.ConfirmAccount);
        const expiredAt = expireDateCalculator_1.calculateExpireDate(process.env.CONFIRMATION_TOKEN_EXPIRE_DATE);
        const userToken = {
            applicationUser: newUser._id,
            token: token,
            tokenType: UserToken_1.TokenType.ConfirmAccount,
            expiredAt: expiredAt
        };
        const userTokenService = new userToken_service_1.UserTokenService();
        await userTokenService.saveToken(userToken);
        return new response_dto_1.Response(true, statusCodes_constant_1.default.CREATED, { key: 'user', value: newUser.id });
    }
    async signIn(email, password) {
        const user = await this.find({ email: email });
        if (!user) {
            return new response_dto_1.Response(false, statusCodes_constant_1.default.NOT_FOUND, { key: 'email', value: 'User is not found' });
        }
        if (!user.isActive) {
            return new response_dto_1.Response(false, statusCodes_constant_1.default.BAD_REQUEST, { key: 'activation', value: 'User did not active its account' });
        }
        if (user.accessFailedCount == 5) {
            return new response_dto_1.Response(false, statusCodes_constant_1.default.BAD_REQUEST, { key: 'account', value: `${email}'s account has been suspended for invalid activities` });
        }
        const userTokenService = new userToken_service_1.UserTokenService();
        const hasUserToken = await userTokenService.find({ applicationUser: user._id, tokenType: UserToken_1.TokenType.SignIn, isActive: true });
        if (hasUserToken) {
            return new response_dto_1.Response(true, statusCodes_constant_1.default.OK, { key: 'token', value: `Bearer ${hasUserToken.token}` });
        }
        const passwordAndSalt = password + user.salt;
        const passwordService = new password_service_1.PasswordService();
        const canUserSignIn = await passwordService.validatePassword(passwordAndSalt, user.password);
        if (!canUserSignIn) {
            return await this.increaseAccessFailedCount(user);
        }
        await this.logUserLoginDate(user);
        const token = jwtStrategy_1.default.generateJwtToken(user._id, UserToken_1.TokenType.SignIn);
        const expiredAt = expireDateCalculator_1.calculateExpireDate(process.env.JWT_EXPIRE_DATE);
        const userToken = {
            applicationUser: user._id,
            token: token,
            tokenType: UserToken_1.TokenType.SignIn,
            expiredAt: expiredAt
        };
        await userTokenService.saveToken(userToken);
        return new response_dto_1.Response(true, statusCodes_constant_1.default.OK, { key: 'token', value: `Bearer ${token}` });
    }
    async signOut(token) {
        token = token.replace('Bearer ', '');
        const userTokenService = new userToken_service_1.UserTokenService();
        const userToken = await userTokenService.find({ token: token, tokenType: UserToken_1.TokenType.SignIn, isActive: true });
        if (!userToken) {
            return new response_dto_1.Response(false, statusCodes_constant_1.default.UNAUTHORIZED, { key: 'user', value: 'user can not sign out' });
        }
        await userTokenService.deActivateToken(userToken);
        return new response_dto_1.Response(true, statusCodes_constant_1.default.OK, { key: 'id', value: userToken.applicationUser });
    }
    async logUserLoginDate(user) {
        user.lastLoggedInAt = Date.now();
        user.accessFailedCount = 0;
        await new generic_repository_1.GenericRepository(User_1.default).update(user._id, user);
    }
    async increaseAccessFailedCount(user) {
        user.accessFailedCount = user.accessFailedCount + 1;
        await new generic_repository_1.GenericRepository(User_1.default).update(user._id, user);
        return new response_dto_1.Response(false, statusCodes_constant_1.default.BAD_REQUEST, { key: 'password', value: 'password is invalid' });
    }
}
exports.UserService = UserService;
