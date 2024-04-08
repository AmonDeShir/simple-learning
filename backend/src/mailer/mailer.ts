import sgMail from "@sendgrid/mail";
import pug from "pug";
import fs from 'fs';
import { Config } from "../config/config";


sgMail.setApiKey(Config.email);

type MailerOptions = {
  to: string,
  subject: string,
  template: MailTemplates,
}

type MailTemplates = 
  { type: "reset-password", args: { url: string }} |
  { type: "authenticate-account", args: { url: string }};

const render = (filename: string, data: any) => {
  if(fs.existsSync(`${__dirname}/templates/${filename}.pug`)) {
    return pug.renderFile(`${__dirname}/templates/${filename}.pug`, data);
  }

  throw new Error(`Template ${filename}.pug not exist`);
}

export namespace Mailer {
  export const sendMail = ({to, subject, template}: MailerOptions) => {
    sgMail.send({
      from: "no-replay@simple-learning.pl",
      to,
      subject,
      html: render(template.type, template.args)
    })
  }

  export const sendResetPasswordMail = (to: string, token: string) => {
    sendMail({
      to,
      subject: "Reset your password",
      template: { 
        type: "reset-password", 
        args: {
          url: `${Config.urls.password_reset}/${encodeURI(token)}`
        } 
      }
    })
  }

  export const sendAuthenticateMail = (to: string, token: string) => {
    sendMail({
      to,
      subject: "Authenticate your account",
      template: { 
        type: "authenticate-account", 
        args: {
          url: `${Config.urls.emailConfirmation}/${token}`
        }
      }
    })
  }
}