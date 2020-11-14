import express from 'express';
import authController from '../controllers/authController';
import { ROLE_ADMIN } from '../utils/roles';
import productController from './../controllers/productController';

const router = express.Router();

router
  .route('/')
  .post(authController.protectRoute, authController.restrictRoute([ROLE_ADMIN]),productController.addProduct)
  .get(productController.getAllProducts);

router.post("/addProductImage", authController.protectRoute, authController.restrictRoute([ROLE_ADMIN]), productController.addProductImage);

router
  .route('/:id')
  .get(productController.getAllProductById)
  .delete(authController.protectRoute, authController.restrictRoute([ROLE_ADMIN]),productController.deleteProduct)
  .patch(authController.protectRoute, authController.restrictRoute([ROLE_ADMIN]),productController.updateProductById);

  router.get('/search/:value',productController.searchByNameOrCategory);
  router.get('/search/category/:category',productController.searchByCategory);



export default router;