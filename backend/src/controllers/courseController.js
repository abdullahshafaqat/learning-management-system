import * as courseService from '../services/courseService.js';

/**
 * Controller: Create a new course
 * Route: POST /api/courses
 */
export const createCourse = async (req, res) => {
  try {
    // Security: Only teachers can create courses
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only teachers can create courses'
      });
    }

    const { title, code, description } = req.body;
    const teacherId = req.user.id;

    const newCourse = await courseService.createCourse(teacherId, title, code, description);

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course: newCourse
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, error: 'Course code already exists' });
    }
    res.status(400).json({ success: false, error: err.message });
  }
};

/**
 * Controller: Get all courses for the logged-in teacher
 * Route: GET /api/teacher/courses
 */
export const getTeacherCourses = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const courses = await courseService.getTeacherCourses(teacherId);

    res.json({
      success: true,
      courses
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
