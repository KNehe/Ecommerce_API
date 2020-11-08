/* eslint-disable @typescript-eslint/no-explicit-any */
import {NextFunction, Request, Response} from 'express';
import {BAD_REQUEST, INTERNAL_SERVER_ERROR, NO_CONTENT, SUCCESS,UNAUTHORISED} from './../utils/statusCodes';
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
    UPDATE_USER_ERR_MSG} from './../utils/errorMessages';

import authService from './../services/authService';
import tokenUtils from './../utils/token';
import passwordUtils from './../utils/password';
import validators from '../utils/validators';


class AuthController{

    signUp = async (req:Request,res:Response,next:NextFunction):Promise<any> =>{
        try{
            const { name, email, password }: { name:string, email:string, password:string} = req.body;

            if(!name.trim() || !email.trim() || !password){
                return next( new AppError(NO_EMPTY_FIELD,BAD_REQUEST) );
            }

            if(await authService.findUserByEmail(email) != null){
                return next( new AppError(USER_WITH_EMAIL_EXISTS_MSG,BAD_REQUEST) );
            }

           const newUser = await authService.signUp(
            name,
               email,
               password
            );

            const token = tokenUtils.createJwt(newUser._id);

            res.status(SUCCESS).json({
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

            if(!email.trim() || !password){
                return next( new AppError(NO_EMPTY_FIELD,BAD_REQUEST) );
            }

            const user = await authService.findUserByEmail(email);

            if(!user || !( await passwordUtils.correctPassword(password,user.password))){
                return next(new AppError(INVALID_CREDENTIALS,UNAUTHORISED));
            }

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
        const id : string = req.params.id;
        
        if(!validators.isObjectIdValid(id)){
            return next( new AppError(BAD_FORMAT_ID,BAD_REQUEST));
        }

        if(!await authService.findUserById(id)){
            return next( new AppError(USER_WITH_ID_NOT_FOUND,BAD_REQUEST));
        }

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
        const id : string = req.params.id;
        
        if(!validators.isObjectIdValid(id)){
            return next( new AppError(BAD_FORMAT_ID,BAD_REQUEST));
        }

        if(!await authService.findUserById(id)){
            return next( new AppError(USER_WITH_ID_NOT_FOUND,BAD_REQUEST));
        }

        const {name}: {name:string} = req.body;

        if( !name?.trim()){
            return next( new AppError(ATLEAST_ONE_FIELD_REQUIRED,BAD_REQUEST));
        }

    
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

}

export default new AuthController();