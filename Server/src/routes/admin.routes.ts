// src/routes/admin.routes.ts
import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { RoleMiddleware } from '../middlewares/role.middleware';

const router = Router();

router.use(AuthMiddleware.isAuthenticated);
router.use(RoleMiddleware.isAdmin);

router.post('/assign-teachers', AdminController.assignTeachersToBatch);

export default router;
