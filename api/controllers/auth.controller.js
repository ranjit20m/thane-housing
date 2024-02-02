import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
    // we want to get the information from browser(client=req) which is coming from body
    // console.log(req.body)
    // we want to save the details from req.body inside the database, so destructure it
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10) // 10 = salt length
    // use the model to create new user
    const newUser = new User({ username, email, password: hashedPassword})
    // save it. This saving takes times so use await in order to prevent error and make the function async
    try {
        await newUser.save();     
        res.status(201).json("User created successfully");
    } catch (error) {
        // res.status(500).json(error.message);
        next(error);
        // next(errorHandler(500, 'Error from the function that we created!')) // manual error
    }    
}