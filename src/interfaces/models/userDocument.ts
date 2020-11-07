import { Document } from 'mongoose';

export interface UserDocument extends Document{
    name: string,
    email:string,
    password:string,
    role?:string,
    passwordChangedAt?:Date,
    passwordResetToken?:string,
    passwordResetExpires?:Date,
    createdAt?:string
}