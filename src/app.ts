import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import userRoutes from '././routes/userRoutes';
import { NOT_FOUND } from './utils/statusCodes';
import cors from 'cors';

const app = express();

app.use(express.json());

if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'));
  }

app.use(cors());

app.use("/api/v1/users",userRoutes);

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