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