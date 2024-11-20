// routes/adminRoutes.js
// routes/adminRoutes.js
import express from 'express';
import { loginAdmin, createOrganization, updateOrganization, deleteOrganization } from '../controllers/adminController.js';
import verifyAdmin from '../middlewares/admin.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';  // Import the multer middleware

const router = express.Router();

// Admin DashBoard
// routes.get('/', getAdmin)

// Admin login route
router.post('/login', loginAdmin);

// Organization management routes (protected by verifyAdmin middleware)
// Use `upload.single('logo')` to handle optional logo file uploads
router.post('/create-organization', verifyAdmin, upload.single('logo'), createOrganization);
router.put('/organizations/:organization_id', verifyAdmin, upload.single('logo'), updateOrganization);
router.delete('/organizations/:organization_id', verifyAdmin, deleteOrganization);

export default router;










// // routes/adminRoutes.js
// import express from 'express';
// import { ApiError } from '../utils/ApiError.js';

// const router = express.Router();

// router.post('/verify', (req, res) => {
//   const { adminSecret } = req.body;
//   if (adminSecret === process.env.ADMIN_SECRET) {
//     res.status(200).json({ success: true });
//   } else {
//     res.status(403).json({ success: false, message: 'Unauthorized' });
//   }
// });

// export default router;
