import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true, 'A category is required']
    },
    details:{
        type:String,
        required:true
    }
});


const Product = mongoose.model('Product',productSchema);

export default Product;