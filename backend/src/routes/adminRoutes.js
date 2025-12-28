import express from 'express';
import * as adminController from '../controllers/adminController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

// All routes here require Authentication and Admin role
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

// Get all users (with optional ?role= filter)
router.get('/', adminController.getAllUsers);

// Change user role
router.put('/:id/role', adminController.updateUserRole);

// Block/Unblock user
router.put('/:id/block', adminController.toggleUserBlock);

export default router;
