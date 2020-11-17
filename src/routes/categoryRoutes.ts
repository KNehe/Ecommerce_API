import express from 'express';
import authController from '../controllers/authController';
import categoryController from '../controllers/categoryController';
import { ROLE_ADMIN } from '../utils/roles';

const router = express.Router();

router
    .route('/')
    .post(authController.protectRoute, authController.restrictRoute([ROLE_ADMIN]), categoryController.addCategory)
    .get(authController.protectRoute, authController.restrictRoute([ROLE_ADMIN]), categoryController.getAllCategories);

router
    .route('/:id')
    .delete(authController.protectRoute, authController.restrictRoute([ROLE_ADMIN]), categoryController.deleteCategory)
    .patch(authController.protectRoute, authController.restrictRoute([ROLE_ADMIN]), categoryController.updateCategory);


export default router;