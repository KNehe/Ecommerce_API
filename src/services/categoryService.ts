import Category from "../models/categories";

/* eslint-disable @typescript-eslint/no-explicit-any */
class CategoryService{
    
    addCategory = async (category:string):Promise<any> =>{
        return await Category.create({category});
    }

    findCategory = async (category:string):Promise<any> =>{
        return await Category.findOne({category});
    }

    getAllCategories = async ():Promise<any> =>{
        return await Category.find();
    }

    findCategoryById = async(id:string):Promise<any> =>{
        return await Category.findById(id);
    }

    updateCategoryById = async(id:string, category:string): Promise<any> =>{
        return await Category.findByIdAndUpdate(id,{category},{new:true,useFindAndModify:false});
    }

    deleteCategoryById = async(id:string):Promise<any> =>{
        return await Category.findByIdAndDelete(id);
    }

}

export default new CategoryService();