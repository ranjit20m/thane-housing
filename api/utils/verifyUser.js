import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    // To get the token from the cookie, install package cookie-parser
    const token = req.cookies.access_token //  we gave name access_token in signin function in auth.controller.js
    // Once we get the token we can verify it
    if(!token) return next(errorHandler(401, 'Unathorized')) ;

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => { // This will give two things err and user
        if(err) return next(errorHandler(403, 'Forbidden'));
        // if no error send this user to next thing i.e. updateUser => router.post('/update/:id', verifyToken, updateUser); 
        req.user = user; // save the user to the request
        next(); // and then go to next section i.e. updateUser
    })
}