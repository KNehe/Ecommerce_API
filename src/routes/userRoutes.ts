import express from 'express';
import AuthService from './../controllers/authController';


const router = express.Router();

router.post("/signup",AuthService.signUp);

router.post("/signin",AuthService.signIn);

router.delete('/delete/:id', AuthService.deleteUser);

router.patch('/updatename/:id', AuthService.updateName);

router.post('/forgotpassword', AuthService.forgotPassword);

router.post('/resetPassword/:resetToken', AuthService.resetPassword);



export default router;

