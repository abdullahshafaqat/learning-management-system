import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import lectureRoutes from './routes/lectureRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRoutes);

// Course & Lecture Routes (mounted on /api/courses)
app.use('/api', courseRoutes);
app.use('/api/lectures', lectureRoutes);

// Enrollment Routes
app.use('/api/enrollments', enrollmentRoutes); // Handles /:courseId/enroll
app.use('/api/enrollments', enrollmentRoutes); // Handles /enrollments


app.get('/', (req, res) => {
  res.send('LMS Backend API is running');
});

export default app;
