import app from './../app';
import supertest from 'supertest';
import mongoose from 'mongoose';

import { BAD_FORMAT_ID, CATEGORY_EXISTS, CATEGORY_NOT_FOUND, CATEGORY_REQUIRED, INVALID_JWT_TOKEN,ROLE_NOT_ALLOWED } from '../utils/errorMessages';
import { BAD_REQUEST, NO_CONTENT, SUCCESS, UNAUTHORISED } from '../utils/statusCodes';
import { SUCCESS_MSG } from '../utils/statusMessages';
import { base_url, valid_admin_jwt,valid_user_jwt} from '../utils/rawTestData';
import { Server } from 'http';
import categoryService from '../services/categoryService';
const PORT = Number(process.env.PORT || 3000);
const DB  = process.env.TEST_DATABASE || '';

let server: Server;

beforeAll(async (done)=>{
    server = app.listen(PORT);
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
  await mongoose.connection.db.collection('categories').deleteMany({});
  jest.clearAllMocks();
  done();
});

afterEach(async (done) => {
  await mongoose.connection.db.collection('categories').deleteMany({});
  done();
});

afterAll( async (done)=>{
  await mongoose.connection.close();
  server.close(); 
  done();
});


describe('Add category', ()=>{

    test('Should add catgory', async(done)=>{
        
        const addCategorySpy = jest.spyOn(categoryService,'addCategory');

        await supertest(app)
        .post(`${base_url}/categories/`)
        .set('Authorization',`Bearer ${valid_admin_jwt}`)
        .send({category:"Shoes"})
        .then(( response)=>{
            expect(response.body.status).toBe(SUCCESS_MSG);
            expect(response.body.data.newCategory.category).toBe('Shoes');
        });

        expect(addCategorySpy).toHaveBeenCalledTimes(1);

        done();
    });
    
    
    test('Should not add catgory if token is invalid', async(done)=>{

        await supertest(app)
        .post(`${base_url}/categories/`)
        .set('Authorization',`Bearer faketoekn`)
        .then(( response)=>{
            expect(response.body.statusCode).toBe(BAD_REQUEST);
            expect(response.body.message).toBe(INVALID_JWT_TOKEN);
        });
        done();

    });

    test('Should not add catgory if user not an admin', async(done)=>{

        await supertest(app)
        .post(`${base_url}/categories/`)
        .set('Authorization',`Bearer ${valid_user_jwt}`)
        .then(( response)=>{
            expect(response.body.statusCode).toBe(UNAUTHORISED);
            expect(response.body.message).toBe(ROLE_NOT_ALLOWED);
        });
        done();

    });

    
    test('Should not add catgory if required field is empty', async(done)=>{

        await supertest(app)
        .post(`${base_url}/categories/`)
        .set('Authorization',`Bearer ${valid_admin_jwt}`)
        .send({})
        .then(( response)=>{
            expect(response.body.statusCode).toBe(BAD_REQUEST);
            expect(response.body.message).toBe(CATEGORY_REQUIRED);
        });
        done();
    });

    test('Should not add catgory if it already exists', async(done)=>{
        
        const addCategorySpy = jest.spyOn(categoryService,'addCategory');

        await categoryService.addCategory("Shoes");

        await supertest(app)
        .post(`${base_url}/categories/`)
        .set('Authorization',`Bearer ${valid_admin_jwt}`)
        .send({category:"Shoes"})
        .then(( response)=>{
            expect(response.body.statusCode).toBe(BAD_REQUEST);
            expect(response.body.message).toBe(CATEGORY_EXISTS);
        });

        expect(addCategorySpy).toHaveBeenCalledTimes(1);

        done();
    });
 
  });

describe('Get categories', ()=>{


  test('Should return no categories if any was not created', async(done)=>{

    const getAllCategoriesSpy = jest.spyOn(categoryService,'getAllCategories');

    await supertest(app)
    .get(`${base_url}/categories/`)
    .expect(200)
    .then((response)=>{
        expect(response.body.data.categories.length).toBe(0);
    })

    expect(getAllCategoriesSpy).toHaveBeenCalledTimes(1);

    done();

    });

      
  test('Should return categories', async(done)=>{

    const getAllCategoriesSpy = jest.spyOn(categoryService,'getAllCategories');

    const addCategorySpy = jest.spyOn(categoryService,'addCategory');

    await categoryService.addCategory("Shoes");

    await supertest(app)
    .get(`${base_url}/categories/`)
    .expect(200)
    .then((response)=>{
        expect(response.body.data.categories.length).toBe(1);
        expect(response.body.data.categories[0].category).toBe('Shoes');
    });

    expect(getAllCategoriesSpy).toHaveBeenCalledTimes(1);
    expect(addCategorySpy).toHaveBeenCalledTimes(1);

    done();

    });

});

describe('Delete category', ()=>{

    test('Should delete catgory', async(done)=>{
        
        const deleteCategorySpy = jest.spyOn(categoryService,'deleteCategoryById');

        const addCategorySpy = jest.spyOn(categoryService,'addCategory');
        
        const newCategory = await categoryService.addCategory("Pens");

        await supertest(app)
        .delete(`${base_url}/categories/${newCategory._id}`)
        .set('Authorization',`Bearer ${valid_admin_jwt}`)
        .expect(NO_CONTENT)
        .then(( response)=>{
            expect(response.body).toStrictEqual({})
        });

        expect(deleteCategorySpy).toHaveBeenCalledTimes(1);

        expect(addCategorySpy).toHaveBeenCalledTimes(1);

        done();
    });
    
    
    test('Should not delete category if token is invalid', async(done)=>{

        await supertest(app)
        .delete(`${base_url}/categories/5fb385ee50297c27f8afb507`)
        .set('Authorization',`Bearer faketoekn`)
        .then(( response)=>{
            expect(response.body.statusCode).toBe(BAD_REQUEST);
            expect(response.body.message).toBe(INVALID_JWT_TOKEN);
        });
        done();

    });

    test('Should not delete category if user not an admin', async(done)=>{

        await supertest(app)
        .delete(`${base_url}/categories/5fb385ee50297c27f8afb507`)
        .set('Authorization',`Bearer ${valid_user_jwt}`)
        .then(( response)=>{
            expect(response.body.statusCode).toBe(UNAUTHORISED);
            expect(response.body.message).toBe(ROLE_NOT_ALLOWED);
        });
        done();

    });

    
    test('Should not delete category if category does not exist', async(done)=>{

        await supertest(app)
        .delete(`${base_url}/categories/5fb385ee50297c27f8afb507`)
        .set('Authorization',`Bearer ${valid_admin_jwt}`)
        .send({})
        .then(( response)=>{
            expect(response.body.statusCode).toBe(BAD_REQUEST);
            expect(response.body.message).toBe(CATEGORY_NOT_FOUND);
        });
        done();
    });
    
    test('Should not delete category if category id is invalid ', async(done)=>{

        await supertest(app)
        .delete(`${base_url}/categories/wrongid`)
        .set('Authorization',`Bearer ${valid_admin_jwt}`)
        .then(( response)=>{
            expect(response.body.statusCode).toBe(BAD_REQUEST);
            expect(response.body.message).toBe(BAD_FORMAT_ID);
        });
        done();
    });
 
  });

  describe('Update category', ()=>{

    test('Should update catgory', async(done)=>{
        
        const updateCategoryByIdSpy = jest.spyOn(categoryService,'updateCategoryById');

        const addCategorySpy = jest.spyOn(categoryService,'addCategory');
        
        const newCategory = await categoryService.addCategory("Pens");

        await supertest(app)
        .patch(`${base_url}/categories/${newCategory._id}`)
        .set('Authorization',`Bearer ${valid_admin_jwt}`)
        .send({category:'New Pens'})
        .expect(SUCCESS)
        .then(( response)=>{
            expect(response.body.data.updatedCategory.category).toBe('New Pens');
        });

        expect(updateCategoryByIdSpy).toHaveBeenCalledTimes(1);

        expect(addCategorySpy).toHaveBeenCalledTimes(1);

        done();
    });
    
    
    test('Should not update category if token is invalid', async(done)=>{

        await supertest(app)
        .patch(`${base_url}/categories/an-id`)
        .set('Authorization',`Bearer faketoekn`)
        .then(( response)=>{
            expect(response.body.statusCode).toBe(BAD_REQUEST);
            expect(response.body.message).toBe(INVALID_JWT_TOKEN);
        });
        done();

    });

    test('Should not update category if user not an admin', async(done)=>{

        await supertest(app)
        .patch(`${base_url}/categories/5fb385ee50297c27f8afb507`)
        .set('Authorization',`Bearer ${valid_user_jwt}`)
        .then(( response)=>{
            expect(response.body.statusCode).toBe(UNAUTHORISED);
            expect(response.body.message).toBe(ROLE_NOT_ALLOWED);
        });
        done();

    });

    
    test('Should not update category if category is not provided', async(done)=>{
       
        await supertest(app)
        .patch(`${base_url}/categories/5fb385ee50297c27f8afb507`)
        .set('Authorization',`Bearer ${valid_admin_jwt}`)
        .then(( response)=>{
            expect(response.body.statusCode).toBe(BAD_REQUEST);
            expect(response.body.message).toBe(CATEGORY_REQUIRED);
        });
        done();
    });

    test('Should not update category if category if category does not exist', async(done)=>{
       
        await supertest(app)
        .patch(`${base_url}/categories/5fb385ee50297c27f8afb507`)
        .set('Authorization',`Bearer ${valid_admin_jwt}`)
        .send({category:'Laptop'})
        .then(( response)=>{
            expect(response.body.statusCode).toBe(BAD_REQUEST);
            expect(response.body.message).toBe(CATEGORY_NOT_FOUND);
        });
        done();
    });
    
    test('Should not update category if category id is invalid ', async(done)=>{

        await supertest(app)
        .patch(`${base_url}/categories/wrongid`)
        .set('Authorization',`Bearer ${valid_admin_jwt}`)
        .send({category: 'category'})
        .then(( response)=>{
            expect(response.body.statusCode).toBe(BAD_REQUEST);
            expect(response.body.message).toBe(BAD_FORMAT_ID);
        });
        done();
    });
 
  });