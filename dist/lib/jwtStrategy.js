"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_jwt_1 = require("passport-jwt");
const passport_1 = __importDefault(require("passport"));
const User_1 = __importDefault(require("../models/User"));
const UserToken_1 = require("../models/UserToken");
const confirmAccountTokenStrategy_1 = require("../lib/strategy/confirmAccountTokenStrategy");
const signInTokenStrategy_1 = require("../lib/strategy/signInTokenStrategy");
require('dotenv').config();
class JwtStrategy {
    constructor() {
        this.init = () => {
            passport_1.default.use("jwt", this.getStrategy());
            return passport_1.default.initialize();
        };
        this.generateJwtToken = (id, tokenType) => {
            const jwtTokenGeneratorArray = [];
            jwtTokenGeneratorArray.push({ tokenType: UserToken_1.TokenType.SignIn, strategy: new signInTokenStrategy_1.SignInTokenStrategy() });
            jwtTokenGeneratorArray.push({ tokenType: UserToken_1.TokenType.ConfirmAccount, strategy: new confirmAccountTokenStrategy_1.ConfirmAccountTokenStrategy() });
            const tokenStrategy = jwtTokenGeneratorArray.map(item => {
                if (item.tokenType === tokenType) {
                    return item.strategy.generateToken(id);
                }
                return;
            }).filter(token => {
                return token;
            });
            return tokenStrategy[0];
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
                    if (!user) {
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
}
exports.default = new JwtStrategy();
