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

export default router;
