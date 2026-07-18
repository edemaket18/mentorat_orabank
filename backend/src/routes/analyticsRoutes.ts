import express from 'express';
import { getAnalytics } from '../controllers/analyticsController';
import { protect, adminOnly } from '../middlewares/authMiddleware';
import { exportAnalyticsCSV } from '../controllers/analyticsController';


const router = express.Router();

router.get('/', protect, adminOnly, getAnalytics);
router.get('/export', protect, adminOnly, exportAnalyticsCSV);


export default router;