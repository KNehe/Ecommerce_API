/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import authService from "../services/authService";
import cartOrderService from "../services/cartOrderService";
import productService from "../services/productService";
import AppError from "../utils/appError";
import { BAD_FORMAT_ID, ERROR_ADDING_TO_CART, ERROR_DELETING_CART, ERROR_FETCHING_CART, PRODUCT_ID_AND_USER_ID_QUANTITY_REQUIRED, PRODUCT_NOT_EXISTS, USER_WITH_ID_NOT_FOUND } from "../utils/errorMessages";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NO_CONTENT, SUCCESS } from "../utils/statusCodes";
import { SUCCESS_MSG } from "../utils/statusMessages";
import { ADDED_TO_CART_SUCCESSFULLY, ITEM_ALREADY_IN_CART } from "../utils/successMessages";
import validators from "../utils/validators";

class CartOrderController{

    addToCart = async (req:Request,res:Response,next:NextFunction):Promise<any> =>{
        try{
            const {productId,userId,quantity} :{ productId:string, userId:string,quantity:number} = req.body;

            if(!productId || !userId || !quantity) return next( new AppError(PRODUCT_ID_AND_USER_ID_QUANTITY_REQUIRED,BAD_REQUEST) );

            if(!validators.isObjectIdValid(productId) || !validators.isObjectIdValid(userId)) 
                return next( new AppError(BAD_FORMAT_ID,BAD_REQUEST));

            if(!await productService.findProductById(productId))  return next( new AppError(PRODUCT_NOT_EXISTS,BAD_REQUEST) );

            if(! await authService.findUserById(userId)) return next( new AppError(USER_WITH_ID_NOT_FOUND,BAD_REQUEST) );

            if(await cartOrderService.findCartItemByProductId(productId) != null){
                res.status(CREATED).json({
                    status: SUCCESS_MSG,
                    message: ITEM_ALREADY_IN_CART
                });
            }else{
            const newCartItem = await cartOrderService.addToCart(productId,userId,quantity);

            if(!newCartItem) return next( new AppError(ERROR_ADDING_TO_CART,INTERNAL_SERVER_ERROR) );

            res.status(CREATED).json({
                status: SUCCESS_MSG,
                message: ADDED_TO_CART_SUCCESSFULLY
            });
        }
            
        }catch(e){
            console.log(e.message);
            return next( new AppError(ERROR_ADDING_TO_CART,INTERNAL_SERVER_ERROR) );
        }
    }

    getCart = async (req:Request,res:Response,next:NextFunction):Promise<any> =>{
        try{
            const {userId} :{userId:string} = req.body;

            if(!userId) return next( new AppError(PRODUCT_ID_AND_USER_ID_QUANTITY_REQUIRED,BAD_REQUEST) );

            if(!validators.isObjectIdValid(userId)) return next( new AppError(BAD_FORMAT_ID,BAD_REQUEST));

            if(!await authService.findUserById(userId)) return next( new AppError(USER_WITH_ID_NOT_FOUND,BAD_REQUEST) );
            
            const cart = await cartOrderService.fetchCart(userId);
           
            res.status(SUCCESS).json({
                status: SUCCESS_MSG,
                data:{ cart }
            });
            
        }catch(e){
            console.log(e.message);
            return next( new AppError(ERROR_FETCHING_CART,INTERNAL_SERVER_ERROR) );
        }
    }

    deleteCart = async (req:Request,res:Response,next:NextFunction):Promise<any> =>{
        try{
            const {userId} :{userId:string} = req.body;

            if(!userId) return next( new AppError(PRODUCT_ID_AND_USER_ID_QUANTITY_REQUIRED,BAD_REQUEST) );

            if(!validators.isObjectIdValid(userId)) return next( new AppError(BAD_FORMAT_ID,BAD_REQUEST));

            if(!await authService.findUserById(userId)) return next( new AppError(USER_WITH_ID_NOT_FOUND,BAD_REQUEST) );
            
            const cart = await cartOrderService.deleteCart(userId);

            if(!cart) return next( new AppError(ERROR_DELETING_CART,INTERNAL_SERVER_ERROR) );
           
            res.status(NO_CONTENT).json({
                status: SUCCESS_MSG
            });
            
        }catch(e){
            console.log(e.message);
            return next( new AppError(ERROR_DELETING_CART,INTERNAL_SERVER_ERROR) );
        }
    }

}

export default new CartOrderController();