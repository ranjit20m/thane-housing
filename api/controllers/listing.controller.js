import Listing from "../models/listing.model.js"; 
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing); // 201 => something is created
        
    } catch (error) {
        next(error);
    }
}

export const deleteListing = async (req, res, next) => {
    // check if the listing is present or not
    const listing = await Listing.findById(req.params.id);
    if(!listing) return next(errorHandler(404, 'Listing not found'));
    // if the listing exist, we want to check if the user is the owner of the listing
    if(req.user.id !== listing.userRef) return next(errorHandler(401, 'You can delete only your own listing!'));
    // if all ok
    try {
        await Listing.findByIdAndDelete(req.params.id); 
        // without await, was seeing that entry is deleted but with page refresh it was showing again 
        // - 2days to debug (: Clearing cache and doing npm install again
        res.status(200).json('Listing had been deleted.');
    } catch (error) {
        next(error);
    }
}