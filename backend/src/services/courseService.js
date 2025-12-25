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
