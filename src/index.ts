import mongoose from 'mongoose';
import dotenv from 'dotenv';

process.on("uncaughtException", err=>{
  console.log("Uncaught exception shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({path:'.env'});

import app from './app';

const DB  = process.env.DATABASE || '';

mongoose.connect(DB,{
  useNewUrlParser:true,
  useCreateIndex:true,
  useFindAndModify:true,
  useUnifiedTopology:true
})
.then(()=>{
  console.log("⚡️ DB connection successfull...");
});


const PORT = Number(process.env.PORT || 8080);


const server = app.listen(PORT, () => {
  console.log(`⚡️[Server]: is running at http://localhost:${PORT}`);
});

process.on('unhandledRejection',err=>{
  console.log("Unhanlded rejection shutting down ...",err);
  server.close(()=>{
    process.exit(1);
  });
});