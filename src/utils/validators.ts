import mongoose from 'mongoose';


class Validators{

    isObjectIdValid = (id:string) : boolean =>{
        const ObjectId = mongoose.Types.ObjectId;
        return ObjectId.isValid(id);
    }
    
    isEmailValid = (email:string): boolean =>{
        
    // eslint-disable-next-line no-useless-escape
    const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   
    return  emailReg.test(String(email).toLowerCase());

    }

    isPasswordLong = (password:string): boolean => password.length < 6 ? false: true;
    
    
    isPasswordStrong = (password:string): boolean =>{
        const isStrong = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(password,);
        return isStrong;
    }


}

export default new Validators();