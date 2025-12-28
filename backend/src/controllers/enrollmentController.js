import * as enrollmentService from '../services/enrollmentService.js';

/**
 * Controller: Enroll a student in a course
 * Route: POST /api/courses/:courseId/enroll
 */
export const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id; // From JWT

    // Logic delegated to service
    const enrollment = await enrollmentService.enrollStudent(courseId, studentId);

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      enrollment,
    });
  } catch (err) {
    console.error('Enrollment Error:', err);
    // Handle specific errors
    const statusCode = err.statusCode || 500;
    
    // Check for duplicate key error (if race condition happens)
    if (err.code === 11000) {
       return res.status(400).json({ success: false, error: 'You are already enrolled in this course' });
    }

    res.status(statusCode).json({
      success: false,
      error: err.message || 'Failed to enroll in course',
    });
  }
};

/**
 * Controller: Get logged-in student's enrollments
 * Route: GET /api/student/enrollments
 */
export const getMyEnrollments = async (req, res) => {
  try {
    const studentId = req.user.id;

    const enrollments = await enrollmentService.getStudentEnrollments(studentId);

    res.json({
      success: true,
      enrollments,
    });
  } catch (err) {
    console.error('Fetch Enrollments Error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch enrollments',
    });
  }
};

/**
 * Controller: Get ALL enrollments (Admin)
 * Route: GET /api/enrollments
 */
export const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await enrollmentService.getAllEnrollments();
    res.json({ success: true, enrollments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * Controller: Admin manually enroll a student
 * Route: POST /api/enrollments/admin/enroll
 * Body: { studentId, courseId }
 */
export const adminEnrollStudent = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    if (!studentId || !courseId) {
      return res.status(400).json({ success: false, error: 'studentId and courseId are required' });
    }

    const enrollment = await enrollmentService.enrollStudent(courseId, studentId);
    res.status(201).json({ success: true, message: 'Student enrolled successfully', enrollment });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ success: false, error: err.message });
  }
};

/**
 * Controller: Admin manually remove a student
 * Route: POST /api/enrollments/admin/remove
 * Body: { studentId, courseId }
 */
export const adminRemoveEnrollment = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    if (!studentId || !courseId) {
      return res.status(400).json({ success: false, error: 'studentId and courseId are required' });
    }

    await enrollmentService.removeEnrollment(courseId, studentId);
    res.json({ success: true, message: 'Student removed from course' });
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({ success: false, error: err.message });
  }
};
