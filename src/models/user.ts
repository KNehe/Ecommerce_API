import mongoose from 'mongoose';
import validator from 'validator';
import passwordUtil from './../utils/password';
import {UserDocument} from './../interfaces/models/userDocument';

    
const userSchema = new mongoose.Schema({
            name:{
                type: String,
                required: [true, 'A name is required']
            },
            email:{
                type:String,
                required: [true, 'An email is required'],
                unique: true,
                lowercase: true,
                validate: [validator.isEmail,'Invalid email'],
            },
            password:{
                type:String,
                required:[true,'A password is required'],
                minlength:6                
            },
            role:{
                type:String,
                enum:["user","admin"],
                default:'user'
            },
            passwordChangedAt:Date,
            passwordResetToken:Date,          
            passwordResetExpires:String,               
            createdAt:{
                    type:Date,
                    default:Date.now(),                    
                }
        
});



userSchema.pre<UserDocument>("save", async function(next){
        
        if(!this.isModified('password')){ next(); }

        this.password = await passwordUtil.hashPassword(this.password);
    
});


const User  = mongoose.model<UserDocument>('User',userSchema);

export default User;