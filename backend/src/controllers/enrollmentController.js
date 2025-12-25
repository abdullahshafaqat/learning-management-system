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
