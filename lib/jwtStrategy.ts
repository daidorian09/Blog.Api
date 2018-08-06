import {  Strategy,  ExtractJwt } from "passport-jwt"
import jwt, {  Secret } from 'jsonwebtoken'
import passport from "passport"

import User from '../models/User'
import { TokenType } from '../models/UserToken'


import { ITokenGeneratorStrategy } from "../lib/strategy/interfaces/tokenGeneratorStrategy.interface"
import { ConfirmAccountTokenStrategy } from '../lib/strategy/confirmAccountTokenStrategy'
import { SignInTokenStrategy } from '../lib/strategy/signInTokenStrategy'

require('dotenv').config()

type JwtTokenGenerator = {
    tokenType : TokenType,
    strategy : ITokenGeneratorStrategy
}

class JwtStrategy {
    public init = () => {
        
        passport.use("jwt", this.getStrategy())
        return passport.initialize()
    }

    public generateJwtToken = (id: string, tokenType: TokenType): string | undefined => {

         const jwtTokenGeneratorArray: JwtTokenGenerator[] = []
         jwtTokenGeneratorArray.push({tokenType : TokenType.SignIn, strategy : new SignInTokenStrategy() })
         jwtTokenGeneratorArray.push({tokenType : TokenType.ConfirmAccount, strategy : new ConfirmAccountTokenStrategy() })

        const tokenStrategy = jwtTokenGeneratorArray.map(item => {
            if (item.tokenType === tokenType) {
                return item.strategy.generateToken(id)
            }
            return
        }).filter(token => {
            return token
        })

       return tokenStrategy[0]
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
                    if (!user) {
                        return done(null, false, {
                            message: "The user in the token was not found"
                        })
                    }

                    return done(null, {
                        _id: user._id
                    })
                })
        })
    }
}

export default new JwtStrategy()