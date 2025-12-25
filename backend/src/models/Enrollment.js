import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'dropped'],
    default: 'active',
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent duplicate enrollments (One student can enroll in a course only once)
enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

export default mongoose.model('Enrollment', enrollmentSchema);
