// src/routes/student.routes.ts
import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(AuthMiddleware.isAuthenticated);

router.post('/enter-test', StudentController.enterTest);
router.post('/dashboard/profile', StudentController.profile);
export default router;
