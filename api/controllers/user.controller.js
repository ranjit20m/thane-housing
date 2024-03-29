import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';

export const test = (req, res) => {
    res.json({
        message: 'Hello World!'
    })
}

export const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) return next(errorHandler(401, "You can only update your own account!"));
    // if user is correct, update the user
    try {
        // if user is trying to change the password, we need to hash the password
        if(req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }
        // Update user => Model.findByIdAndUpdate(id, update, options, callback)
        // Here update: we pass an object with an updated value that we want to update in our database.
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: { // mongodb: The $set operator replaces the value of a field with the specified value.
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, {new: true}); // When new is true, it returns the modified document rather than the original. Default is false
        // Separate password
        const {password, ...rest} = updatedUser._doc;
        // Return the response
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}

export const deleteUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) return next(errorHandler(401, 'You can only delete your own account'));
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json('User has been deleted!');
    } catch (error) {
        next(error)
    }
}

export const getUserListing = async (req, res, next) => {
    // check if the person trying to get listing is the real person who is the owner of that
    // if someone is authenticated must get his own listing
    if(req.user.id !== req.params.id) return next(errorHandler(401, 'You can only view your own listing!'));
     try {
        const listings = await Listing.find({userRef: req.params.id});
        res.status(200).json(listings); //status 200 then return listings
     } catch (error) {
        next(error);
     }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) return next(errorHandler(404, 'User not found!'));
        const {password: pw, ...rest} = user._doc; 
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}