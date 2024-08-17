// src/routes/student.routes.ts
import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { RoleMiddleware } from '../middlewares/role.middleware';

const router = Router();

router.use(AuthMiddleware.isAuthenticated);
router.use(RoleMiddleware.isStudent);

router.post('/enter-test', StudentController.enterTest);

export default router;
