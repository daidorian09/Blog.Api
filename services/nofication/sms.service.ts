import { AbstractSmsNotification } from '../interfaces/factory/abstractSmsNotification.interface'

export class SmsService implements AbstractSmsNotification {
    sendSms(token: string, receiver : string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}