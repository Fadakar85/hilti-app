import { Router } from 'express';
import { assignAdmin } from '../controllers/adminController';
import { authenticateToken, checkRole } from '../../middleware/verifyToken';

const router = Router();

// فقط ادمین‌ها می‌توانند نقش‌ها را تغییر دهند
router.post('/assign-admin', authenticateToken, checkRole(['admin']), assignAdmin);

export default router;
