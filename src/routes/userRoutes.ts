import express from 'express';
import authController from './../controllers/authController';
import passport from 'passport';
import { ROLE_ADMIN } from '../utils/roles';


const router = express.Router();

router.post("/signup",authController.signUp);

router.post("/signin",authController.signIn);

router.delete('/delete/:id', authController.protectRoute, authController.restrictRoute([ROLE_ADMIN]), authController.deleteUser);

router.patch('/updatename/:id', authController.protectRoute, authController.updateName);

router.post('/forgotpassword', authController.forgotPassword);

router.post('/resetPassword/:resetToken', authController.resetPassword);

router.get('/auth/facebook',passport.authenticate('facebook',{ session:false, scope:['email']}), authController.facebookAuth);

router.get('/auth/google',passport.authenticate('google', { session:false, scope:['openid','profile', 'email']}), authController.googleAuth);

router.post('/checktokenexpiry',authController.checkTokenExpiry);

router.patch('/updatemail/:id', authController.protectRoute, authController.updateEmail);


export default router;

