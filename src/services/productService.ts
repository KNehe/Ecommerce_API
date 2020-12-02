/* eslint-disable @typescript-eslint/no-explicit-any */
import Product from "../models/product";

class ProductService{

    addProduct =  async (data:any):Promise<any> =>{
        return await Product.create({...data});
    }

    findProductById = async (productId:string) :Promise<any> =>{
        return await Product.findById(productId);
    }

    updateProduct = async (productId:string,data:any):Promise<any> =>{
        return await Product.findByIdAndUpdate(productId,{$set: {...data, category:data.category}},{new:true,useFindAndModify:false});
    }

    findProductByName = async (name:string):Promise<any> =>{
        return await Product.findOne({name});
    }

    getAllProducts = async ():Promise<any> =>{
        return await Product.aggregate([{ $sample :{ size : 40}}]);
    }

    deleteProductById = async (productId:string) :Promise<any>=>{
        return await Product.findByIdAndDelete(productId);
    }

    searchByNameOrCategory = async(value:string):Promise<any> =>{

        const result = await Product.find({ $or:[ {name:{$regex: value, $options:'i'}},  {category:{$regex: value, $options:'i'}}]});
        
        return result != null? result : null;
    }

    searchByCategory = async(category:string):Promise<any> =>{
        const result = await Product.find({category: {$regex: category, $options:'i'}});
        
        return result != null? result : null;
    }

}

export default new ProductService();