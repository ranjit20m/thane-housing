import express from "express";
import { test, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get('/test', test);
// Updating user: For updating user, we need to check first if user is authenticated or not
// When we sign in the user, we created a token inside the cookie. We can use that token to verify the user
// So we know which user we are updating. If not authenticated we should get an error
// So create another function called verifyToken and 
// then before going to update the user, we want to check the person to be verified or not
router.post('/update/:id',verifyToken, updateUser); // 
export default router;