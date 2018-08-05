import { IPasswordService } from "./interfaces/passwordService.interface"
import bcrypt from 'bcryptjs'

const ROUND = 10

export class PasswordService implements IPasswordService {
    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, ROUND)
    }
     async generateSalt(): Promise<string> {
        return await bcrypt.genSalt(ROUND)
    }
    async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword)
    }


}