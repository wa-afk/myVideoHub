import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db';
import routes from './route/index';

const app= express();
const port= process.env.PORT || 8080;
connectDb();

app.use('/api/v1', routes);
app.listen(port, ()=>{
    console.log(`Server running on Port ${port}`);
});