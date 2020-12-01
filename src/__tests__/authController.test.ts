import app from '../app';
import supertest from 'supertest';
import mongoose from 'mongoose';

import { BAD_FORMAT_ID, INVALID_CREDENTIALS, INVALID_EMAIL,JWT_TOKEN_NOT_FOUND,NAME_NOT_FOUND,NO_EMPTY_FIELD,ROLE_NOT_ALLOWED, SHORT_PASSWORD, SIGN_IN_ERR_MSG, SIGN_UP_ERR_MSG, USER_WITH_EMAIL_EXISTS_MSG, USER_WITH_ID_NOT_FOUND, WEAK_PASSWORD } from '../utils/errorMessages';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, UNAUTHORISED } from '../utils/statusCodes';
import { SUCCESS_MSG } from '../utils/statusMessages';
import { base_url, valid_admin_jwt,valid_user_jwt} from '../utils/rawTestData';
import { Server } from 'http';
import authService from '../services/authService';
import { EMAIL_PASSWORD } from '../utils/authStrategy';
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
  jest.clearAllMocks();
  done();
});


afterAll( async (done)=>{
  await mongoose.connection.close();
  server.close(); 
  done();
});


describe('Sign up', ()=>{

    test('Should sign up user ', async(done)=>{
        
        const signUpSpy = jest.spyOn(authService,'signUp');

        const deleteUserSpy = jest.spyOn(authService,'deleteUser');
        
        await supertest(app)
        .post(`${base_url}/users/signup`)
        .send({name:"nehe", email:'nehee@gmail.com', password: "1Aa#@bB"})
        .then(async ( response)=>{
            expect(response.body.status).toBe(SUCCESS_MSG);
            expect(response.body.data.user.name).toBe('nehe');
            expect(response.body.data.token).toBeTruthy();
            await authService.deleteUser(response.body.data.user.id);
        });

        expect(signUpSpy).toHaveBeenCalledTimes(1);

        expect(deleteUserSpy).toHaveBeenCalledTimes(1);


        done();
    });
     
    test('Should not sign up user with invalid email', async(done)=>{
        
      const signUpSpy = jest.spyOn(authService,'signUp');
      
      await supertest(app)
      .post(`${base_url}/users/signup`)
      .send({name:"nehe", email:'nehemgmail.com', password: "1Aa#@bB"})
      .then(async ( response)=>{
          expect(response.body.statusCode).toBe(BAD_REQUEST);
          expect(response.body.message).toBe(INVALID_EMAIL);
      });

      expect(signUpSpy).toHaveBeenCalledTimes(0);

      done();
  });
    
    test('Should not sign up user with short password', async(done)=>{
        
    const signUpSpy = jest.spyOn(authService,'signUp');
    
    await supertest(app)
    .post(`${base_url}/users/signup`)
    .send({name:"nehe", email:'ne@gmail.com', password: "1dd"})
    .then(async ( response)=>{
        expect(response.body.statusCode).toBe(BAD_REQUEST);
        expect(response.body.message).toBe(SHORT_PASSWORD);
    });

    expect(signUpSpy).toHaveBeenCalledTimes(0);

    done();
    });
       
    test('Should not sign up user with weak password', async(done)=>{
        
      const signUpSpy = jest.spyOn(authService,'signUp');
      
      await supertest(app)
      .post(`${base_url}/users/signup`)
      .send({name:"nehe", email:'e@gmail.com', password: "1dd1111111"})
      .then(async ( response)=>{
          expect(response.body.statusCode).toBe(BAD_REQUEST);
          expect(response.body.message).toBe(WEAK_PASSWORD);
      });
  
      expect(signUpSpy).toHaveBeenCalledTimes(0);
  
      done();
      });
    
    test('Should not sign up user if any required field is missing', async(done)=>{
        
        const signUpSpy = jest.spyOn(authService,'signUp');
        
        await supertest(app)
        .post(`${base_url}/users/signup`)
        .send({email:'nehe@gmail.com', password: "1Aa#@bB"})
        .then(async ( response)=>{
            expect(response.body.message).toBe(SIGN_UP_ERR_MSG);
            expect(response.body.statusCode).toBe(INTERNAL_SERVER_ERROR);
            
        });

        expect(signUpSpy).toHaveBeenCalledTimes(0);

        done();
    });

    test('Should not sign up user if any required field is empty', async(done)=>{
        
      const signUpSpy = jest.spyOn(authService,'signUp');
      
      await supertest(app)
      .post(`${base_url}/users/signup`)
      .send({name: '', email:'nehe@gmail.com', password: ""})
      .then(async ( response)=>{
          expect(response.body.message).toBe(NO_EMPTY_FIELD);
          expect(response.body.statusCode).toBe(BAD_REQUEST);
          
      });

      expect(signUpSpy).toHaveBeenCalledTimes(0);

      done();
  });
    
  test('Should not sign up user if user with email exists', async(done)=>{
        
    const signUpSpy = jest.spyOn(authService,'signUp');

    const deleteUserSpy = jest.spyOn(authService,'deleteUser');
    
    const testUser = await authService.signUp("nehe", 'nehe@gmail.com', "1Aa#@bB", EMAIL_PASSWORD);

    await supertest(app)
    .post(`${base_url}/users/signup`)
    .send({name:"nehe", email:'nehe@gmail.com', password: "1Aa#@bB"})
    .then(async ( response)=>{
        expect(response.body.message).toBe(USER_WITH_EMAIL_EXISTS_MSG);
        expect(response.body.statusCode).toBe(BAD_REQUEST);
        
    });

    await authService.deleteUser(testUser._id);

    expect(signUpSpy).toHaveBeenCalledTimes(1);

    expect(deleteUserSpy).toHaveBeenCalledTimes(1);


    done();
});
 
     
});

describe('Sign in', ()=>{

  test('Should sign in user', async(done)=>{
        
    const findUserByEmailSpy = jest.spyOn(authService,'findUserByEmail');
   
    const deleteUserSpy = jest.spyOn(authService,'deleteUser');

    const testUser = await authService.signUp("nehe", 'nehe@gmail.com', "1Aa#@bB", EMAIL_PASSWORD);
    
    await supertest(app)
    .post(`${base_url}/users/signin`)
    .send({email:'nehe@gmail.com', password: "1Aa#@bB"})
    .then(async ( response)=>{
        expect(response.body.status).toBe(SUCCESS_MSG);
        expect(response.body.data.user.name).toBe('nehe');
        expect(response.body.data.token).toBeTruthy();
    });
    
    await authService.deleteUser(testUser._id);

    expect(findUserByEmailSpy).toHaveBeenCalledTimes(1);

    expect(deleteUserSpy).toHaveBeenCalledTimes(1);

    done();
});
   
test('Should not sign in user if user does not exist by email', async(done)=>{
        
  const findUserByEmailSpy = jest.spyOn(authService,'findUserByEmail');
  
  await supertest(app)
  .post(`${base_url}/users/signin`)
  .send({email:'nehe@gmail.com', password: "1Aa#@bB"})
  .then(async ( response)=>{
      expect(response.body.message).toBe(INVALID_CREDENTIALS);
  });  

  expect(findUserByEmailSpy).toHaveBeenCalledTimes(1);

  done();
});

test('Should not sign in user with wrong password', async(done)=>{
        
  const findUserByEmailSpy = jest.spyOn(authService,'findUserByEmail');
 
  const deleteUserSpy = jest.spyOn(authService,'deleteUser');

  const testUser = await authService.signUp("nehe", 'testg@gmail.com', "1Aa#@bB", EMAIL_PASSWORD);
  
  await supertest(app)
  .post(`${base_url}/users/signin`)
  .send({email:'nehe@gmail.com', password: "false password word"})
  .then(async ( response)=>{
      expect(response.body.message).toBe(INVALID_CREDENTIALS);
      expect(response.body.statusCode).toBe(UNAUTHORISED);
  });
  
  await authService.deleteUser(testUser._id);

  expect(findUserByEmailSpy).toHaveBeenCalledTimes(1);

  expect(deleteUserSpy).toHaveBeenCalledTimes(1);

  done();
});
 
test('Should not sign in user if any required field is empty', async(done)=>{
          
  await supertest(app)
  .post(`${base_url}/users/signin`)
  .send({name: '', email:'real@gmail.com', password: ""})
  .then(async ( response)=>{
      expect(response.body.message).toBe(NO_EMPTY_FIELD);
      expect(response.body.statusCode).toBe(BAD_REQUEST);
      
  });

  done();
});

test('Should not sign up user if any required field is missing', async(done)=>{
          
  await supertest(app)
  .post(`${base_url}/users/signin`)
  .send({ password: "1Aa#@bB"})
  .then(async ( response)=>{
      expect(response.body.message).toBe(SIGN_IN_ERR_MSG);
      expect(response.body.statusCode).toBe(INTERNAL_SERVER_ERROR);
  });

  done();
});

});

describe('Delete user', ()=>{

  test('Should not delete user if jwt not found', async(done)=>{

    await supertest(app)
    .delete(`${base_url}/users/delete/user-id`)
    .then((response)=>{
     expect(response.body.message).toBe(JWT_TOKEN_NOT_FOUND);
    });

    done();

  });
 
  test('Should not delete user if user is not an admin', async(done)=>{

    await supertest(app)
    .delete(`${base_url}/users/delete/user-id`)
    .set('Authorization',`Bearer ${valid_user_jwt}`)
    .then((response)=>{
     expect(response.body.message).toBe(ROLE_NOT_ALLOWED);
    });
    done();
  });

  test('Should not delete user if id is has a wrong format', async(done)=>{

    await supertest(app)
    .delete(`${base_url}/users/delete/user-id`)
    .set('Authorization',`Bearer ${valid_admin_jwt}`)
    .then((response)=>{
     expect(response.body.message).toBe(BAD_FORMAT_ID);
    });
    done();
  });

});


describe('Update name', ()=>{

  test('Should not update name if jwt not found',async (done)=>{
    
    await supertest(app)
    .patch(`${base_url}/users/updatename/user-id`)
    .then((response)=>{
      expect(response.body.message).toBe(JWT_TOKEN_NOT_FOUND);
    });

    done();

  });

  test('Should not update name if id got bad format',async (done)=>{
    
    await supertest(app)
    .patch(`${base_url}/users/updatename/user-id`)
    .set('Authorization',`Bearer ${valid_user_jwt}`)
    .then((response)=>{
     expect(response.body.message).toBe(BAD_FORMAT_ID);
    });

    done();

  });

  test('Should not update name if user not found',async (done)=>{
    
    await supertest(app)
    .patch(`${base_url}/users/updatename/5fc699273d00090f84062923`)
    .set('Authorization',`Bearer ${valid_admin_jwt}`)
    .then((response)=>{
     expect(response.body.message).toBe(USER_WITH_ID_NOT_FOUND);
    });

    done();

  });

  test('Should not update name if new name not provided',async (done)=>{
    
    const testUser = await authService.signUp("nehe", 'nehe1@gmail.com', "1Aa#@bB", EMAIL_PASSWORD);

    await supertest(app)
    .patch(`${base_url}/users/updatename/${testUser._id}`)
    .set('Authorization',`Bearer ${valid_admin_jwt}`)
    .send({name:''})
    .then((response)=>{
     expect(response.body.message).toBe(NAME_NOT_FOUND);
    });
    
    await authService.deleteUser(testUser._id);
    
    done();

  });
  
  test('Should update name ',async (done)=>{
    
    const testUser = await authService.signUp("nehe", 'nehe2@gmail.com', "1Aa#@bB", EMAIL_PASSWORD);

    await supertest(app)
    .patch(`${base_url}/users/updatename/${testUser._id}`)
    .set('Authorization',`Bearer ${valid_admin_jwt}`)
    .send({name:'new name'})
    .then((response)=>{
     expect(response.body.data.name).toBe("new name");
    });
    
    await authService.deleteUser(testUser._id);
    
    done();

  });
  
});