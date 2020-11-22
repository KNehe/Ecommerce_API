import mongoose from 'mongoose';
import CartItemSchema from './cart_item_schema';
import ShippingSchema from './shippingDetails_schema';


const orderSchema = new mongoose.Schema({
  shippingDetails:{
    type:ShippingSchema,
    required: [true, 'Shipping details required']
  },  
  shippingCost:{
      type: String,
      required: [true,'Shipping cost is required']
  },
  tax:{
    type: String,
     required: [true,'Tax is required']

},
  total: {
    type: String,
    required: [true,'Total cost is required']
},
  totalItemPrice:{
    type: String,
    required: [true,'Total item price is required']
},
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref:'User'
},
  paymentMethod: {
    type: String,
    required: [true,'Payment Method is required']
},
  userType:{
    type: String,
    required: [true,'User type is required']
}, 
 dateOrdered:{
   type:Date,
   default: Date.now()
 },
 cartItems: {
   type: [CartItemSchema],
   required: [true, 'Cart items are required']
 }
});

const orderModel = mongoose.model('Order',orderSchema);

export default orderModel;