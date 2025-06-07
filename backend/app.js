import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fileUpload from 'express-fileupload';
import dbConnection from './database/dbConnection.js';
import { errorMiddleware } from './middlewares/error.js';
import messageRouter from './routes/messageRoutes.js';
import projectRouter from './routes/projectRoutes.js';
import skillRouter from './routes/skillRoutes.js';
import applicationRouter from './routes/softwareApplicationRoutes.js';
import timelineRouter from './routes/timelineRoutes.js';
import userRouter from './routes/userRoutes.js';

// Load environment variables
dotenv.config({ path: './config/config.env' });

const app = express();

// Middleware for frontend-backend connection
app.use(
  cors({
    origin: [
      process.env.PORTFOLIO_URL.trim(),
      process.env.DASHBOARD_URL.trim(),
      'http://localhost:5173', // Frontend development
    ],
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true, // Allow cookies
  })
);

// Middleware for cookies and parsing requests
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for file uploads
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp',
  })
);

// Routes
app.use('/api/v1/message', messageRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/timeline', timelineRouter);
app.use('/api/v1/softwareapplication', applicationRouter);
app.use('/api/v1/skill', skillRouter);
app.use('/api/v1/project', projectRouter);

// Database connection
(async () => {
  try {
    await dbConnection(); // Await database connection
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1); // Exit if the database connection fails
  }
})();

// Error handler middleware
app.use(errorMiddleware);

export default app;
