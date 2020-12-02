/* eslint-disable @typescript-eslint/no-explicit-any */
import User from './../models/user';

class AuthService{

    signUp = async (name:string, email:string, password:string,strategy:string): Promise<any> =>{
        return await User.create({name,email,password,strategy});
    };

    findUserByEmail = async (email:string): Promise<any> =>{

        const user = await User.findOne({email});

        if(!user) return null;          

        return user;
    }

    deleteUser = async (id:string): Promise<any> =>{

        return await User.findByIdAndDelete(id);

    }

    findUserById = async(id:string):Promise<any>=>{

        return await User.findById(id);

    }

    updateName = async (userId:string, name:any):Promise<any> =>{     

        return await User.findByIdAndUpdate(userId,{$set: {name}},{new:true,useFindAndModify:false});

    }

    findUserByResetToken = async (resetToken:string):Promise<any> =>{

        return await User.findOne({passwordResetToken:resetToken});
        
    }

    createFaceBookOrGoogleUser = async(email:string,name:string,strategy:string):Promise<any> =>{
     return await User.create({email,name,strategy, password:"User doesn't require password"});
    }

    updateEmail = async (userId:string, email:any):Promise<any> =>{     

        return await User.findByIdAndUpdate(userId,{$set: {email}},{new:true,useFindAndModify:false});

    }

    

}

export default new AuthService();