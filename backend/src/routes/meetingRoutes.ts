import express from 'express';
import {
  createMeeting,
  getMeetingsForUser,
  confirmMeeting,
  cancelMeeting,
  deleteMeeting,
} from '../controllers/meetingController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authMiddleware, createMeeting);
router.get('/', authMiddleware, getMeetingsForUser);
router.patch('/:id/confirm', authMiddleware, confirmMeeting);
router.patch('/:id/cancel', authMiddleware, cancelMeeting);
router.delete('/:id', authMiddleware, deleteMeeting);

export default router;
