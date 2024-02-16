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

export const google = async(req, res, next) => {
    try {        
        const user = await User.findOne({email: req.body.email});
        if(user) {
            // if user exist, register the user
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
            const {password: pw, ...rest} = user._doc;
            res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest);
        } else {
            // else create the new user
            // password is required per model and for google password its already there so we need some random password
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8); 
            // -8 => last eight digit 0.12345678 => 12345678 => + 8 + 8 => for 16 digit
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({                
                username: req.body.username.split(' ').join('').replace(',','').toLowerCase() 
                        + Math.random().toString(36).slice(-4), // username => Ranjit Madame => ranjitmadame1234
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo
            });
            await newUser.save();
            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);
            const {password: pw, ...rest} = newUser._doc;
            res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest);
        }

    } catch (error) {
        next(error)
    }
}

export const signout = async (req, res, next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out!');
    } catch (error) {
        next(error);
    }
}