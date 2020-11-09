/* eslint-disable @typescript-eslint/no-explicit-any */
import Product from "../models/product";

class ProductService{

    addProduct =  async (data:any):Promise<any> =>{
        return await Product.create({...data});
    }

    findProductById = async (productId:number) :Promise<any> =>{
        return await Product.findById(productId);
    }

    updateProduct = async (productId:string,data:any):Promise<any> =>{
        return await Product.findByIdAndUpdate(productId,{...data},{new:true,useFindAndModify:false});
    }

    findProductByName = async (name:string):Promise<any> =>{
        return await Product.findOne({name});
    }

}

export default new ProductService();