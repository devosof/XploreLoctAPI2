import express from 'express';
import { createUser, getUser } from '../controllers/userController.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

router.post('/', upload.single('avatar'), createUser);
router.get('/:id', getUser);

export default router;
