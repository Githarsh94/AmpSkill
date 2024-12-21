import { Router } from 'express';
import { aiController } from '../controllers/ai.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
const router = Router();

router.use(AuthMiddleware);

router.get('/generateQues', aiController.generateQuestion);
export default router;