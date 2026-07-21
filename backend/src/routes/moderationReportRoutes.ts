import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware';
import {
  getAllModerationReports,
  resolveModerationReport,
  deleteModerationReportMessage,
} from '../controllers/moderationReportController';

const router = express.Router();

router.use(protect);
router.use(authorize(['admin', 'rh']));

router.get('/', getAllModerationReports);
router.post('/:id/resolve', resolveModerationReport);
router.delete('/:id/message', deleteModerationReportMessage);

export default router;