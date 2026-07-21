import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware';
import { getRHStatistics } from '../controllers/statisticsController';
import { getStagiairesForEvaluation, submitEvaluation } from '../controllers/evaluationController';
import {
  getAllInterns,
  deleteInternById,
  getAllMentorsForRH,
  removeMentorById,
  getUnmatchedInterns,
  getAvailableMentorsForRH,
  assignMentorToIntern,
  getAllApplications,
  approveApplication,
  getDepartingStagiaires,
  archiveStagiaire,
} from '../controllers/rhPortalController';

const router = express.Router();

router.use(protect);
router.use(authorize(['rh', 'admin']));

router.get('/statistics', getRHStatistics);
router.get('/evaluations/stagiaires', getStagiairesForEvaluation);
router.post('/evaluations/:id', submitEvaluation);

router.get('/interns', getAllInterns);
router.delete('/interns/:id', deleteInternById);
router.get('/interns/unmatched', getUnmatchedInterns);
router.post('/interns/:internId/assign-mentor', assignMentorToIntern);

router.get('/mentors', getAllMentorsForRH);
router.delete('/mentors/:id', removeMentorById);
router.get('/mentors/available', getAvailableMentorsForRH);

router.get('/applications', getAllApplications);
router.post('/applications/:id/approve', approveApplication);

router.get('/stagiaires/departing', getDepartingStagiaires);
router.post('/stagiaires/:id/archive', archiveStagiaire);

export default router;