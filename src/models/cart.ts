import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        required:[true, 'A product id is required'],
        ref:"Product"
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true, 'A user id is required'],
        ref:"User"
    },
    quantity:{
        type:Number,
        required:[true, 'Quantity is required']
    }
});

const Cart = mongoose.model('Cart',cartSchema);

export default Cart;