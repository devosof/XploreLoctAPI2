// routes/speakerRoutes.js
import express from 'express';
import { registerSpeaker, updateSpeakerDetails } from '../controllers/speakerController.js';
import verifyJWT from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', verifyJWT, registerSpeaker); // Register as a speaker
router.patch('/update', verifyJWT, updateSpeakerDetails); // Update speaker details

export default router;
