// src/app.ts
import express from 'express';
import mongoose from 'mongoose';
import { ENV } from './config/env';
import adminRoutes from './routes/admin.routes';
import teacherRoutes from './routes/teacher.routes';
import studentRoutes from './routes/student.routes';
import authRoutes from './routes/auth.routes';
import cors from 'cors';

const app = express();

app.use(cors(
    {
        origin: '*',
        methods: 'GET, POST, PUT, DELETE',
        allowedHeaders: 'Content-Type, Authorization'
    }
));

app.use(express.json());
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/auth', authRoutes);

mongoose.connect(ENV.MONGODB_URI || '')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

export default app;
