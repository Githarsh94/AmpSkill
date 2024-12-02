// src/routes/student.routes.ts
import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { isStudent } from '../middlewares/isStudent.middleware';
import { ReportsController } from '../controllers/reports.controller';

const router = Router();

router.use(AuthMiddleware);
router.use(isStudent);
router.post('/dashboard/profile', StudentController.profile);
router.post('/test/available-tests', StudentController.availableTests);
router.post('/test/startTest', StudentController.startTest);
router.post('/test/submitTest', StudentController.submitTest);
router.post('/test/getTestDuration', StudentController.getTestDuration);
router.post('/test/markTheAnswer', StudentController.markTheAnswer);
router.post('/test/getAllTests', StudentController.getAllTests);
router.post('/report/getTestScoreCard', ReportsController.fetchTestScoreCard);
router.post('/report/getSolutionReport', ReportsController.fetchSolutionReportOfTest);
router.post('/report/getQuestionReport', ReportsController.fetchQuestionReportOfTest);
export default router;
