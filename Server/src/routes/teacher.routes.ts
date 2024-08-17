// src/routes/teacher.routes.ts
import { Router } from 'express';
import { TeacherController } from '../controllers/teacher.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { RoleMiddleware } from '../middlewares/role.middleware';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.use(AuthMiddleware.isAuthenticated);
router.use(RoleMiddleware.isTeacher);

router.post('/add-test', TeacherController.addTest);
router.post('/upload-questions', upload.single('file'), TeacherController.uploadQuestions);

export default router;
