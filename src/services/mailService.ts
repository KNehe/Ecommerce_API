/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import AppError from '../utils/appError';
import { SEND_EMAIL_ERROR } from '../utils/errorMessages';
import { INTERNAL_SERVER_ERROR } from '../utils/statusCodes';

class MailService{

    sendEmail = async (to:string,message:string,subject:string):Promise<any> =>{
      
    
      return new Promise((resolve, reject) => {
      
      const transporter = nodemailer.createTransport({
        service:'gmail',
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
          user: process.env.EMAIL_AUTH_USERNAME,
          pass: process.env.EMAIL_AUTH_PASSWORD,
        },
      } as SMTPTransport.Options);

       const mailOptions = {
          from:process.env.EMAIL_FROM,
          to,
          subject,
          html: message,
        };

      
        // eslint-disable-next-line no-unused-vars
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        transporter.sendMail(mailOptions, (err, data) => {
          if (err) {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject(err);
          }
          resolve(true);
        });
      
    }).catch(function(error) {
      console.log("NODE MAILER ERROR", error);
      return new AppError(SEND_EMAIL_ERROR,INTERNAL_SERVER_ERROR);
    });

    }

}

export default new MailService();