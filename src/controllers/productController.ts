/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, SUCCESS } from "../utils/statusCodes";
import { LIMIT_FILE_SIZE, SUCCESS_MSG } from "../utils/statusMessages";
import AppError from "../utils/appError";
import { IMAGE_UPLOAD_ERROR, LIMIT_FILE_SIZE_ERROR,
     NO_IMAGE_PROVIDED,WRONG_IMG_MIME,
     NAME_PRICE_IMGURL_REQUIRED, 
     PRODUCT_EXISTS,
     ERROR_ADDING_PRODUCT,
     ERROR_ADDING_IMAGE} from "../utils/errorMessages";
import uploadService from "../services/uploadService";
import productService from "../services/productService";
import {  PRODUCT_ADDED } from "../utils/successMessages";

class ProductController{
    
    addProduct = async  (req:Request,res:Response,next:NextFunction):Promise<any> =>{
        try{
            const { name, price ,imageUrl}: { name:string, price:number,imageUrl:string} = req.body;

            if(!name || !price ||!imageUrl) return next(new AppError(NAME_PRICE_IMGURL_REQUIRED,INTERNAL_SERVER_ERROR));

            if(productService.findProductByName(name) != null) return next(new AppError(PRODUCT_EXISTS,INTERNAL_SERVER_ERROR));

            const newProduct = await productService.addProduct({name,price,imageUrl});

            res.status(SUCCESS).json({
                status: SUCCESS_MSG,
                data:{
                     message: PRODUCT_ADDED,
                     newProduct,
                }
            });

        }catch(e){
            console.log(e.message);
            return next( new AppError(ERROR_ADDING_PRODUCT,INTERNAL_SERVER_ERROR));
        }
    }

    addProductImage = async (req:Request,res:Response,next:NextFunction):Promise<any> =>{
        try{                                    

            uploadService.writeToFolder(req,res,async (err: any)=>{                
                
                if(err) {this.handleWriteToFolderError(err,next)}
                else{   
                    
                 const fileName : string | undefined  = res?.req?.file?.filename;
                 
                 if(!fileName) return next(new AppError(NO_IMAGE_PROVIDED,BAD_REQUEST));

                 const imgPath = `${__dirname}./../uploads/${fileName}`;
                 
                 const imgCloudUrl = await uploadService.uploadToCloud(imgPath);

                 res.status(SUCCESS).json({
                     status: SUCCESS_MSG,
                     data:{                          
                          imageUrl:imgCloudUrl
                     }
                 })
                }
                
             });                 
            

        }catch(e){
            console.log(e.message);
            return next( new AppError(ERROR_ADDING_IMAGE,INTERNAL_SERVER_ERROR));
        }
    }

    handleWriteToFolderError = (err:any,next:NextFunction) =>{

        if(err.code == LIMIT_FILE_SIZE) return next(new AppError(LIMIT_FILE_SIZE_ERROR,BAD_REQUEST));
                    
        if(err.message == WRONG_IMG_MIME) return next(new AppError(WRONG_IMG_MIME,BAD_REQUEST));
                    
        return next(new AppError(IMAGE_UPLOAD_ERROR,BAD_REQUEST));
    }

}

export default new ProductController();