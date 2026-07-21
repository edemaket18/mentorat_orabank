import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware';
import { getAllMatchings } from '../controllers/matchingController';

const router = express.Router();

router.use(protect);

// NB: seule la route "all" (vue RH) est implémentée ici pour l'instant.
// Le reste de /api/matching/* attendu par matching.api.ts (liste des
// mentors disponibles pour un stagiaire, envoi de demande, mes matchs...)
// fait doublon avec ce qui existe déjà sous /api/intern/mentors et
// /api/intern/matching-requests — non dupliqué ici volontairement.
router.get('/all', authorize(['rh', 'admin']), getAllMatchings);

export default router;