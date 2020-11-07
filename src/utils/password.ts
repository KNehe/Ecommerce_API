import bcrypt from 'bcryptjs';

class Password {

  hashPassword = async (password:string):Promise<string> =>{
       
        return await bcrypt.hash(password,12);
    };
  
  correctPassword = async (rawPassword:string, hash:string)=>{
    return await bcrypt.compare(rawPassword,hash);
  }
}

export default new Password();