import Course from '../models/Course.js';

/**
 * Create a new course
 * @param {string} teacherId - Teacher ID from token
 * @param {string} title - Course title
 * @param {string} code - Course code
 * @param {string} description - Course description
 * @returns {Promise<Object>} Created course
 */
export const createCourse = async (teacherId, title, code, description) => {
  const newCourse = new Course({
    title,
    code,
    description,
    teacherId,
    status: 'published',
    createdAt: new Date()
  });

  await newCourse.save();
  return newCourse;
};

/**
 * Get all courses for a teacher
 * @param {string} teacherId - Teacher ID from token
 * @returns {Promise<Array>} Array of courses
 */
export const getTeacherCourses = async (teacherId) => {
  const courses = await Course.find({ teacherId });
  return courses;
};

/**
 * Get ALL courses (Admin only)
 * @returns {Promise<Array>} Array of all courses
 */
export const getAllCourses = async () => {
  const courses = await Course.find().populate('teacherId', 'name email');
  return courses;
};

/**
 * Update a course
 * @param {string} courseId - Course ID
 * @param {Object} updates - Fields to update
 * @param {string} userId - Requesting user ID
 * @param {string} userRole - Requesting user role
 * @returns {Promise<Object>} Updated course
 */
export const updateCourse = async (courseId, updates, userId, userRole) => {
  const course = await Course.findById(courseId);
  if (!course) {
    const error = new Error('Course not found');
    error.statusCode = 404;
    throw error;
  }

  // Auth Limit: If not admin, must be the owner
  if (userRole !== 'admin' && course.teacherId.toString() !== userId) {
    const error = new Error('Access denied. You do not own this course.');
    error.statusCode = 403;
    throw error;
  }

  Object.assign(course, updates);
  await course.save();
  return course;
};

/**
 * Delete a course
 * @param {string} courseId - Course ID
 * @param {string} userId - Requesting user ID
 * @param {string} userRole - Requesting user role
 * @returns {Promise<void>}
 */
export const deleteCourse = async (courseId, userId, userRole) => {
  const course = await Course.findById(courseId);
  if (!course) {
    const error = new Error('Course not found');
    error.statusCode = 404;
    throw error;
  }

  // Auth Limit: If not admin, must be the owner
  if (userRole !== 'admin' && course.teacherId.toString() !== userId) {
    const error = new Error('Access denied. You do not own this course.');
    error.statusCode = 403;
    throw error;
  }

  await Course.findByIdAndDelete(courseId);
};

