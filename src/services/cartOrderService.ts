/* eslint-disable @typescript-eslint/no-explicit-any */
import Cart from "../models/cart";

class CartOrderService{

    addToCart = async (productId:string,userId:string,quantity:number):Promise<any> =>{
        return await Cart.create({productId,userId,quantity})
    }

    findCartItemByProductId = async (productId:string): Promise<any> =>{
        return await Cart.findOne({productId});
    }

    fetchCart = async (userId:string): Promise<any> =>{
        return await Cart.find({userId},'-_id').populate('productId').select('productId');
    }

    deleteCart = async (userId:string): Promise<any> =>{
        return await Cart.deleteMany({userId});
    }

}

export default new CartOrderService();
