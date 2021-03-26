/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import AppError from '../utils/appError';
import { SEND_EMAIL_ERROR } from '../utils/errorMessages';
import { INTERNAL_SERVER_ERROR } from '../utils/statusCodes';
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;



class MailService{
    
    private createTransporter = async () => {
      const oauth2Client = new OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
      );
    
      oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN
      });
    
      const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err:any, token:any) => {
          if (err) {
            reject();
          }
          resolve(token);
        });
      });
    
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.EMAIL,
          accessToken,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN
        }
      } as SMTPTransport.Options);
    
      return transporter;
    };
    
    sendEmail = async (to:string,message:string,subject:string):Promise<any> =>{
      
      try{
        let emailTransporter = await this.createTransporter();
        const emailOptions = {
          from:process.env.EMAIL,
          to,
          subject,
          html: message,
        };
        
        await emailTransporter.sendMail(emailOptions);
      }catch(error){
        console.log("NODE MAILER ERROR", error);
        return new AppError(SEND_EMAIL_ERROR,INTERNAL_SERVER_ERROR)
      }
    //   return new Promise((resolve, reject) => {
      
    //   const transporter = nodemailer.createTransport({
    //     service:'gmail',
    //     port: process.env.EMAIL_PORT,
    //     secure: true,
    //     auth: {
    //       user: process.env.EMAIL_AUTH_USERNAME,
    //       pass: process.env.EMAIL_AUTH_PASSWORD,
    //     },
    //   } as SMTPTransport.Options);

    //    const mailOptions = {
    //       from:process.env.EMAIL_FROM,
    //       to,
    //       subject,
    //       html: message,
    //     };

      
    //     // eslint-disable-next-line no-unused-vars
    //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //     transporter.sendMail(mailOptions, (err, data) => {
    //       if (err) {
    //         // eslint-disable-next-line prefer-promise-reject-errors
    //         reject(err);
    //       }
    //       resolve(true);
    //     });
      
    // }).catch(function(error) {
    //   console.log("NODE MAILER ERROR", error);
    //   return new AppError(SEND_EMAIL_ERROR,INTERNAL_SERVER_ERROR);
    // });

    }

}

export default new MailService();