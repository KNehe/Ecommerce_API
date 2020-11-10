import express from 'express';
import productController from './../controllers/productController';

const router = express.Router();

router
  .route('/')
  .post(productController.addProduct)
  .get(productController.getAllProducts);

router.post("/addProductImage",productController.addProductImage);

router
  .route('/:id')
  .get(productController.getAllProductById);


export default router;