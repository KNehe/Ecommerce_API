/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { Order } from "../interfaces/Order/order";
import authService from "../services/authService";
import cartOrderService from "../services/cartOrderService";
import productService from "../services/productService";
import AppError from "../utils/appError";
import { BAD_FORMAT_ID, ERROR_ADDING_TO_CART, ERROR_DELETING_CART, ERROR_FETCHING_CART, ERROR_SAVING_ORDER, PAYPAL_TRANSACTION_FAILED, PRODUCT_ID_AND_USER_ID_QUANTITY_REQUIRED, PRODUCT_NOT_EXISTS, STRIPE_TRANSACTION_FAILED, USER_ID_REQUIRED, USER_WITH_ID_NOT_FOUND } from "../utils/errorMessages";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NO_CONTENT, SUCCESS } from "../utils/statusCodes";
import { SUCCESS_MSG } from "../utils/statusMessages";
import { ADDED_TO_CART_SUCCESSFULLY, ITEM_ALREADY_IN_CART } from "../utils/successMessages";
import validators from "../utils/validators";
import braintree from "braintree";
import crypto from 'crypto';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


class CartOrderController{

    addToCart = async (req:Request,res:Response,next:NextFunction):Promise<any> =>{
        try{
            const {productId,userId,quantity} :{ productId:string, userId:string,quantity:number} = req.body;

            if(!productId || !userId || !quantity) return next( new AppError(PRODUCT_ID_AND_USER_ID_QUANTITY_REQUIRED,BAD_REQUEST) );

            if(!validators.isObjectIdValid(productId) || !validators.isObjectIdValid(userId)) 
                return next( new AppError(BAD_FORMAT_ID,BAD_REQUEST));

            if(!await productService.findProductById(productId))  return next( new AppError(PRODUCT_NOT_EXISTS,BAD_REQUEST) );

            if(! await authService.findUserById(userId)) return next( new AppError(USER_WITH_ID_NOT_FOUND,BAD_REQUEST) );
            if(await cartOrderService.findCartItemByProductIdAnduserId(productId,userId) != null){
                res.status(CREATED).json({
                    status: SUCCESS_MSG,
                    message: ITEM_ALREADY_IN_CART
                });
            }else{
                console.log('new');
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
            const userId:string = req.params.userid;
             
            if(!userId) return next( new AppError(USER_ID_REQUIRED,BAD_REQUEST) );

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
            const userId:string = req.params.userid;

            if(!userId) return next( new AppError(USER_ID_REQUIRED,BAD_REQUEST) );

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

    saveOrderHandler  = async (req:Request,res:Response,next:NextFunction):Promise<any> =>{
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

    paypalOrderRequestHandler  = async (req:Request,res:Response,next:NextFunction):Promise<any> =>{
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

    getOrders = async (req:Request,res:Response,next:NextFunction):Promise<any> =>{
        try{
            const userId:string = req.params.userid;
             
            if(!userId) return next( new AppError(USER_ID_REQUIRED,BAD_REQUEST) );

            if(!validators.isObjectIdValid(userId)) return next( new AppError(BAD_FORMAT_ID,BAD_REQUEST));
            
            const orders = await cartOrderService.getOrdersByUserId(userId);
           
            res.status(SUCCESS).json({
                status: SUCCESS_MSG,
                data:{ orders }
            });
            
        }catch(e){
            console.log(e.message);
            return next( new AppError(ERROR_FETCHING_CART,INTERNAL_SERVER_ERROR) );
        }
    }

    stripeOrderRequestHandler  = async (req:Request,res:Response,next:NextFunction):Promise<any> =>{
        try{            
            const order: Order = req.body;
            const id:string = req.params.stripeid;

            const payment = await stripe.paymentIntents.create({
                amount: parseInt(order.total),
                currency: 'USD',
                description: 'Payment for item on Ntrade',
                payment_method: id,
                confirm: true
            })  
                        
            if(payment.status === 'succeeded'){
                const newOrder = await cartOrderService.addOrder(order);

                res.status(SUCCESS).json({
                    status:SUCCESS_MSG,
                    data: newOrder
                });

            }else{
                  return next(new AppError(STRIPE_TRANSACTION_FAILED,INTERNAL_SERVER_ERROR));
            }

        }catch(e){
            console.log(e.message);
            return next( new AppError(ERROR_SAVING_ORDER,INTERNAL_SERVER_ERROR) );
        }
    }

  

}

export default new CartOrderController();