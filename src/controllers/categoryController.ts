/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { BAD_FORMAT_ID, CATEGORY_EXISTS, CATEGORY_ID_REQUIRED, CATEGORY_NOT_FOUND, CATEGORY_REQUIRED, ERROR_ADDING_CATEGORY, ERROR_DELETING_CATEGORY, ERROR_FETCHING_CATEGORIES, ERROR_UPDATING_CATEGORY } from "../utils/errorMessages";
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NO_CONTENT, SUCCESS } from "../utils/statusCodes";
import { SUCCESS_MSG } from "../utils/statusMessages";
import validators from "../utils/validators";
import categoryService from './../services/categoryService';

class CategoryController{

    addCategory = async (req:Request, res:Response, next: NextFunction):Promise<any> =>{
        try{
            const {category} :{ category:string} = req.body;

            if(!category) return next(new AppError(CATEGORY_REQUIRED,BAD_REQUEST));

            if(await categoryService.findCategory(category)) return next( new AppError(CATEGORY_EXISTS, BAD_REQUEST));

            const newCategory = await categoryService.addCategory(category);

            if(!newCategory) return next(new AppError(ERROR_ADDING_CATEGORY, INTERNAL_SERVER_ERROR));

            res.status(CREATED).json({
                status: SUCCESS_MSG,
                data: { newCategory}
            });

        }catch(e){
            console.log(e.message);
            return next(new AppError(ERROR_ADDING_CATEGORY, INTERNAL_SERVER_ERROR));
        }
    }

    getAllCategories = async (req:Request, res:Response, next: NextFunction):Promise<any> =>{
        try{
            const categories = await categoryService.getAllCategories();
        
            res.status(SUCCESS).json({
                status: SUCCESS_MSG,
                data: { categories}
            });

        }catch(e){
            console.log(e.message);
            return next(new AppError(ERROR_FETCHING_CATEGORIES, INTERNAL_SERVER_ERROR));
        }
    }

    updateCategory  = async (req:Request, res:Response, next: NextFunction):Promise<any> =>{
        try{
            const id:string = req.params.id;

            const {category} :{ category:string} = req.body;

            if(!id) return next( new AppError(CATEGORY_ID_REQUIRED,BAD_REQUEST));

            if(!category) return next(new AppError(CATEGORY_REQUIRED,BAD_REQUEST));
            
            if(!validators.isObjectIdValid(id)) return next( new AppError(BAD_FORMAT_ID,BAD_REQUEST));

            if(!await categoryService.findCategoryById(id)) return next( new AppError(CATEGORY_NOT_FOUND,BAD_REQUEST));

            const updatedCategory = await categoryService.updateCategoryById(id,category);

            if(!updatedCategory) return next(new AppError(ERROR_UPDATING_CATEGORY, INTERNAL_SERVER_ERROR));

            res.status(SUCCESS).json({
                status: SUCCESS_MSG,
                data: { updatedCategory}
            });

        }catch(e){
            console.log(e.message);
            return next(new AppError(ERROR_UPDATING_CATEGORY, INTERNAL_SERVER_ERROR));
        }
    }

    deleteCategory  = async (req:Request, res:Response, next: NextFunction):Promise<any> =>{
        try{
            const id:string = req.params.id;

            if(!id) return next( new AppError(CATEGORY_ID_REQUIRED,BAD_REQUEST));
            
            if(!validators.isObjectIdValid(id)) return next( new AppError(BAD_FORMAT_ID,BAD_REQUEST));

            if(!await categoryService.findCategoryById(id)) return next( new AppError(CATEGORY_NOT_FOUND,BAD_REQUEST));

            const result = await categoryService.deleteCategoryById(id);

            if(!result) return next(new AppError(ERROR_DELETING_CATEGORY, INTERNAL_SERVER_ERROR));

            res.status(NO_CONTENT).json({
                status: SUCCESS_MSG
            });

        }catch(e){
            console.log(e.message);
            return next(new AppError(ERROR_DELETING_CATEGORY, INTERNAL_SERVER_ERROR));
        }
    }
}

export default new CategoryController();