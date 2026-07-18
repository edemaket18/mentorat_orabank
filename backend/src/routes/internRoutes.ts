 import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware';
import { getMyContracts } from '../controllers/contractController';
import { getMyNotifications } from '../controllers/notificationController';
import { getInternStatisticsController } from '../controllers/statisticsController';
import { getMyTasks, createTask, toggleTask } from '../controllers/taskController';
import {
  getMentorsForMatching,
  requestMentor,
  getInternDashboard,
} from '../controllers/internPortalController';
import { getMyMessages, sendMessage } from '../controllers/mentorMessageController';

const router = express.Router();

router.use(protect);
router.use(authorize(['stagiaire']));

// NB: seules les routes ci-dessous sont implémentées pour l'instant.
// Les autres endpoints attendus par le frontend sous /api/intern/*
// (documents, évaluations, feedback, sessions...) n'existent pas encore
// côté backend — voir le constat fait séparément.
router.get('/contracts', getMyContracts);
router.get('/notifications', getMyNotifications);
router.get('/statistics', getInternStatisticsController);
router.get('/dashboard', getInternDashboard);
router.get('/mentors', getMentorsForMatching);
router.post('/matching-requests', requestMentor);
router.get('/tasks', getMyTasks);
router.post('/tasks', createTask);
router.patch('/tasks/:id/toggle', toggleTask);
router.get('/messages', getMyMessages);
router.post('/messages', sendMessage);

export default router;