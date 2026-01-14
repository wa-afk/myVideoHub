import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db';
import routes from './route/index';
import passportJwtStrategy from './config/passportJwtStrategy';
import cors from 'cors';

const corsOptions= {
    origin: [                          /*Acceptable cross-origin request origins*/
        "http://localhost:5173"
    ],
    optionSuceessStatus: 200,
}
dotenv.config();
const app= express();
const port= process.env.PORT || 8080;
connectDb();

app.use(cors(corsOptions));
app.use(passportJwtStrategy.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use('/api/v1', routes);
app.listen(port, ()=>{
    console.log(`Server running on Port ${port}`);
});