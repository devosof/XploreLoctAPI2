import express from 'express';
import { createOrganization, updateOrganization, deleteOrganization } from '../controllers/organizationController.js';
import verifyAdmin from '../middlewares/admin.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

router.post('/', verifyAdmin, upload.single('logo'), createOrganization);           // Create an organization
router.put('/:organization_id', verifyAdmin, upload.single('logo'), updateOrganization); // Update an organization
router.delete('/:organization_id', verifyAdmin, deleteOrganization);                // Delete an organization

export default router;
