// routes/organizerRoutes.js
import express from 'express';
import {
  registerOrganizer,
  getOrganizer,
  updateOrganizer,
  deleteOrganizer,
  getOrganizerEvents,
} from '../controllers/organizerController.js';
import { getAvailableSpeakers } from '../controllers/speakerController.js';
import verifyJWT from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', verifyJWT, registerOrganizer);       // Register as an organizer
router.get('/profile', verifyJWT, getOrganizer);              // Get organizer profile
router.put('/profile', verifyJWT, updateOrganizer);           // Update organizer profile
router.delete('/profile', verifyJWT, deleteOrganizer);        // Delete organizer profile


// Fetch all events created by the organizer
router.get('/events', verifyJWT, getOrganizerEvents);

// to fetch all the speakers:
router.get('/speakers', verifyJWT, getAvailableSpeakers); // Endpoint to get available speakers

export default router;
