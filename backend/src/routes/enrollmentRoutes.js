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

// 3. Admin: Get all enrollments
router.get(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  enrollmentController.getAllEnrollments
);

// 4. Admin: Enroll a student manually
router.post(
  '/admin/enroll',
  authMiddleware,
  roleMiddleware(['admin']),
  enrollmentController.adminEnrollStudent
);

// 5. Admin: Remove a student manually
router.post(
  '/admin/remove',
  authMiddleware,
  roleMiddleware(['admin']),
  enrollmentController.adminRemoveEnrollment
);

export default router;

