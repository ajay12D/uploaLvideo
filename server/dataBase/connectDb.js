import mongoose from 'mongoose';
import dotenv from 'dotenv';
    dotenv.config()

export const connectDb =async() => {
    const res = await mongoose.connect(process.env.MONGO_URI);
           if(res) {
            console.log('connection is establish with dataBase')
           }
           else{
            console.log('connection is not establish dataBase')
           }
}