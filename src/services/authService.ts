/* eslint-disable @typescript-eslint/no-explicit-any */
import User from './../models/user';

class AuthService{

    signUp = async (name:string, email:string, password:string): Promise<any> =>{
        return await User.create({name,email,password});
    };

    findUserByEmail = async (email:string): Promise<any> =>{

        //I used free MongoDB Atlas tier which doesn't allow usage of 'where' clause in the commented statement below
        //await User.find({$where:email})

        //Decided to get all users and looping to find match as temporary solution to above commented code
        //in case of upgrade the above commented can be used to find a user by email
        const users = await User.find();

        if(!users) return null;        
        
        for await (const user of users ){
           if(user.email === email){
               return user;
           }
        }

        return null;
    }

    

}

export default new AuthService();