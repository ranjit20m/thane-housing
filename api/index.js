import express from 'express'; // Add "type": "module" in package.json otherwise require will need to be used
// import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB).then(() => {
    console.log('Connected to MongoDB')
}).catch((err) => {
    console.log(err);
})

// Set app server
const app = express();

// Cors
// app.use(cors);
// app.use(cors());
// app.use(
//     cors({
//         origin: ["http://localhost:3000"],
//         methods: ["GET", "POST", "PUT", "UPDATE"],
//         credentials: true,
//         allowedHeaders: ["Content-Type", "Authorization"],
//     })
// );
// Allow json as input of server
app.use(express.json()); // console log will display undefined if not added this for sending POST request
app.use(cookieParser());
// listen to port 3000
app.listen(3000, () => { console.log('Server is running on port 3000!!!')});

// Create api route => req=Client and res=Server to interact between two
// app.get('/testjson', (req, res) => {
//     res.json({
//         message: 'Hello World!'
//     })
// })  
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

// Middleware for error handling
// err is the error that is coming from the input of the middleware, 
// req is data from browser, 
// res is response from server, 
// next is to go to next middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
}) 

