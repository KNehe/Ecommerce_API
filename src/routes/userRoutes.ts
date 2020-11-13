import express from 'express';
import AuthService from './../controllers/authController';
import passport from 'passport';


const router = express.Router();

router.post("/signup",AuthService.signUp);

router.post("/signin",AuthService.signIn);

router.delete('/delete/:id', AuthService.deleteUser);

router.patch('/updatename/:id', AuthService.updateName);

router.post('/forgotpassword', AuthService.forgotPassword);

router.post('/resetPassword/:resetToken', AuthService.resetPassword);

router.get('/auth/facebook',passport.authenticate('facebook',{ session:false, scope:['email']}), AuthService.facebookAuth);


export default router;

