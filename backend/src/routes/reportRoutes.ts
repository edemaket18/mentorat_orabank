import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware';
import {
    createReport,
    getMyReports,
    getAllReportsForAdmin,
    getMenteeReportsForMentor,
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

const listReports = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const role = req.users?.role;
    if (role === 'admin' || role === 'rh') {
        return getAllReportsForAdmin(req, res, next);
    }
    if (role === 'mentor') {
        return getMenteeReportsForMentor(req, res, next);
    }
    return getMyReports(req, res, next);
};

router.route('/')
    .post(authorize(['stagiaire']), createOrUpdateReportValidator, createReport) // Seuls les stagiaires créent
    .get(listReports); // Liste tous les rapports pour rh/admin/mentor, uniquement les siens pour le stagiaire

router.route('/:reportId')
    .get(reportIdParamValidator, getReportById)
    .put(authorize(['stagiaire']), reportIdParamValidator, createOrUpdateReportValidator, updateReport) // Stagiaire met à jour son brouillon
    .delete(reportIdParamValidator, deleteReport); // Stagiaire supprime son brouillon, ou Admin supprime tout

router.route('/:reportId/submit')
    .put(authorize(['stagiaire']), reportIdParamValidator, /* submitReportValidator, */ submitReport); // Stagiaire soumet

router.route('/:reportId/validate')
    .put(authorize(['mentor', 'admin']), reportIdParamValidator, validateReportValidator, validateReport); // Mentor ou Admin valide/rejette

 
 



export default router;