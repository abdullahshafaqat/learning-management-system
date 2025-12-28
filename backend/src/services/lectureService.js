import Lecture from '../models/Lecture.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import cloudinary from '../utils/cloudinary.js';

/**
 * Upload file (video or image) to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} mimeType - File MIME type
 * @returns {Promise<Object>} Cloudinary upload result
 */
const uploadToCloudinary = (fileBuffer, mimeType) => {
  return new Promise((resolve, reject) => {
    // Determine resource type based on MIME type
    const resourceType = mimeType.startsWith('video/') ? 'video' : 'image';
    
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        folder: 'lms-lectures',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Add a new lecture to a course
 * @param {string} courseId - Course ID
 * @param {string} userId - User ID from token
 * @param {string} userRole - User Role from token (teacher/admin)
 * @param {string} title - Lecture title
 * @param {Buffer} fileBuffer - File buffer (video or image)
 * @param {string} mimeType - File MIME type
 * @returns {Promise<Object>} Created lecture
 */
export const addLecture = async (courseId, userId, userRole, title, fileBuffer, mimeType) => {
  // Validate inputs
  if (!fileBuffer) {
    throw new Error('File is required');
  }

  if (!title) {
    throw new Error('Title is required');
  }

  // Find course by courseId
  const course = await Course.findById(courseId);

  // Validate course exists
  if (!course) {
    const error = new Error('Course not found');
    error.statusCode = 404;
    throw error;
  }

  // Validate ownership: (Admin bypasses this check)
  if (userRole !== 'admin' && course.teacherId.toString() !== userId) {
    const error = new Error('You are not authorized to add lectures to this course');
    error.statusCode = 403;
    throw error;
  }

  // Determine content type from MIME type
  const contentType = mimeType.startsWith('video/') ? 'video' : 'image';

  // Upload file to Cloudinary
  const uploadResult = await uploadToCloudinary(fileBuffer, mimeType);

  // Create lecture document with appropriate URL field
  const lectureData = {
    courseId,
    title,
    contentType,
    videoPublicId: uploadResult.public_id,
    createdAt: new Date(),
  };

  // Set imageUrl or videoUrl based on content type
  if (contentType === 'video') {
    lectureData.videoUrl = uploadResult.secure_url;
  } else {
    lectureData.imageUrl = uploadResult.secure_url;
  }

  const newLecture = new Lecture(lectureData);

  await newLecture.save();

  // Return response with appropriate URL field
  const response = {
    _id: newLecture._id,
    title: newLecture.title,
    contentType: newLecture.contentType,
    createdAt: newLecture.createdAt,
  };

  if (contentType === 'video') {
    response.videoUrl = newLecture.videoUrl;
  } else {
    response.imageUrl = newLecture.imageUrl;
  }

  return response;
};

/**
 * Get all lectures for a course
 * @param {string} courseId - Course ID
 * @returns {Promise<Array>} Array of lectures
 */
/**
 * Get all lectures for a course
 * @param {string} courseId - Course ID
 * @param {string} userId - User ID requesting access
 * @param {string} userRole - Role of the user
 * @returns {Promise<Array>} Array of lectures
 */
export const getLectures = async (courseId, userId, userRole) => {
  // 1. Admin Bypass
  if (userRole === 'admin') {
    return await Lecture.find({ courseId }).select('title contentType videoUrl imageUrl createdAt');
  }

  const course = await Course.findById(courseId);
  if (!course) {
    const error = new Error('Course not found');
    error.statusCode = 404;
    throw error;
  }

  // 2. Teacher Check (Must be owner)
  if (userRole === 'teacher') {
    if (course.teacherId.toString() !== userId) {
      const error = new Error('Access denied. You are not the owner of this course.');
      error.statusCode = 403;
      throw error;
    }
    return await Lecture.find({ courseId }).select('title contentType videoUrl imageUrl createdAt');
  }

  // 3. Student Check (Must be enrolled)
  if (userRole === 'student') {
    const enrollment = await Enrollment.findOne({
      courseId,
      studentId: userId,
      status: 'active'
    });

    if (!enrollment) {
      const error = new Error('Access denied. You must be enrolled in this course to view lectures.');
      error.statusCode = 403;
      throw error;
    }
    return await Lecture.find({ courseId }).select('title contentType videoUrl imageUrl createdAt');
  }

  // 4. Fallback for any other roles or weird states
  const error = new Error('Access denied.');
  error.statusCode = 403;
  throw error;
};

/**
 * Delete a lecture
 * @param {string} lectureId - Lecture ID
 * @param {string} userId - User ID
 * @param {string} userRole - User Role
 */
export const deleteLecture = async (lectureId, userId, userRole) => {
  const lecture = await Lecture.findById(lectureId);
  if (!lecture) {
    throw new Error('Lecture not found'); // 404 handled in controller or by general error handler if we add one
  }

  // Check ownership of the COURSE this lecture belongs to
  const course = await Course.findById(lecture.courseId);
  if (!course) throw new Error('Course not found');

  if (userRole !== 'admin' && course.teacherId.toString() !== userId) {
    const error = new Error('Access denied. You do not own this course.');
    error.statusCode = 403;
    throw error;
  }

  // Delete from Cloudinary (Optional improvement: actually delete the file)
  // await cloudinary.uploader.destroy(lecture.videoPublicId);

  await Lecture.findByIdAndDelete(lectureId);
};

/**
 * Update a lecture
 * @param {string} lectureId
 * @param {Object} updates
 * @param {string} userId
 * @param {string} userRole
 */
export const updateLecture = async (lectureId, updates, userId, userRole) => {
  const lecture = await Lecture.findById(lectureId);
  if (!lecture) {
    const error = new Error('Lecture not found');
    error.statusCode = 404;
    throw error;
  }

  const course = await Course.findById(lecture.courseId);
  if (userRole !== 'admin' && course.teacherId.toString() !== userId) {
    const error = new Error('Access denied.');
    error.statusCode = 403;
    throw error;
  }

  Object.assign(lecture, updates);
  await lecture.save();
  return lecture;
};
