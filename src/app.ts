import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import userRoutes from './routes/userRoutes';
import { BAD_REQUEST, NOT_FOUND } from './utils/statusCodes';
import cors from 'cors';
import productRoutes from './routes/productRoutes';
import cartOrderRoutes from './routes/cartOrderRoutes';
import {Strategy as FacebookStrategy} from 'passport-facebook';
import passport from 'passport';
import dotenv from 'dotenv';
import authService from './services/authService';
import AppError from './utils/appError';
import { FB_AUTH_FAILED, FB_EMAIL_REQUIRED } from './utils/errorMessages';
import { FACEBOOK_STRATEGY } from './utils/authStrategy';
dotenv.config({path:'.env'});
const app = express();

app.use(express.json());

if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'));
  }


app.use(cors());

passport.use( new FacebookStrategy({

  clientID: process.env.FACEBOOK_APP_ID || '',
  clientSecret: process.env.FACEBOOK_APP_SECRET || '',
  callbackURL: "http://localhost:3000/api/v1/users/auth/facebook",
  profileFields: ['id', 'emails', 'name'],
  
}, async(__, _,profile, cb)=>{
  try{
    const userMails = profile != null? profile.emails : null;

    if(! userMails || userMails?.length === 0)
      return new AppError(FB_EMAIL_REQUIRED,BAD_REQUEST);

    const user = await authService.findUserByEmail(userMails[0].value);

    if(!user){
      const name = profile.name?.givenName + " " + profile.name?.familyName;
      const user = await authService.createFaceBookUser(userMails[0].value,name,FACEBOOK_STRATEGY);
      return cb(null,user)
    }    
   cb(null,user);
  }catch(e){
    cb(e,false);
    return new AppError(FB_AUTH_FAILED,BAD_REQUEST);
  }
  
}));

app.use(passport.initialize());

app.use("/api/v1/users",userRoutes);
app.use("/api/v1/products",productRoutes);
app.use('/api/v1/cart',cartOrderRoutes);

app.all("*",(req:Request,res:Response,next:NextFunction)=>{
  res.status(NOT_FOUND).send(`${req.originalUrl} not found`);
  next();
});

//global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err:any, req: Request, res: Response, next: NextFunction) => {
    
    return res.status(400).json({
        status: err.status,
        message: err.message,
        statusCode: err.statusCode
        
    });
    next();
 });


export default app;