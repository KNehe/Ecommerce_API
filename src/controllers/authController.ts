/* eslint-disable @typescript-eslint/no-explicit-any */
import {NextFunction, Request, Response} from 'express';
import {BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NO_CONTENT, SUCCESS,UNAUTHORISED} from './../utils/statusCodes';
import {SUCCESS_MSG} from './../utils/statusMessages';
import AppError from './../utils/appError';

import { 
    INVALID_CREDENTIALS,
    NO_EMPTY_FIELD, 
    SIGN_UP_ERR_MSG, 
    USER_WITH_EMAIL_EXISTS_MSG,
    SIGN_IN_ERR_MSG,
    USER_WITH_ID_NOT_FOUND,
    DELETE_USER_MSG,
    BAD_FORMAT_ID,
    ATLEAST_ONE_FIELD_REQUIRED,
    UPDATE_USER_ERR_MSG,
    EMAIL_REQUIRED,
    USER_WITH_EMAIL_NOT_EXISTS,
    SEND_RESET_PASSWORD_EMAIL_ERR,
    PASSWORD_REQUIRED_FOR_RESET,
    PASSWORD_RESET_TOKEN_REQUIRED,
    PASSWORD_RESET_TOKEN_INVALID,
    PASSWORD_RESET_TOKEN_EXPIRED,
    RESET_PASSWORD_ERR} from './../utils/errorMessages';

import authService from './../services/authService';
import tokenUtils from './../utils/token';
import passwordUtils from './../utils/password';
import validators from '../utils/validators';
import {PASSWORD_RESET_SUCCESSFULLY_MSG, RESET_PASSWORD_REQUEST_MSG, RESET_PASSWORD_SUBJECT, SIGN_UP_THANK_YOU, SIGN_UP_THANK_YOU_SUBJECT } from '../utils/successMessages';
import mailService from './../services/mailService';


class AuthController{

    signUp = async (req:Request,res:Response,next:NextFunction):Promise<any> =>{
        try{
            const { name, email, password }: { name:string, email:string, password:string} = req.body;

            if(!name.trim() || !email.trim() || !password) return next( new AppError(NO_EMPTY_FIELD,BAD_REQUEST) );

            if(await authService.findUserByEmail(email) != null)
                           return next( new AppError(USER_WITH_EMAIL_EXISTS_MSG,BAD_REQUEST) );

           const newUser = await authService.signUp(
            name,
               email,
               password
            );

            const token = tokenUtils.createJwt(newUser._id);

            await mailService.sendEmail(email,SIGN_UP_THANK_YOU,SIGN_UP_THANK_YOU_SUBJECT);

            res.status(CREATED).json({
                status: SUCCESS_MSG,
                data:{ 
                    token,
                    user: {
                        id:newUser._id,
                        name:newUser.name,
                        email:newUser.email,
                        role:newUser.role,
                        createdAt:newUser.createdAt
                    }
                }
            });

        }catch(e){
            console.log(e.message);
            return next( new AppError(SIGN_UP_ERR_MSG,INTERNAL_SERVER_ERROR));
        }

    }

    signIn = async (req:Request,res:Response,next:NextFunction):Promise<any> =>{
        try{
            const { email, password } : {email:string, password:string} = req.body;

            if(!email.trim() || !password) return next( new AppError(NO_EMPTY_FIELD,BAD_REQUEST) );

            const user = await authService.findUserByEmail(email);

            if(!user || !( await passwordUtils.correctPassword(password,user.password)))
                return next(new AppError(INVALID_CREDENTIALS,UNAUTHORISED));

            const token = tokenUtils.createJwt(user._id);

            res.status(SUCCESS).json({
                status:SUCCESS_MSG,
                data:{
                    id:user._id,
                    name:user.name,
                    role:user.role,
                    token                    
                }
            });

        }catch(e){
            console.log(e.message);
            return next( new AppError(SIGN_IN_ERR_MSG,INTERNAL_SERVER_ERROR));
        }
    }
    
    deleteUser = async (req:Request,res:Response,next:NextFunction):Promise<any> =>{
        try{
        const id : string = req.params.id.trim();
        
        if(!validators.isObjectIdValid(id)) return next( new AppError(BAD_FORMAT_ID,BAD_REQUEST));

        if(!await authService.findUserById(id)) return next( new AppError(USER_WITH_ID_NOT_FOUND,BAD_REQUEST));

        await authService.deleteUser(id);

        res.status(NO_CONTENT).json({ 
            status: SUCCESS,
            data: null
        });
        
      }catch(e){
        console.log(e.message);
        return next( new AppError(DELETE_USER_MSG,INTERNAL_SERVER_ERROR));
      }
    }
    
    updateName = async(req:Request,res:Response,next:NextFunction):Promise<any> =>{
        try{
        const id : string = req.params.id.trim();
        
        if(!validators.isObjectIdValid(id)) return next( new AppError(BAD_FORMAT_ID,BAD_REQUEST));

        if(!await authService.findUserById(id)) return next( new AppError(USER_WITH_ID_NOT_FOUND,BAD_REQUEST));    

        const {name}: {name:string} = req.body;

        if( !name?.trim()) return next( new AppError(ATLEAST_ONE_FIELD_REQUIRED,BAD_REQUEST));
    
        const updatedUser = await authService.updateName(id,name);

        res.status(SUCCESS).json({
            status:SUCCESS_MSG,
            data:{
                id:updatedUser._id,
                name:updatedUser.name,
                email:updatedUser.email,
                role:updatedUser.role 
            }
        });

       }catch(e){
        console.log(e.message);
        return next( new AppError(UPDATE_USER_ERR_MSG,INTERNAL_SERVER_ERROR));
       }

    }

    forgotPassword = async(req:Request, res:Response,next:NextFunction):Promise<any> =>{
        try{
            const {email}: {email:string} = req.body;

            if( !email?.trim()) return next( new AppError(EMAIL_REQUIRED,BAD_REQUEST));

            const user = await authService.findUserByEmail(email);

            if(!user) return next( new AppError(USER_WITH_EMAIL_NOT_EXISTS,BAD_REQUEST) );

            const resetToken = user.createPasswordResetToken();
            await user.save({ validateBeforeSave:false});

            const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`;

            const message = `Forgot your password? Click to reset password ${resetUrl} . If you dint forget password please ignore this email`;
            
            await mailService.sendEmail(email,message,RESET_PASSWORD_SUBJECT);

            res.status(SUCCESS).json({
                status:SUCCESS_MSG,
                message: RESET_PASSWORD_REQUEST_MSG
            });        

        
        }catch(e){
        console.log(e.message);
        return next( new AppError(SEND_RESET_PASSWORD_EMAIL_ERR,INTERNAL_SERVER_ERROR));
       }
    }

    resetPassword = async(req:Request, res:Response,next:NextFunction):Promise<any> =>{
        try{
            const {password}: {password:string} = req.body;
            const resetToken : string = req.params.resetToken;

            if( !password?.trim()) return next( new AppError(PASSWORD_REQUIRED_FOR_RESET,BAD_REQUEST));

            if( !resetToken?.trim()) return next( new AppError(PASSWORD_RESET_TOKEN_REQUIRED,BAD_REQUEST));
            
            const user = await authService.findUserByResetToken(resetToken);
            
            if(!user) return next( new AppError(PASSWORD_RESET_TOKEN_INVALID,BAD_REQUEST));
            
            if(new Date() > user.passwordResetExpires) return next( new AppError(PASSWORD_RESET_TOKEN_EXPIRED,BAD_REQUEST));
            
            user.password = password;

            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;

            await user.save({validateBeforeSave:false});

            res.status(SUCCESS).json({
                status:SUCCESS_MSG,
                message: PASSWORD_RESET_SUCCESSFULLY_MSG
            });        

        
        }catch(e){
        console.log(e.message);
        return next( new AppError(RESET_PASSWORD_ERR,INTERNAL_SERVER_ERROR));
       }
    }

}

export default new AuthController();