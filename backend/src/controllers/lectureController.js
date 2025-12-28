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
    const userRole = req.user.role;
    const fileBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    const lecture = await lectureService.addLecture(courseId, userId, userRole, title, fileBuffer, mimeType);

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

/**
 * Controller: Delete a lecture
 * Route: DELETE /api/lectures/:id
 */
export const deleteLecture = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    await lectureService.deleteLecture(id, userId, userRole);

    res.json({ success: true, message: 'Lecture deleted successfully' });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ success: false, error: err.message });
  }
};

/**
 * Controller: Update a lecture
 * Route: PUT /api/lectures/:id
 */
export const updateLecture = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const lecture = await lectureService.updateLecture(id, updates, userId, userRole);

    res.json({ success: true, message: 'Lecture updated', lecture });
  } catch (err) {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ success: false, error: err.message });
  }
};

