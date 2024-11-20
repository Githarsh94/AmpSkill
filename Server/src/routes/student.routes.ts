// src/routes/student.routes.ts
import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(AuthMiddleware);
router.post('/dashboard/profile', StudentController.profile);
router.post('/dashboard/available-tests', StudentController.availableTests);
router.post('/dashboard/startTest', StudentController.startTest);
router.post('/dashboard/submitTest', StudentController.submitTest);
router.post('/dashboard/getTestDuration', StudentController.getTestDuration);
router.post('/dashboard/markTheAnswer', StudentController.markTheAnswer);
router.post('/dashboard/getAllTests', StudentController.getAllTests);
export default router;
