import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import mentorshipController from '../controllers/mentorshipController';

const router = express.Router();

// Demandes de mentorat
router.post('/', authMiddleware, mentorshipController.createMentorshipRequest);
router.get('/', authMiddleware, mentorshipController.getMyMentorships);
router.get('/:mentorshipId', authMiddleware, mentorshipController.getMentorshipById);
router.put('/:mentorshipId/status', authMiddleware, mentorshipController.updateMentorshipStatus);
router.delete('/:mentorshipId', authMiddleware, mentorshipController.deleteMentorship);


// Progression et feedback
router.post('/feedback', authMiddleware, mentorshipController.addMentorshipFeedback);
router.post('/progress', authMiddleware, mentorshipController.addMentorshipProgress);

// Demandes spécifiques
router.get('/requests/received', authMiddleware, mentorshipController.getRequestsForMentor);
router.get('/requests/sent', authMiddleware, mentorshipController.getMyRequests);
router.put('/requests/:requestId/status', authMiddleware, mentorshipController.respondToRequest);

  


export default router;


























/*import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware';
import {
    createMentorshipRequest,
    getMyMentorships,
    getMentorshipById,
    updateMentorshipStatus,
    addMentorshipProgress,
    addMentorshipFeedback
} from '../controllers/mentorshipController';
import {
    mentorshipIdParamValidator,
    createMentorshipRequestValidator,
    updateMentorshipStatusValidator,
    addMentorshipProgressValidator,
    addMentorshipFeedbackValidator
} from '../middlewares/validators/mentorshipValidators';
import { param } from 'express-validator';


const router = express.Router();

router.use(protect); // Toutes les routes de mentorat sont protégées

router.route('/')
    .post(createMentorshipRequestValidator, createMentorshipRequest) // Stagiaire demande, ou Admin/Mentor initie
    .get(getMyMentorships); // Liste les mentorats pour l'utilisateur connecté (stagiaire, mentor ou tous pour admin)

router.route('/:mentorshipId')
    .get(mentorshipIdParamValidator, getMentorshipById); // Voir détails d'un mentorat

router.route('/:mentorshipId/status')
    .put(mentorshipIdParamValidator, updateMentorshipStatusValidator, updateMentorshipStatus); // Mentor accepte/rejette, ou les deux annulent/complètent

router.route('/:mentorshipId/progress')
    .post(mentorshipIdParamValidator, addMentorshipProgressValidator, addMentorshipProgress); // Stagiaire ou Mentor ajoutent du progrès

router.route('/:mentorshipId/feedback')
    .post(mentorshipIdParamValidator, addMentorshipFeedbackValidator, addMentorshipFeedback); // Stagiaire ou Mentor ajoutent un feedback

export default router;
*/