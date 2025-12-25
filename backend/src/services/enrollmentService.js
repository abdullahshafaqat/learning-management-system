import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';

/**
 * Enroll a student in a course
 * @param {string} courseId - ID of the course
 * @param {string} studentId - ID of the student
 * @returns {Promise<Object>} Created enrollment
 */
export const enrollStudent = async (courseId, studentId) => {
  // 1. Check if course exists
  const course = await Course.findById(courseId);
  if (!course) {
    const error = new Error('Course not found');
    error.statusCode = 404;
    throw error;
  }

  // 2. Check if already enrolled
  const existingEnrollment = await Enrollment.findOne({
    studentId,
    courseId,
  });

  if (existingEnrollment) {
    const error = new Error('You are already enrolled in this course');
    error.statusCode = 400; // Bad Request
    throw error;
  }

  // 3. Create enrollment
  const enrollment = new Enrollment({
    studentId,
    courseId,
    status: 'active',
  });

  await enrollment.save();
  return enrollment;
};

/**
 * Get all courses a student is enrolled in
 * @param {string} studentId - ID of the student
 * @returns {Promise<Array>} List of enrollments with course details
 */
export const getStudentEnrollments = async (studentId) => {
  const enrollments = await Enrollment.find({ studentId })
    .populate({
      path: 'courseId',
      select: 'title code description teacherId status', // Select fields to show
      populate: {
        path: 'teacherId',
        select: 'username email', // Show teacher details
      },
    })
    .sort({ enrolledAt: -1 }); // Newest first

  return enrollments;
};
