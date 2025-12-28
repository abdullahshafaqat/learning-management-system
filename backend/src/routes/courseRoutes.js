import express from 'express';
import * as courseController from '../controllers/courseController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Allowed roles: teacher, admin
const authorizedRoles = ['teacher', 'admin'];

router.post('/courses', 
  authMiddleware, 
  roleMiddleware(authorizedRoles), 
  courseController.createCourse
);

router.get('/courses/teacher', 
  authMiddleware, 
  roleMiddleware(authorizedRoles), 
  courseController.getTeacherCourses
);

// Get ALL courses (Admin only)
router.get('/courses', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  courseController.getAllCourses
);

// Update course (Teacher/Admin)
router.put('/courses/:id', 
  authMiddleware, 
  roleMiddleware(['teacher', 'admin']), 
  courseController.updateCourse
);

// Delete course (Teacher/Admin)
router.delete('/courses/:id', 
  authMiddleware, 
  roleMiddleware(['teacher', 'admin']), 
  courseController.deleteCourse
);

export default router;

