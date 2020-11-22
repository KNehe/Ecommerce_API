import { ShippingDetails } from "./shippingDetails";

export interface Order{
  shippingDetails: ShippingDetails, 
  shippingCost: string ,
  tax: string ,
  total: string ,
  totalItemPrice: string ,
  userId: string ,
  paymentMethod: string ,
  userType: string 
}