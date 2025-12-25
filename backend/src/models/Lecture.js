import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  contentType: {
    type: String,
    enum: ['video', 'image'],
    required: true,
  },
  videoUrl: {
    type: String,
    required: false,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  videoPublicId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Lecture', lectureSchema);
