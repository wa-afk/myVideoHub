import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const connectDb= async () => {
    try {
        const db= await mongoose.connect(process.env.MONGO_URI as string);
        console.log("Connected to database.");
    } catch (error) {
        console.error(`Error connecting to database ${error}`);
    }
};

export default connectDb;