/* eslint-disable @typescript-eslint/no-explicit-any */
import Cart from "../models/cart";

class CartOrderService{

    addToCart = async (productId:string,userId:string,quantity:number):Promise<any> =>{
        return await Cart.create({product:productId,user:userId,quantity})
    }

    findCartItemByProductId = async (productId:string): Promise<any> =>{
        return await Cart.findOne({product:productId});
    }

    fetchCart = async (userId:string): Promise<any> =>{
        return await Cart.find({ user: userId})
                 .populate({
                     path: 'product'
                    }).exec();
    }

    deleteCart = async (userId:string): Promise<any> =>{
        return await Cart.deleteMany({userId});
    }

}

export default new CartOrderService();
