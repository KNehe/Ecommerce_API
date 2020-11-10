import mongoose from 'mongoose';

class Validators{

    isObjectIdValid = (id:string) : boolean =>{
        const ObjectId = mongoose.Types.ObjectId;
        return ObjectId.isValid(id);
    }

}

export default new Validators();