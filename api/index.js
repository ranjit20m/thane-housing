import express from 'express'; // Add "type": "module" in package.json otherwise require will need to be used
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB).then(() => {
    console.log('Connected to MongoDB')
}).catch((err) => {
    console.log(err);
})

const app = express();

// listen to port 3000
app.listen(3000, () => { console.log('Server is running on port 3000!!!')});