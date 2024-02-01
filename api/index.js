import express from 'express'; // Add "type": "module" in package.json otherwise require will need to be used
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js'
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB).then(() => {
    console.log('Connected to MongoDB')
}).catch((err) => {
    console.log(err);
})

// Set app server
const app = express();

// listen to port 3000
app.listen(3000, () => { console.log('Server is running on port 3000!!!')});

// Create api route => req=Client and res=Server to interact between two
// app.get('/testjson', (req, res) => {
//     res.json({
//         message: 'Hello World!'
//     })
// })  
app.use("/api/user", userRouter)

