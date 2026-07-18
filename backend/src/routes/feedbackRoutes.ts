import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware';
import { createFeedback, getAllFeedback } from '../controllers/feedbackController';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createFeedback)
  .get(authorize(['admin', 'rh']), getAllFeedback);

export default router;