import express from 'express';
import productController from './../controllers/productController';

const router = express.Router();

router
  .route('/')
  .post(productController.addProduct);

router.post("/addProductImage",productController.addProductImage);


export default router;