import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware';
import { getMentorStatistics } from '../controllers/statisticsController';
import { createEvaluationForMentor, getMyEvaluations } from '../controllers/evaluationController';
import { getMentorSessions, createSession, updateSessionStatus } from '../controllers/sessionController';
import { getMyMessages, sendMessage } from '../controllers/mentorMessageController';
import {
  getMyInterns,
  getMyMentorships,
  endMentorship,
  getMyDepartures,
  getAvailableCandidates,
  getMyMentorReports,
} from '../controllers/mentorPortalController';

const router = express.Router();

router.use(protect);
router.use(authorize(['mentor']));

// NB: seules les routes ci-dessous sont implémentées pour l'instant.
// Le reste de /api/mentors/* attendu par mentor.api.ts (CRUD complet,
// disponibilité, recherche par expertise...) n'existe pas encore côté
// backend — voir le constat fait séparément.
router.get('/me/statistics', getMentorStatistics);
router.get('/me/interns', getMyInterns);
router.get('/me/mentorships', getMyMentorships);
router.patch('/me/mentorships/:id/end', endMentorship);
router.get('/me/departures', getMyDepartures);
router.get('/me/candidates', getAvailableCandidates);
router.get('/me/reports', getMyMentorReports);
router.get('/me/evaluations', getMyEvaluations);
router.post('/me/evaluations', createEvaluationForMentor);
router.get('/me/sessions', getMentorSessions);
router.post('/me/sessions', createSession);
router.patch('/me/sessions/:id/status', updateSessionStatus);
router.get('/me/messages', getMyMessages);
router.post('/me/messages', sendMessage);

export default router;