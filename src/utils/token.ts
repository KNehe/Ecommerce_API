import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import AppError from './appError';
import { BAD_REQUEST } from './statusCodes';
import { NO_JWT_SECRET_MSG , NO_JWT_EXPIRY_TIME_MSG} from './errorMessages';
dotenv.config({path:'./config.env'});

class TokenUtils{
    
    
    createJwt =  (id:number):string =>{

        const secret = process.env.JWT_SECRET;
        const jwtExpiryTime = process.env.JWT_EXPIRY_TIME;

        if (!secret) {
            throw new AppError(NO_JWT_SECRET_MSG,BAD_REQUEST);
          }

        if (!jwtExpiryTime) {
            throw new AppError(NO_JWT_EXPIRY_TIME_MSG,BAD_REQUEST);
          }

        return jwt.sign({id:id},secret,{ expiresIn: jwtExpiryTime})
    }

}

export default new TokenUtils();