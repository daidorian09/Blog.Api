"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_jwt_1 = require("passport-jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_1 = __importDefault(require("passport"));
const User_1 = __importDefault(require("../models/User"));
const UserToken_1 = require("../models/UserToken");
require('dotenv').config();
class JwtStrategy {
    constructor() {
        this.init = () => {
            passport_1.default.use("jwt", this.getStrategy());
            return passport_1.default.initialize();
        };
        this.generateJwtToken = (id, tokenType) => {
            switch (tokenType) {
                case UserToken_1.TokenType.SignIn:
                    return this.generateConfirmAccountToken(id);
                    break;
                case UserToken_1.TokenType.ConfirmAccount:
                    return this.generateSignInToken(id);
                default:
                    throw Error('Undefined token type');
            }
        };
        this.getStrategy = () => {
            const params = {
                secretOrKey: process.env.JWTSECRET,
                jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
                passReqToCallback: true,
            };
            return new passport_jwt_1.Strategy(params, (req, payload, done) => {
                User_1.default.findById(payload.id, (err, user) => {
                    /* istanbul ignore next: passport response */
                    if (err) {
                        return done(err);
                    }
                    /* istanbul ignore next: passport response */
                    if (user === null) {
                        return done(null, false, {
                            message: "The user in the token was not found"
                        });
                    }
                    return done(null, {
                        _id: user._id
                    });
                });
            });
        };
    }
    generateConfirmAccountToken(id) {
        return jsonwebtoken_1.default.sign({
            id: id
        }, process.env.JWTSECRET, {
            expiresIn: process.env.CONFIRMATION_TOKEN_EXPIRE_DATE,
            audience: process.env.JWT_AUDIENCE,
            issuer: process.env.JWT_ISSUER,
            noTimestamp: !!process.env.JWT_NO_TIMESTAMP
        });
    }
    generateSignInToken(id) {
        return jsonwebtoken_1.default.sign({
            id: id
        }, process.env.JWTSECRET, {
            expiresIn: process.env.JWT_EXPIRE_DATE,
            audience: process.env.JWT_AUDIENCE,
            issuer: process.env.JWT_ISSUER,
            noTimestamp: !!process.env.JWT_NO_TIMESTAMP
        });
    }
}
exports.default = new JwtStrategy();
