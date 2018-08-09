import { AbstractEmailNotification } from './abstractEmailNotification.interface'
import { AbstractSmsNotification } from './abstractSmsNotification.interface'

export interface AbstractNotificationFactory {
    createEmailService() : AbstractEmailNotification

    createSmsService() : AbstractSmsNotification
}