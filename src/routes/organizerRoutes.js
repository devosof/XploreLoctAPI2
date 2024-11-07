// routes/organizerRoutes.js
import express from 'express';
import {
  registerOrganizer,
  getOrganizer,
  updateOrganizer,
  deleteOrganizer
} from '../controllers/organizerController.js';
import verifyJWT from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', verifyJWT, registerOrganizer);       // Register as an organizer
router.get('/profile', verifyJWT, getOrganizer);              // Get organizer profile
router.put('/profile', verifyJWT, updateOrganizer);           // Update organizer profile
router.delete('/profile', verifyJWT, deleteOrganizer);        // Delete organizer profile

export default router;
