export interface IPasswordService {
    
    hashPassword(password : string, salt : string) : Promise<string>

    generateSalt() : Promise<string>

    validatePassword(password : string, hashedPassword : string) : Promise<boolean>
}