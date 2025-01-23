import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser';
import connectDB from './config/mongoDB.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
dotenv.config();
const port = process.env.port || 4000;
const  app = express();  //creates app
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));//
 
const allowedOrigins = ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the origin
    } else {
      callback(new Error('Not allowed by CORS')); // Reject other origins
    }
  },
  credentials: true, // Allow cookies and credentials
}));
      
// const allowedOrigins=['http://localhost:5173/']

// app.use(cors({origin:allowedOrigins, credentials:true}));

// api endi points 
 app.use('/auth', authRouter);
 app.use('/user', userRouter);
app.get('/',(req,res)=>{
    res.send('Hello World!');
});

connectDB();
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
