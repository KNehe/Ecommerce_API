import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'A name is required']
    },
    price:{
        type:Number,
        required:[true, 'A price is required']
    },
    imageUrl:{
        type:String,
        required:[true, 'An image url is required']
    },
    category:{
        type:String,
        required:[true, 'A category id is required']
    },
    details:{
        type:String,
        required:[true, 'Product details are required']
    }
});

const CartItemSchema = new mongoose.Schema({ 
  product: productSchema,
  quantity:  {
    type: Number,
    required: [true,'Quantity is required']
},

});


export default CartItemSchema;