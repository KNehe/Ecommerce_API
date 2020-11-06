import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';

const app = express();

app.use(express.json());

if(process.env.NODE_ENV === "development"){
    app.use(morgan('dev'));
  }

app.get('/', (req,res) => res.send('Welcome to Nehemiah\'s Ecommerce API built using Express + TypeScript + MongoDB'));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    
    return res.status(400).json({
        error: err.message,
    });
 });


export default app;