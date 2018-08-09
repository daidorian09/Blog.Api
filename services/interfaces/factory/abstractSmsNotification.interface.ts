export interface AbstractSmsNotification {
    sendSms(token : string, receiver : string) : Promise<void>
 }