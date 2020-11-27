/* eslint-disable @typescript-eslint/no-explicit-any */
import {NextFunction, Request, Response} from 'express';
import {BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NO_CONTENT, SUCCESS,UNAUTHORISED} from './../utils/statusCodes';
import {AUTHORISED_MSG, JWT_IS_VALID, SUCCESS_MSG, UNAUTHORISED_MSG} from './../utils/statusMessages';
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
    RESET_PASSWORD_ERR,
    JWT_TOKEN_NOT_FOUND,
    INVALID_JWT_TOKEN,
    USER_ASSOCIATED_WITH_TOKEN_NOT_FOUND,
    ROLE_NOT_ALLOWED,
    INVALID_EMAIL,
    SHORT_PASSWORD,
    WEAK_PASSWORD,
    NAME_NOT_FOUND,
    EMAIL_NOT_FOUND} from './../utils/errorMessages';

import authService from './../services/authService';
import tokenUtils from './../utils/token';
import passwordUtils from './../utils/password';
import validators from '../utils/validators';
import {PASSWORD_RESET_SUCCESSFULLY_MSG, RESET_PASSWORD_REQUEST_MSG, RESET_PASSWORD_SUBJECT, SIGN_UP_THANK_YOU, SIGN_UP_THANK_YOU_SUBJECT } from '../utils/successMessages';
import mailService from './../services/mailService';
import { EMAIL_PASSWORD } from '../utils/authStrategy';
import { UserDocument } from '../interfaces/models/userDocument';


class AuthController{

    signUp = async (req:Request,res:Response,next:NextFunction):Promise<any> =>{
        try{
            const { name, email, password }: { name:string, email:string, password:string} = req.body;

            if(!name.trim() || !email.trim() || !password) return next( new AppError(NO_EMPTY_FIELD,BAD_REQUEST) );
            
            if(!validators.isEmailValid(email)) return next( new AppError(INVALID_EMAIL,BAD_REQUEST));

            if(!validators.isPasswordLong(password)) return next( new AppError(SHORT_PASSWORD,BAD_REQUEST));

            if(!validators.isPasswordStrong(password)) return next( new AppError(WEAK_PASSWORD,BAD_REQUEST));

            if(await authService.findUserByEmail(email) != null)
                return next( new AppError(USER_WITH_EMAIL_EXISTS_MSG,BAD_REQUEST) );

           const newUser = await authService.signUp(
            name,
               email,
               password,
               EMAIL_PASSWORD
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
                    token,
                    user:{
                        id:user._id,
                        name:user.name,
                        email:user.email,
                        role:user.role,  
                    }                  
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

        if( !name?.trim()) return next( new AppError(NAME_NOT_FOUND,BAD_REQUEST));
    
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

    facebookAuth = async(req:Request, res:Response,next:NextFunction): Promise<any> =>{
        try{

        req.currentUser = req.user as UserDocument;
        
        const token = tokenUtils.createJwt(req.currentUser._id);

        res.status(SUCCESS).json({
            status:SUCCESS_MSG,
            data:{
                token,
                user:{
                    id:req.currentUser._id,
                    name:req.currentUser.name,
                    email:req.currentUser.email,
                    role:req.currentUser.role                     
                }                   
            }
        });

        }catch(e){
            console.log(e.message);
            return next( new AppError(SIGN_IN_ERR_MSG,INTERNAL_SERVER_ERROR));
        }
    }
    
    googleAuth = async(req:Request, res:Response,next:NextFunction): Promise<any> =>{
        try{
            req.currentUser = req.user as UserDocument;
            
            const token = tokenUtils.createJwt(req.currentUser._id);
    
            res.status(SUCCESS).json({
                status:SUCCESS_MSG,
                data:{
                    token,
                    user:{
                        id:req.currentUser._id,
                        name:req.currentUser.name,
                        email:req.currentUser.email,
                        role:req.currentUser.role,
                        
                    }                  
                }
            });
    
            }catch(e){
                console.log(e.message);
                return next( new AppError(SIGN_IN_ERR_MSG,INTERNAL_SERVER_ERROR));
            }
    }

    protectRoute =  async(req:Request, res:Response,next:NextFunction): Promise<any> =>{
        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
            token = req.headers.authorization.split(' ')[1];
        
        if(!token) return next( new AppError(JWT_TOKEN_NOT_FOUND, BAD_REQUEST) );

        const {id, error} =  tokenUtils.decodeJwt(token);

        if(error) return next(new AppError(INVALID_JWT_TOKEN,BAD_REQUEST));

        const user = await authService.findUserById(id);

        if(!user) return next(new AppError(USER_ASSOCIATED_WITH_TOKEN_NOT_FOUND,BAD_REQUEST));

        req.currentUser = user;
        
        next();
    }

    restrictRoute = (roles:string[]) =>{

        return async(req:Request, res:Response,next:NextFunction): Promise<any> =>{
            
            const userRole = req.currentUser.role || '';  

            if(!roles.includes(userRole)){
                next( new AppError(ROLE_NOT_ALLOWED,UNAUTHORISED));
            }

            next();

        }
    }

    sendNewOauthUserEMail = async (email:string):Promise<any> =>{
        await mailService.sendEmail(email,SIGN_UP_THANK_YOU,SIGN_UP_THANK_YOU_SUBJECT);
    }


    checkTokenExpiry = async(req:Request, res:Response,next:NextFunction):Promise<any> =>{
        const {token }: {token:string} = req.body;

        if(!token) return next( new AppError(JWT_TOKEN_NOT_FOUND, BAD_REQUEST) );

        const {error} =  tokenUtils.decodeJwt(token);

        if(error){
            res.status(UNAUTHORISED).json({
                status: UNAUTHORISED_MSG,
                message:INVALID_JWT_TOKEN
            });
        }else{
            res.status(SUCCESS).json({
                status: AUTHORISED_MSG,
                message:JWT_IS_VALID
            });
        }
        
    }

    updateEmail = async(req:Request,res:Response,next:NextFunction):Promise<any> =>{
        try{
        const id : string = req.params.id.trim();
        
        if(!validators.isObjectIdValid(id)) return next( new AppError(BAD_FORMAT_ID,BAD_REQUEST));

        if(!await authService.findUserById(id)) return next( new AppError(USER_WITH_ID_NOT_FOUND,BAD_REQUEST));    

        const {email}: {email:string} = req.body;

        if( !email?.trim()) return next( new AppError(EMAIL_NOT_FOUND,BAD_REQUEST));
    
        const updatedUser = await authService.updateEmail(id,email);

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
        

}

export default new AuthController();