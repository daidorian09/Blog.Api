import { AbstractEmailNotification } from '../interfaces/factory/abstractEmailNotification.interface'
require('dotenv').config()
import { readFile } from 'fs'
import path from 'path'
import { promisify } from 'util'
import mailer from 'nodemailer'
import { parse } from 'url';
import handlebars from 'handlebars'

export class EmailService implements AbstractEmailNotification {
    async sendEmail(token: string, receiver : string): Promise<void> {

        const readEmailTemplate = promisify(readFile)

        const templateDirectory = path.join(__dirname, '/template/email.html')

        const html = await readEmailTemplate(templateDirectory, 'utf-8') 

        const emailTransport = mailer.createTransport({
            port: parseInt(<string>process.env.EMAIL_PORT),
            host: process.env.EMAIL_HOST,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            },
            secure: process.env.EMAIL_SECURE === 'true'
        })

        const compiledTemplate = handlebars.compile(html)

        const replacement = {
            confirmationAccountEndpoint : `${process.env.CONFIRMATION_TOKEN_FRONTEND_ENDPONT}/${token}`
        }

        const template = compiledTemplate(replacement)

        const emailConfig = {
            from: process.env.EMAIL_USERNAME,
            to: receiver,
            subject: process.env.EMAIL_SUBJECT,
            html: template
          }

        await emailTransport.sendMail(emailConfig)
    }
}