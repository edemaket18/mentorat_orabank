 import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware';
import { getRHStatistics } from '../controllers/statisticsController';
import { getStagiairesForEvaluation, submitEvaluation } from '../controllers/evaluationController';

const router = express.Router();

router.use(protect);

// NB: seules les routes statistiques et évaluations sont implémentées ici
// pour l'instant. Le reste de /api/rh/* attendu par rh.api.ts (interns,
// mentors, matching, mentorships, candidates...) n'existe pas encore côté
// backend — voir le constat fait séparément.
router.get('/statistics', authorize(['rh', 'admin']), getRHStatistics);
router.get('/evaluations/stagiaires', authorize(['rh', 'admin']), getStagiairesForEvaluation);
router.post('/evaluations/:id', authorize(['rh', 'admin']), submitEvaluation);

export default router;