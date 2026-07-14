import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware';
import {
    createReport,
    getMyReports,
    getReportById,
    updateReport,
    submitReport,
    validateReport,
    deleteReport
} from '../controllers/reportController';
import {
    reportIdParamValidator,
    createOrUpdateReportValidator,
    validateReportValidator,
    submitReportValidator
    // submitReportValidator // Si besoin
} from '../middlewares/validators/reportValidators';
import { param } from 'express-validator';
 


 
const router = express.Router();

router.use(protect); // Toutes les routes de rapports sont protégées

router.route('/')
    .post(authorize(['stagiaire']), createOrUpdateReportValidator, createReport) // Seuls les stagiaires créent
    .get(getMyReports); // Liste les rapports (filtrés par rôle)

router.route('/:reportId')
    .get(reportIdParamValidator, getReportById)
    .put(authorize(['stagiaire']), reportIdParamValidator, createOrUpdateReportValidator, updateReport) // Stagiaire met à jour son brouillon
    .delete(reportIdParamValidator, deleteReport); // Stagiaire supprime son brouillon, ou Admin supprime tout

router.route('/:reportId/submit')
    .put(authorize(['stagiaire']), reportIdParamValidator, /* submitReportValidator, */ submitReport); // Stagiaire soumet

router.route('/:reportId/validate')
    .put(authorize(['mentor', 'admin']), reportIdParamValidator, validateReportValidator, validateReport); // Mentor ou Admin valide/rejette

 
 



export default router;
