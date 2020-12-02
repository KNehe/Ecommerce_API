# AN ECOMMERCE API.

An api to faciliatate buying and selling goods built using typescript, expressjs, mongodb and javascript

## FOLLOW STEPS BELOW TO EXECUTE

### SETUP ENVIROMENT VARIABLES

Create a .env file in the root of your project with the following variables

```
DATABASE=<connection-string-to-your-mongodb-database>

TEST_DATABASE=<connection-string-to-your-mongodb-testdatabase>

JWT_SECRET=<secret>
JWT_EXPIRY_TIME=

```
For sending emails using nodemailer and gmail

Enable [less secure app access](https://accounts.google.com/b/0/displayunlockcaptcha) for this to work

You may also need to [enable the secure access capture](https://accounts.google.com/b/0/displayunlockcaptcha)

```
EMAIL_PORT=
EMAIL_AUTH_USERNAME=<google_auth_user_name>
EMAIL_AUTH_PASSWORD=<google_auth_password>
EMAIL_FROM=
```

The api uploads images to cloudinary. [Create an account](https://accounts.google.com/b/0/displayunlockcaptcha) and pick configuration from the dashboard to fill below
```
CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

To facilitate facebook and google auth

Get [Facebook app id and secret](https://developers.facebook.com/apps/364856984821018/settings/basic/)

```
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
```

Get [Google client id and secret](https://console.cloud.google.com/apis/credentials). You'll need to create an app then get the credentials

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Used to run on localhost else change it to point to your host

Used by Oauth strategies to redirect back to the api

```
BASE_URL=http://localhost:3000/ 

    OR 

BASE_URL=https://api.herokuapp.com/

```

The api supports paypal payment using braintree by receiving a ```nonce``` from a client.

Go to [braintree developer home page](https://sandbox.braintreegateway.com/merchants/x4r6zcxfjwygzdph/home) and get details below.

You'll be prompted to create an account if you don't have one. The same applies to any site mentioned above.

```
BRAINTREE_MERCHANT_ID=2c34stzd8dh7rzxb
BRAINTREE_PUBLIC_KEY=xb4vq7dc6d5kmd96
BRAINTREE_PRIVATE_KEY=fe6a0aa5736ecedaf6bddde990407611
```

## TESTING THE API

Execute ```npm run start:dev``` to run in development

Execute ```npm run start:prod:local ``` to run a local production build. It performs a deletion of ```dist``` folder, creates a new one
and starts the server

Note that ``` npm start ``` alone will not work locally unless you run ```npm run build``` first. However, it will work on heroku. Heroku takes care of running ```npm run build``` and ```npm start``` on it's own. I created them separately that purpose and also that heroku will fail anything attempt to delete folders or files.

Execute ``` npm test ``` to run the automated tests