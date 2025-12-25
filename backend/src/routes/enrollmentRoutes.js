import express from 'express';
import * as enrollmentController from '../controllers/enrollmentController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

// 1. Enroll in a course (Student only)
router.post(
  '/courses/:courseId/enroll',
  authMiddleware,
  roleMiddleware(['student']), // 🔒 Only students can enroll
  enrollmentController.enrollInCourse
);

// 2. Get my enrollments (Student only)
router.get(
  '/student/enrollments',
  authMiddleware,
  roleMiddleware(['student']), // 🔒 Only students have "my enrollments"
  enrollmentController.getMyEnrollments
);

export default router;
