import express from 'express';
import { createEvent, getEvent, updateEvent, deleteEvent, listEvents } from '../controllers/eventController.js';
import authenticate from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authenticate, createEvent);
router.get('/', listEvents);
router.get('/:id', getEvent);
router.put('/:id', authenticate, updateEvent);
router.delete('/:id', authenticate, deleteEvent);

export default router;
