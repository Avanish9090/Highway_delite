import mongoose from "mongoose";
const Schema = mongoose.Schema;

let SignupSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    dob:{
        type:Date,
        required:true,
    },
    email:{
        type:String,
        required:true,
    }
}) 
export const SignUpModel = mongoose.model('User',SignupSchema);