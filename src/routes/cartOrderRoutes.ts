import express from   'express';
import cartOrderController from '../controllers/cartOrderController';

const router = express.Router();

router
    .route('/')
    .post(cartOrderController.addToCart)
    .get(cartOrderController.getCart)
    .delete(cartOrderController.deleteCart);

export default router;