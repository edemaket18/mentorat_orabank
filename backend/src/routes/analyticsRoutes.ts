// src/routes/analyticsRoutes.ts
import express from 'express';
import { getAnalytics } from '../controllers/analyticsController';
import { isAdmin } from '../middlewares/authMiddleware';
import { exportAnalyticsCSV } from '../controllers/analyticsController';


const router = express.Router();

router.get('/', isAdmin, getAnalytics);
router.get('/export', isAdmin, exportAnalyticsCSV);


export default router;
