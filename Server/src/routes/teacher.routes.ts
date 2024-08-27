// src/routes/teacher.routes.ts
import { Router } from 'express';
import { TeacherController } from '../controllers/teacher.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.use(AuthMiddleware);

router.post('/add-test', TeacherController.addTest);
router.post('/upload-questions', upload.single('file'), TeacherController.uploadQuestions);
router.post('/dashboard/profile', TeacherController.profile);

export default router;