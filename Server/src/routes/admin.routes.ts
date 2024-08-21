// src/routes/admin.routes.ts
import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(AuthMiddleware.isAuthenticated);

router.post('/dashboard/assign-teachers', AdminController.assignTeachersToBatch);
router.post('/dashboard/profile', AdminController.profile);
export default router;
