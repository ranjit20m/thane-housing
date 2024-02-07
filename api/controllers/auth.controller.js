import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

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
        next(error); // => api/index.js => app.use((err, req, res, next)
        // next(errorHandler(500, 'Error from the function that we created!')) // manual error
    }    
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        // Check if user is valid
        const validUser = await User.findOne({ email });
        if( !validUser) return next(errorHandler(404, 'Wrong credentials!'));
        // Check if password is correct
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if( !validPassword) return next(errorHandler(401, 'Wrong credentials!'));
        // Create token
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
        // Remove the password before sending it back even it is encrupted. Sending password is not a good practice
        const {password: pw, ...rest} = validUser._doc; // seperate the password. We still get password if dont use _doc
        // Save this token as cookie and retun rest which is without password and not the validUser
        // res.cookie('access_token', token, {httpOnly: true}).status(200).json(validUser);
        res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest);

    } catch (error) {
        next(error); 
    }
}