/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from 'dotenv';
dotenv.config({path:'./../../.env'});
import Stripe from 'stripe';
import { ChargeDetails } from '../interfaces/Stripe/chargeDetails';
import { StripeCustomer } from '../interfaces/Stripe/stripeCustomer';

class StripeService{
    
    //private publishable_key = process.env.STRIPE_PUBLISHABLE_KEY;
    private secret_key = process.env.STRIPE_SECRET_KEY || '';

    private stripe = new Stripe(this.secret_key,{
        apiVersion: '2020-08-27'
    });
    

    createCustomer = async (customer: StripeCustomer):Promise<any> =>{

        const params: Stripe.CustomerCreateParams = {
            description:customer.description,
            name:customer.description,
            email:customer.email
        }

        const createdCustomer : Stripe.Customer = await this.stripe.customers.create(params);

        return createdCustomer;
    }

    createCard = async (customerId:string):Promise<any> =>{
        
        const params: Stripe.CustomerSourceCreateParams ={
            source:'tok_visa 42424242424'
            
        }
        
        const card = await this.stripe.customers.createSource(customerId, params,);

        return card;
    }

    chargeCustomer = async (charge:ChargeDetails): Promise<any> =>{

        const params: Stripe.ChargeCreateParams ={
            customer: charge.customerId,
            amount:charge.amount,
            currency:charge.currency,
            receipt_email: charge.customerEmail,
            description:charge.description            
        }

        const chargedCustomer = await this.stripe.charges.create(params);

        return chargedCustomer;
    }



}

export default new StripeService();