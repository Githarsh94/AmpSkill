// src/routes/admin.routes.ts
import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(AuthMiddleware);

router.post('/dashboard/assignTeachers', AdminController.assignTeachersToBatch);
router.post('/dashboard/unassignTeachers', AdminController.unassignTeachersFromBatch);
router.post('/dashboard/addBatch', AdminController.addBatch);
router.post('/dashboard/profile', AdminController.profile);
router.post('/dashboard/getBatches', AdminController.getBatches);
router.post('/dashboard/deleteBatch', AdminController.deleteBatch);
export default router;