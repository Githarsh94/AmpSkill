// src/routes/teacher.routes.ts
import { Router } from 'express';
import { TeacherController } from '../controllers/teacher.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.use(AuthMiddleware);
router.post('/dashboard/profile', TeacherController.profile);
router.put('/dashboard/batch/update',TeacherController.updateBatch);
router.post('/dashboard/batch/view',TeacherController.viewBatches);
router.post('/dashboard/batch/getStudents',TeacherController.getStudentsOfBatch);
router.post('/dashboard/test/uploadTest',TeacherController.uploadTest);
router.post('/dashboard/test/upload/addQue',TeacherController.addSingleQues);
router.put('/dashboard/test/upload/updateQue',TeacherController.updateSingleQues);

export default router;