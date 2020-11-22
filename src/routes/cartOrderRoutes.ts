import express from   'express';
import authController from '../controllers/authController';
import cartOrderController from '../controllers/cartOrderController';

const router = express.Router();

router
    .route('/')
    .post(authController.protectRoute, cartOrderController.addToCart)
    .get(authController.protectRoute, cartOrderController.getCart)
    .delete(authController.protectRoute, cartOrderController.deleteCart);

router.post('/flutter/stripepayment',cartOrderController.flutterStripeOrderhandler);

export default router;
