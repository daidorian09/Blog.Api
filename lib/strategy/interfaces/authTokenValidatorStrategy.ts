export interface IAuthTokenValidatorStrategy {
    isAuthenticationTokenValid(user: string, token: string) : Promise<boolean>
}