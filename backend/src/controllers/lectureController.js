import * as lectureService from '../services/lectureService.js';

/**
 * Controller: Add a new lecture to a course
 * Route: POST /api/courses/:courseId/lectures
 */
export const addLecture = async (req, res) => {
  try {
    // Security: Only teachers can add lectures
    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only teachers can add lectures'
      });
    }

    // Validation: File must be present
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'File is required (video or image)'
      });
    }

    const { courseId } = req.params;
    const { title } = req.body;
    const userId = req.user.id;
    const fileBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    const lecture = await lectureService.addLecture(courseId, userId, title, fileBuffer, mimeType);

    res.status(201).json({
      success: true,
      message: 'Lecture added successfully',
      lecture,
    });
  } catch (err) {
    console.error('Error adding lecture:', err);
    const statusCode = err.statusCode || 400;
    res.status(statusCode).json({ 
      success: false, 
      error: err.message || 'Failed to add lecture' 
    });
  }
};

/**
 * Controller: Get all lectures for a course
 * Route: GET /api/courses/:courseId/lectures
 */
export const getLectures = async (req, res) => {
  try {
    const { courseId } = req.params;

    const lectures = await lectureService.getLectures(courseId, req.user.id, req.user.role);

    res.json({
      success: true,
      lectures,
    });
  } catch (err) {
    console.error('Error fetching lectures:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Failed to fetch lectures' 
    });
  }
};
