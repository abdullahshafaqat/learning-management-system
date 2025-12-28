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

/**
 * Controller: Get ALL courses (Admin)
 * Route: GET /api/courses
 */
export const getAllCourses = async (req, res) => {
  try {
    const courses = await courseService.getAllCourses();
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Controller: Update a course
 * Route: PUT /api/courses/:id
 */
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const course = await courseService.updateCourse(id, updates, userId, userRole);

    res.json({ success: true, message: 'Course updated', course });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ success: false, error: err.message });
  }
};

/**
 * Controller: Delete a course
 * Route: DELETE /api/courses/:id
 */
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    await courseService.deleteCourse(id, userId, userRole);

    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ success: false, error: err.message });
  }
};

