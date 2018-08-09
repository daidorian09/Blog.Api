export interface AbstractEmailNotification {
   sendEmail(token : string, receiver : string) : Promise<void>
}