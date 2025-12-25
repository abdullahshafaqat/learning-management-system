import express from 'express';
import * as lectureController from '../controllers/lectureController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Allowed roles for adding lectures: teacher, admin
const authorizedRoles = ['teacher', 'admin'];

// POST /courses/:courseId/lectures - Add lecture (teacher/admin only)
router.post('/courses/:courseId', 
  authMiddleware, 
  roleMiddleware(authorizedRoles),
  upload.single('File'),
  lectureController.addLecture
);

// GET /courses/:courseId/lectures - Get all lectures (authenticated users)
router.get('/courses/:courseId', 
  authMiddleware,
  lectureController.getLectures
);

export default router;
