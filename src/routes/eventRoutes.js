import express from 'express';
import { createEvent, getEvent, updateEvent, deleteEvent, listEvents } from '../controllers/eventController.js';
import verifyJWT from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', verifyJWT, createEvent);
router.get('/', listEvents);
router.get('/:id', getEvent);
router.put('/:id', verifyJWT, updateEvent);
router.delete('/:id', verifyJWT, deleteEvent);

export default router;
