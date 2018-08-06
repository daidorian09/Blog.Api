export interface ITokenGeneratorStrategy {
    generateToken(id : string) : string
}