import {  Strategy,  ExtractJwt } from "passport-jwt"
import jwt, {  Secret } from 'jsonwebtoken'
import passport from "passport"

import User from '../models/User'
import { TokenType } from "../models/UserToken"

require('dotenv').config()

class JwtStrategy {
    public init = () => {
        passport.use("jwt", this.getStrategy())
        return passport.initialize()
    }

    public generateJwtToken = (id: string, tokenType: TokenType): string => {
        switch (tokenType) {
            case TokenType.SignIn:
                return this.generateConfirmAccountToken(id)
                break;
            case TokenType.ConfirmAccount:
                return this.generateSignInToken(id)
            default:
                throw Error('Undefined token type')
        }
    }

    private getStrategy = (): Strategy => {
        const params = {
            secretOrKey: process.env.JWTSECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            passReqToCallback: true,
        };

        return new Strategy(params, (req: any, payload: any, done: any) => {
            User.findById(
                payload.id, (err, user) => {
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
    }

    private generateConfirmAccountToken(id: string): string {
        return jwt.sign({
                id: id
            },
            process.env.JWTSECRET as Secret, {
                expiresIn: process.env.CONFIRMATION_TOKEN_EXPIRE_DATE,
                audience: process.env.JWT_AUDIENCE,
                issuer: process.env.JWT_ISSUER,
                noTimestamp: !!process.env.JWT_NO_TIMESTAMP
            })
    }

    private generateSignInToken(id: string): string {
        return jwt.sign({
                id: id
            },
            process.env.JWTSECRET as Secret, {
                expiresIn: process.env.JWT_EXPIRE_DATE,
                audience: process.env.JWT_AUDIENCE,
                issuer: process.env.JWT_ISSUER,
                noTimestamp: !!process.env.JWT_NO_TIMESTAMP
            })
    }
}

export default new JwtStrategy()