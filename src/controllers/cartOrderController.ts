/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { Order } from "../interfaces/Order/order";
import authService from "../services/authService";
import cartOrderService from "../services/cartOrderService";
import productService from "../services/productService";
import AppError from "../utils/appError";
import { BAD_FORMAT_ID, ERROR_ADDING_TO_CART, ERROR_DELETING_CART, ERROR_FETCHING_CART, ERROR_MAKING_PAYMENT, ERROR_SAVING_ORDER, PAYMENT_DETAILS_REQUIRED, PAYPAL_TRANSACTION_FAILED, PRODUCT_ID_AND_USER_ID_QUANTITY_REQUIRED, PRODUCT_NOT_EXISTS, USER_WITH_ID_NOT_FOUND } from "../utils/errorMessages";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NO_CONTENT, SUCCESS } from "../utils/statusCodes";
import { SUCCESS_MSG } from "../utils/statusMessages";
import { ADDED_TO_CART_SUCCESSFULLY, ITEM_ALREADY_IN_CART } from "../utils/successMessages";
import validators from "../utils/validators";
import braintree from "braintree";
import crypto from 'crypto';

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

    flutterStripeOrderhandler  = async (req:Request,res:Response,next:NextFunction):Promise<any> =>{
        try{            
            const order: Order = req.body;
            const newOrder = await cartOrderService.addOrder(order);
           
            res.status(SUCCESS).json({
                status:SUCCESS_MSG,
                data: newOrder
            });

        }catch(e){
            console.log(e.message);
            return next( new AppError(ERROR_SAVING_ORDER,INTERNAL_SERVER_ERROR) );
        }
    }

    flutterPaypalRequesthandler  = async (req:Request,res:Response,next:NextFunction):Promise<any> =>{
        try{            
            const order: Order = req.body;
            const nonce:string = req.params.nonce;
            
            const gateway = new braintree.BraintreeGateway({
                environment: braintree.Environment.Sandbox,
                merchantId: process.env.BRAINTREE_MERCHANT_ID || '',
                publicKey: process.env.BRAINTREE_PUBLIC_KEY || '',
                privateKey: process.env.BRAINTREE_PRIVATE_KEY || ''
              });

            const orderId =crypto.randomBytes(32).toString('hex'); 

            const saleRequest = {
                amount: order.total,
                paymentMethodNonce: nonce,                
                orderId: orderId ,
                options: {
                  submitForSettlement: true,
                  }
              };

              const result = await gateway.transaction.sale(saleRequest);
              if(result.success){
                const newOrder = await cartOrderService.addOrder(order);

                res.status(SUCCESS).json({
                    status:SUCCESS_MSG,
                    data: newOrder
                });

              }else{
                  return next(new AppError(PAYPAL_TRANSACTION_FAILED,INTERNAL_SERVER_ERROR));
              }

        }catch(e){
            console.log(e.message);
            return next( new AppError(ERROR_SAVING_ORDER,INTERNAL_SERVER_ERROR) );
        }
    }

}

export default new CartOrderController();