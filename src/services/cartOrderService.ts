/* eslint-disable @typescript-eslint/no-explicit-any */
import { Order } from "../interfaces/Order/order";
import Cart from "../models/cart";
import OrderModel from "../models/order";

class CartOrderService{

    addToCart = async (productId:string,userId:string,quantity:number):Promise<any> =>{
        return await Cart.create({product:productId,user:userId,quantity})
    }

    findCartItemByProductIdAnduserId = async (productId:string,userId:string): Promise<any> =>{
        const res = await Cart.find({ product: productId , user: userId  }).exec();
        return res.length == 0 ? null : res;
    }

    fetchCart = async (userId:string): Promise<any> =>{
        return await Cart.find({ user: userId})
                 .populate({
                     path: 'product'
                    }).exec();
    }

    deleteCart = async (userId:string): Promise<any> =>{
        return await Cart.deleteMany({user:userId});
    }

    addOrder = async(order:Order): Promise<any> =>{
        return await OrderModel.create({...order});
    }

    getOrdersByUserId = async (userId:string):Promise<any> =>{
        return await OrderModel.find({userId}).sort({'dateOrdered': -1});
    }

}

export default new CartOrderService();
