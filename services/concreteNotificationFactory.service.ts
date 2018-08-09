import { AbstractNotificationFactory } from './interfaces/factory/abstractNotificationFactory.interface'
import { EmailService } from './nofication/email.service';
import { AbstractEmailNotification } from './interfaces/factory/abstractEmailNotification.interface';
import { AbstractSmsNotification } from './interfaces/factory/abstractSmsNotification.interface';
import { SmsService } from './nofication/sms.service';

export class ConcreteNotificationFactory implements AbstractNotificationFactory {    
    createEmailService() : AbstractEmailNotification {
        return new EmailService()
    }

    createSmsService() : AbstractSmsNotification {
        return new SmsService()
    }    
}