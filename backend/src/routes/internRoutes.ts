import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware';
import { getMyContracts } from '../controllers/contractController';
import { getMyNotifications } from '../controllers/notificationController';
import { getInternStatisticsController } from '../controllers/statisticsController';

const router = express.Router();

router.use(protect);

// NB: seules les routes contrats, notifications et statistiques sont
// implémentées ici pour l'instant. Les autres endpoints attendus par le
// frontend sous /api/intern/* (documents, évaluations, feedback, sessions...)
// n'existent pas encore côté backend — voir le constat fait séparément.
router.get('/contracts', authorize(['stagiaire']), getMyContracts);
router.get('/notifications', authorize(['stagiaire']), getMyNotifications);
router.get('/statistics', authorize(['stagiaire']), getInternStatisticsController);

export default router;