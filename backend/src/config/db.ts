import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ debug: false });
const connectDb= async () => {
    try {
        const dns = require('dns');
        dns.setServers(['8.8.8.8', '8.8.4.4']); //Temporary workaround due to dns errors
        const db= await mongoose.connect(process.env.MONGO_URI as string);
        console.log("Connected to database.");
    } catch (error) {
        console.error(`Error connecting to database ${error}`);
    }
};

export default connectDb;