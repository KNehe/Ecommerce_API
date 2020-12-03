/* eslint-disable @typescript-eslint/no-explicit-any */
import { BAD_REQUEST } from "../utils/statusCodes";
import multer from 'multer';
import path from 'path';
import { WRONG_IMG_MIME } from "../utils/errorMessages";
import AppError from "./../utils/appError";
import cloudinary from 'cloudinary';
import CloudinaryStorage from 'multer-storage-cloudinary';

class  UploadService{

private cloudinaryInstance = cloudinary.v2;

private maxSize = 1 * 1000 *1000;

private cloudinaryStorage = CloudinaryStorage({
  cloudinary: this.cloudinaryInstance,
  params: {
    folder: 'ecommerce_app_images'
  },
});


constructor(){
  this.cloudinaryInstance.config({ 
      cloud_name: process.env.CLOUD_NAME, 
      api_key: process.env.CLOUDINARY_API_KEY, 
      api_secret: process.env.CLOUDINARY_API_SECRET 
    });
}

public cloudinaryUploader = multer({ 
    storage: this.cloudinaryStorage ,
    limits: { fileSize:this.maxSize},
        fileFilter: (req,file,cb)=>{
            
            const fileTypes = /jpeg|jpg|png|mkv/; 
            const mimetype = fileTypes.test(file.mimetype);
            const extName  = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());                 
           
            if (mimetype && extName) {           
                return cb(null,true); 
            }else{
                cb(new AppError(WRONG_IMG_MIME,BAD_REQUEST));                        
            }
        }

}).single('image');


// private storage = multer.diskStorage({
//     destination: (req,file,cb)=>{  
//         cb(null,`${__dirname}./../uploads`);
//     },
//     filename:  (req,file,cb)=>{    
                      
//         cb(null,file.fieldname + '_' + Date.now() + '.jpg');                
//     }
// });  

// writeToFolder = multer({
//     storage:this.storage,
//     limits: { fileSize:this.maxSize},
//     fileFilter: (req,file,cb)=>{
        
//         const fileTypes = /jpeg|jpg|png|mkv/; 
//         const mimetype = fileTypes.test(file.mimetype);
//         const extName  = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());                 
       
//         if (mimetype && extName) {           
//             return cb(null,true); 
//         }else{
//             cb(new AppError(WRONG_IMG_MIME,BAD_REQUEST));                        
//         }
//     }
// }).single('image');


// uploadToCloud = async ( pathToFile:any ):Promise<any> =>{

//     const uploadResult =
//      await this.cloudinaryInstance.uploader.upload(pathToFile, { tags: 'logo', folder:'ecommerce_app_images', use_filename:true }, 
//      function (err) {
//          //console.log("Iamge upload error: ",err);
//         if (err) return new AppError(IMAGE_UPLOAD_ERROR,INTERNAL_SERVER_ERROR);
//       });
//       //console.log("up", uploadResult)
//       const {url} = uploadResult;

//       return url;
//   }
 

}

export default new UploadService();