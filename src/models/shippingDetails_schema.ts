import mongoose from 'mongoose';

const shippingSchema = new mongoose.Schema({ 
  name: {
    type: String,
    required: [true,'Name is required']
},
  phoneContact:  {
    type: String,
    required: [true,'Phonr contact is required']
},
  addressLine:  {
    type: String,
    required: [true,'Addressline is required']
},
  city:  {
    type: String,
    required: [true,'City is required']
},
  postalCode:  {
    type: String,
    required: [true,'Postal code is required']
},
  country:  {
    type: String,
    required: [true,'Country is required']
},

});


export default shippingSchema;