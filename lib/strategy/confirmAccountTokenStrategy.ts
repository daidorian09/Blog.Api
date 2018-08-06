import { ITokenGeneratorStrategy } from './interfaces/tokenGeneratorStrategy.interface'
import jwt, {  Secret } from 'jsonwebtoken'
require('dotenv').config()

export class ConfirmAccountTokenStrategy implements ITokenGeneratorStrategy {
    generateToken(id: string): string {
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
}
