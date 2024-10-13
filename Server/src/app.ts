import express from 'express';
import mongoose from 'mongoose';
import { ENV } from './config/env';
import adminRoutes from './routes/admin.routes';
import teacherRoutes from './routes/teacher.routes';
import studentRoutes from './routes/student.routes';
import authRoutes from './routes/auth.routes';
import cors from 'cors';
import loggerMiddleware from './middlewares/logger.middleware';

const app = express();

app.use(loggerMiddleware);
app.use(cors({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization'
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is Up and Running');
});

// Remove this line for serverless deployment
// app.use('/uploads', express.static('uploads'));

app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/auth', authRoutes);

// Move MongoDB connection logic to a separate function
let isConnected = false;
const connectToDatabase = async () => {
    if (isConnected) {
        return;
    }

    try {
        await mongoose.connect(ENV.MONGODB_URI || '');
        isConnected = true;
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
};

// Middleware to ensure database connection before processing requests
app.use(async (req, res, next) => {
    await connectToDatabase();
    next();
});

export default app;