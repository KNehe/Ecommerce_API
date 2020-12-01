import app from '../app';
import supertest from 'supertest';
import mongoose from 'mongoose';
import productService from '../services/productService';
import Product from '../models/product';
import { ATLEAST_ONE_FIELD_REQUIRED, BAD_FORMAT_ID, ERROR_ADDING_PRODUCT, 
  INVALID_JWT_TOKEN, JWT_TOKEN_NOT_FOUND, NAME_PRICE_IMGURL_CATEGORY_DETAILS_REQUIRED, NO_IMAGE_PROVIDED,
   PRODUCT_NOT_EXISTS, ROLE_NOT_ALLOWED } from '../utils/errorMessages';
import { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR, NO_CONTENT, UNAUTHORISED } from '../utils/statusCodes';
import { PRODUCT_ADDED } from '../utils/successMessages';
import { SUCCESS_MSG } from '../utils/statusMessages';
import { base_url,invalid_jwt, valid_admin_jwt,valid_user_jwt} from '../utils/rawTestData';
import { Server } from 'http';
const PORT = Number(process.env.PORT || 3000);
const DB  = process.env.TEST_DATABASE || '';

let server: Server;

beforeAll(async (done)=>{
  server =app.listen(PORT);
  jest.setTimeout(50000);
   await mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:true,
    useUnifiedTopology:true,
  });

  done();
 
});

beforeEach(async (done)=>{
  await mongoose.connection.db.collection('products').deleteMany({});
  jest.clearAllMocks();
  done();
});


afterEach(async (done) => {
  await mongoose.connection.db.collection('products').deleteMany({});
  done();
});

afterAll( async (done)=>{
  await mongoose.connection.close();
  server.close(); 
  done();
});


describe('Update product by id', ()=>{
  
  test('Should not update product if user is not an admin', async(done)=>{

    await supertest(app)
    .patch(`${base_url}/products/5fc62c4f73593406f0886077$`)
    .set('Authorization',`Bearer ${valid_user_jwt}`)
    .then((response)=>{
     expect(response.body.message).toBe(ROLE_NOT_ALLOWED);
    });
    done();
  });

  test('Should not update product if id is has a wrong format', async(done)=>{
    const wrongId = 'xfd';

    await supertest(app)
    .patch(`${base_url}/products/${wrongId}`)
    .set('Authorization',`Bearer ${valid_admin_jwt}`)
    .then((response)=>{
     expect(response.body.message).toBe(BAD_FORMAT_ID);
    });
    done();
  });

  test('Should not update product if product does not exist', async(done)=>{

    const findProductByIdSpy  = jest.spyOn(productService,'findProductById');
    
    await supertest(app)
    .patch(`${base_url}/products/5fc62c4f73593406f0886077`)
    .set('Authorization',`Bearer ${valid_admin_jwt}`)
    .then((response)=>{
      expect(response.body.statusCode).toBe(BAD_REQUEST);
      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe(PRODUCT_NOT_EXISTS);
    });

    expect(findProductByIdSpy).toBeCalledTimes(1);

    done();

  });
  
  test('Should not update product if no field is provided for update', async(done)=>{

    const findProductByIdSpy  = jest.spyOn(productService,'findProductById');
    
     const product = {name:'Shoe', price:200, details: 'details', category: 'Shoes', imageUrl:'https://fdf.jpd'};
     const newProduct = await productService.addProduct(product);

    await supertest(app)
    .patch(`${base_url}/products/${newProduct._id}`)
    .set('Authorization',`Bearer ${valid_admin_jwt}`)
    .send({})
    .then((response)=>{
      expect(response.body.statusCode).toBe(BAD_REQUEST);
      expect(response.body.message).toBe(ATLEAST_ONE_FIELD_REQUIRED);
    });

    expect(findProductByIdSpy).toBeCalledTimes(1);

    done();

  });
  
  test('Should update product', async(done)=>{

    const findProductByIdSpy  = jest.spyOn(productService,'findProductById');
    const updateProductSpy  = jest.spyOn(productService,'updateProduct');

     const product = {name:'Shoe', price:200, details: 'details', category: 'Shoes', imageUrl:'https://fdf.jpd'};
     const newProduct = await productService.addProduct(product);
    
    await supertest(app)
    .patch(`${base_url}/products/${newProduct._id}`)
    .set('Authorization',`Bearer ${valid_admin_jwt}`)
    .send({name: 'fish'})
    .then((response)=>{
      expect(response.body.status).toBe(SUCCESS_MSG);
      expect(response.body.data.updatedProduct.name).not.toBe(product.name);
      expect(response.body.data.updatedProduct.name).toBe('fish');
      expect(response.body.data.updatedProduct.price).toBe(product.price);
    });

    expect(findProductByIdSpy).toBeCalledTimes(1);
    expect(updateProductSpy).toBeCalledTimes(1);

    done();

  });
  
});


describe('Get products route', () => {    

    test('Should get all products', async (done)=>{
      
      const getProductsSpy = jest.spyOn(productService,'getAllProducts');
      
     await Product.create({name:'Shoe', price:200, details: 'details', category: 'Shoes', imageUrl:'https://fdf.jpd'});

     await Product.create({name:'Shoe', price:200, details: 'details', category: 'Shoes', imageUrl:'https://fdf.jpd'});

      await supertest(app)
      .get(`${base_url}/products/`)
      .expect(200)
      .then((response)=>{
        expect(Array.isArray(response.body.data.products)).toBeTruthy();
        expect(response.body.data.products.length).toBeTruthy();
        expect(response.body.data.products[0].name).toEqual('Shoe');
        expect(response.body.data.products[0].details).toEqual('details');
        expect(response.body.data.products[0].category).toEqual('Shoes');
      });

      expect(getProductsSpy).toHaveBeenCalledTimes(1);

      done();

    });

    test('Should get no products', async (done)=>{

      const getProductsSpy = jest.spyOn(productService,'getAllProducts');
      await supertest(app)
      .get(`${base_url}/products/`)
      .expect(200)
      .then((response)=>{
       
       expect(response.body.data.products.length).toBe(0);
      });

      expect(getProductsSpy).toHaveBeenCalledTimes(1);

      done();
    });    

});

describe('Add product', ()=>{

  test('Should not add product if any required field is missing', async ( done)=>{

     await supertest(app)
    .post(`${base_url}/products/`)
    .set('Authorization',`Bearer ${valid_admin_jwt}`)
    .send({name: 'shoe'})
    .expect(400)
    .then((response)=>{
      expect(response.body.message).toBe(NAME_PRICE_IMGURL_CATEGORY_DETAILS_REQUIRED)
    });

    done();

  });

  test('Should not add product when no body provided', async (done)=>{
   
    await supertest(app)
   .post(`${base_url}/products/`)
   .set('Authorization',`Bearer ${valid_admin_jwt}`)
   .then((response)=>{
    expect(response.body.statusCode).toBe(INTERNAL_SERVER_ERROR)
     expect(response.body.message).toBe(ERROR_ADDING_PRODUCT)
   });
   done();

 });

 test('Should not add product when user is not an admin', async (done)=>{
   
  await supertest(app)
 .post(`${base_url}/products/`)
 .set('Authorization',`Bearer ${valid_user_jwt}`)
 .then((response)=>{
  expect(response.body.statusCode).toBe(UNAUTHORISED)
   expect(response.body.message).toBe(ROLE_NOT_ALLOWED)
 });
 done();

});

test('Should not add product when jwt is invalid', async (done)=>{
   
  await supertest(app)
 .post(`${base_url}/products/`)
 .set('Authorization',`Bearer ${invalid_jwt}`)
 .then((response)=>{
  expect(response.body.statusCode).toBe(BAD_REQUEST)
   expect(response.body.message).toBe(INVALID_JWT_TOKEN)
 });
 done();

});

test('Should add product', async (done)=>{
   
  await supertest(app)
 .post(`${base_url}/products/`)
 .set('Authorization',`Bearer ${valid_admin_jwt}`)
 .send({ name:'new prod', price:'100' ,imageUrl:'https://fff/f.png', category:'img', details:'details' })
 .expect(CREATED)
 .then((response)=>{
  expect(response.body.status).toBe(SUCCESS_MSG);
  expect(response.body.data.message).toBe(PRODUCT_ADDED);
  expect(response.body.data.newProduct.name).toBe('new prod');
  expect(response.body.data.newProduct.category).toBe('img');
 });
 done();

});

});

describe('Add product image', ()=>{

  test('Should not add product image if jwt token not provided', async (done)=>{
    await supertest(app)
    .post(`${base_url}/products/addProductImage`)
    .expect(400)
    .then((response)=>{
    expect(response.body.message).toBe(JWT_TOKEN_NOT_FOUND);
    });
    done();
  });

  test('Should not add product image if jwt token is invalid', async (done)=>{
    await supertest(app)
    .post(`${base_url}/products/addProductImage`)
    .set('Authorization',`Bearer ${invalid_jwt}`)
    .expect(400)
    .then((response)=>{
    expect(response.body.message).toBe(INVALID_JWT_TOKEN);
    });
    done();
  });

  test('Should not add product image if user is not admin', async (done)=>{
    await supertest(app)
    .post(`${base_url}/products/addProductImage`)
    .set('Authorization',`Bearer ${valid_user_jwt}`)
    .then((response)=>{
      expect(response.body.statusCode).toBe(UNAUTHORISED);
      expect(response.body.message).toBe(ROLE_NOT_ALLOWED);
    });
    done();
  });

  test('Should not add product image when no image is provided', async (done)=>{
    await supertest(app)
    .post(`${base_url}/products/addProductImage`)
    .set('Authorization',`Bearer ${valid_admin_jwt}`)
    .expect(400)
    .then((response)=>{
    expect(response.body.message).toBe(NO_IMAGE_PROVIDED);
    });
    done();
  });

});

describe('Get product by id', ()=>{

  test('Should not get product if id is has a wrong format', async(done)=>{
    const wrongId = 'xfd';
    await supertest(app)
    .get(`${base_url}/products/${wrongId}`)
    .then((response)=>{
     expect(response.body.message).toBe(BAD_FORMAT_ID);
    });
    done();
  });

  test('Should get product by id', async(done)=>{

    const findProductByIdSpy  = jest.spyOn(productService,'findProductById');
    const addProductSpy  = jest.spyOn(productService,'addProduct');


    const product = {name:'Shoe', price:200, details: 'details', category: 'Shoes', imageUrl:'https://fdf.jpd'};
    const newProduct = await productService.addProduct(product);

    await supertest(app)
    .get(`${base_url}/products/${newProduct._id}`)
    .then((response)=>{
    expect(response.body.status).toBe(SUCCESS_MSG);
    expect(response.body.data.product.name).toBe(product.name);
    });

    expect(findProductByIdSpy).toBeCalledTimes(1);
    expect(addProductSpy).toBeCalledTimes(1);

    done();

  });
  
});


describe('Delete product by id', ()=>{
  
  test('Should not delete product if user is not an admin', async(done)=>{

    await supertest(app)
    .delete(`${base_url}/products/5fc62c4f73593406f0886077$`)
    .set('Authorization',`Bearer ${valid_user_jwt}`)
    .then((response)=>{
     expect(response.body.message).toBe(ROLE_NOT_ALLOWED);
    });
    done();
  });

  test('Should not delete product if id is has a wrong format', async(done)=>{
    const wrongId = 'xfd';
    await supertest(app)
    .delete(`${base_url}/products/${wrongId}`)
    .set('Authorization',`Bearer ${valid_admin_jwt}`)
    .then((response)=>{
     expect(response.body.message).toBe(BAD_FORMAT_ID);
    });
    done();
  });

  test('Should not delete product if product does not exist', async(done)=>{

    const findProductByIdSpy  = jest.spyOn(productService,'findProductById');
    
    await supertest(app)
    .delete(`${base_url}/products/5fc62c4f73593406f0886077`)
    .set('Authorization',`Bearer ${valid_admin_jwt}`)
    .then((response)=>{
      expect(response.body.statusCode).toBe(BAD_REQUEST);
      expect(response.body.status).toBe('fail');
      expect(response.body.message).toBe(PRODUCT_NOT_EXISTS);
    });

    expect(findProductByIdSpy).toBeCalledTimes(1);

    done();

  });

  test('Should delete product', async(done)=>{

    const findProductByIdSpy  = jest.spyOn(productService,'findProductById');
    const deleteSpy  = jest.spyOn(productService,'deleteProductById');

     const product = {name:'Shoe', price:200, details: 'details', category: 'Shoes', imageUrl:'https://fdf.jpd'};
     const newProduct = await productService.addProduct(product);
    
     const emptyObject = {};
    await supertest(app)
    .delete(`${base_url}/products/${newProduct._id}`)
    .set('Authorization',`Bearer ${valid_admin_jwt}`)
    .expect(NO_CONTENT)
    .then((response)=>{
      expect(response.body).toStrictEqual(emptyObject);
    });

    expect(findProductByIdSpy).toBeCalledTimes(1);
    expect(deleteSpy).toBeCalledTimes(1);

    done();

  });
  
});


describe('Product Search', ()=>{
  
  test('Should search by name or category and return nothing', async(done)=>{

    const searchSpy = jest.spyOn(productService,'searchByNameOrCategory');

    await supertest(app)
    .get(`${base_url}/products/search/food`)
    .expect(200)
    .then((response)=>{
     expect(response.body.data.result.length).toBe(0);
    });

    expect(searchSpy).toHaveBeenCalledTimes(1);

    done();
  });
  
  test('Should search by name or category and return a result', async(done)=>{

    const searchSpy = jest.spyOn(productService,'searchByNameOrCategory');

    const product = {name:'Shoe', price:200, details: 'details', category: 'food', imageUrl:'https://fdf.jpd'};
    const newProduct = await productService.addProduct(product);

    await supertest(app)
    .get(`${base_url}/products/search/food`)
    .then((response)=>{
     expect(response.body.data.result[0].name).toBe(newProduct.name);
     expect(response.body.data.result.length).toBe(1);
    });

    expect(searchSpy).toHaveBeenCalledTimes(1);

    done();
  });
  
  test('Should search by  category and return nothing', async(done)=>{

    const searchSpy = jest.spyOn(productService,'searchByCategory');

    await supertest(app)
    .get(`${base_url}/products/search/category/phones`)
    .then((response)=>{
      expect(response.body.data.result.length).toBe(0);
    });

    expect(searchSpy).toHaveBeenCalledTimes(1);

    done();
  });
  
  test('Should search by category and return a result', async(done)=>{

    const searchSpy = jest.spyOn(productService,'searchByCategory');

    const product = {name:'Shoe', price:200, details: 'details', category: 'phones', imageUrl:'https://fdf.jpd'};
    const newProduct = await productService.addProduct(product);

    await supertest(app)
    .get(`${base_url}/products/search/category/phones`)
    .then((response)=>{
     expect(response.body.data.result[0].name).toBe(newProduct.name);
     expect(response.body.data.result.length).toBe(1);
    });

    expect(searchSpy).toHaveBeenCalledTimes(1);

    done();
  });
});







