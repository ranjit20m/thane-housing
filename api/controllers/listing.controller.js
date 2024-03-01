import Listing from "../models/listing.model.js"; 
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing); // 201 => something is created
        
    } catch (error) {
        next(error);
    }
};

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
};

export const updateListing = async(req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if(!listing) return next(errorHandler(404, 'Listing not found'));
    if(req.user.id !== listing.userRef) return next(errorHandler(401, 'You can update your own listing!'));
    try {
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new : true} // to get the updated one
        );
        res.status(200).json(updatedListing);
    } catch (error) {
        next(error);
    }
};

export const fetchListing = async(req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if(!listing) return next(errorHandler(404, 'Listing not found'));
        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
};

export const searchListings = async (req, res, next) => {
    try {        
        const limit = parseInt(req.query.limit) || 9; // Limit the page for pagination        
        const startIndex = parseInt(req.query.startIndex) || 0; // Start index to know which page we are in       
        let offer = req.query.offer;  // Offer
        if(offer === undefined || offer === 'false') { offer = {$in: [false, true]}; };
        let furnished = req.query.furnished; // Furnished
        if(furnished === undefined || furnished === 'false') { furnished = {$in: [false, true]}; };
        let parking = req.query.parking; // Parking
        if(parking === undefined || parking === 'false') { parking = {$in: [false, true]}; };
        let type = req.query.type; // Type
        if(type === undefined || type === 'all') { type = {$in: ['sale', 'rent']}; };        
        const searchTerm = req.query.searchTerm || ''; // SearchTerm
        const sort = req.query.sort || 'createdAt'; // Sort
        const order = req.query.order || 'desc' // Order
        // Get the listing
        const listings = await Listing
            .find({ name: {$regex: searchTerm, $options: 'i'}, offer, furnished, parking, type})
            .sort({ [sort]: order })
            .limit(limit)
            .skip(startIndex);

        return res.status(200).json(listings);

    } catch (error) {
        next(error);
    }
};