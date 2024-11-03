// routes/userRoutes.js
import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUserProfile,
    updateUserProfile,
    getUserInterestedEvents,
} from "../controllers/userController.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.route("/register").post(
    upload.single("avatar"),
    registerUser
);
router.route("/login").post(loginUser);

// Authenticated routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/profile").get(verifyJWT, getCurrentUserProfile);
router.route("/profile/update").patch(verifyJWT, upload.single("avatar"), updateUserProfile);
router.route("/interested-events").get(verifyJWT, getUserInterestedEvents);

export default router;












// import express from 'express';
// import { createUser, getUser } from '../controllers/userController.js';
// import { upload } from '../middlewares/multer.middleware.js';

// const router = express.Router();

// router.post('/', upload.single('avatar'), createUser);
// router.get('/:id', getUser);

// export default router;
