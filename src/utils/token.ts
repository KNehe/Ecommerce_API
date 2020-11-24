import jwt from 'jsonwebtoken';
import AppError from './appError';
import {  INTERNAL_SERVER_ERROR } from './statusCodes';
import { NO_JWT_SECRET_MSG , NO_JWT_EXPIRY_TIME_MSG} from './errorMessages';

class TokenUtils{
    
    
    createJwt =  (id:string):string =>{

        const secret = process.env.JWT_SECRET;
        const jwtExpiryTime = process.env.JWT_EXPIRY_TIME;

        if (!secret) {
            throw new AppError(NO_JWT_SECRET_MSG,INTERNAL_SERVER_ERROR);
          }

        if (!jwtExpiryTime) {
            throw new AppError(NO_JWT_EXPIRY_TIME_MSG,INTERNAL_SERVER_ERROR);
          }

        return jwt.sign({id:id},secret,{ expiresIn: jwtExpiryTime})
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    decodeJwt = (token:string): any =>{
     try{
      const secret = process.env.JWT_SECRET;

      if (!secret) {
        throw new AppError(NO_JWT_SECRET_MSG,INTERNAL_SERVER_ERROR);
      }

      return jwt.verify(token,secret);

    }catch(error){
      return {error};
      }
    }

}

export default new TokenUtils();