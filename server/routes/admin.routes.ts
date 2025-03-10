import { Router } from 'express';
import { assignAdmin } from '../controllers/adminController.js';
import { authenticateToken, checkRole } from '../../middleware/verifyToken.js';

const router = Router();

// فقط ادمین‌ها می‌توانند نقش‌ها را تغییر دهند
router.post('/assign-admin', authenticateToken, checkRole(['admin']), assignAdmin);

export default router;
