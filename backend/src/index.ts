import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db';
const app= express();
const port= process.env.PORT || 8080;
connectDb();

app.listen(port, ()=>{
    console.log(`Server running on Port ${port}`);
});