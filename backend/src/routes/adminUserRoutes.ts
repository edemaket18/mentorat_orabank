import express from 'express';
import {
  protect,
  authorizeRoles,
} from '../middlewares/authMiddleware';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  deleteUser
} from '../controllers/adminUserController';
import {
  userIdParamValidator,
  updateUserRoleValidator,
  updateUserStatusValidator
} from '../middlewares/validators/adminUserValidators';
import { updateProfile } from '../controllers/userController';
import { getAnalyticsData, getAnalytics } from '../controllers/analyticsController';
import { deleteMentorshipAsAdmin } from '../controllers/matchingController';
import { sendAttestationEmail } from '../utils/mailer';
import User from '../models/User';
import Settings from '../models/Settings';

const router = express.Router();

// Middleware d'administration global — s'applique à toutes les routes
// ci-dessous, inutile de le répéter route par route.
router.use(protect);
router.use(authorizeRoles('admin'));

// Routes d'administration des utilisateurs
router.route('/users')
  .get(getAllUsers);

router.route('/users/:userId')
  .get(userIdParamValidator, getUserById)
  .delete(userIdParamValidator, deleteUser);

router.route('/users/:userId/role')
  .put(userIdParamValidator, updateUserRoleValidator, updateUserRole);

router.route('/users/:userId/status')
  .put(userIdParamValidator, updateUserStatusValidator, updateUserStatus);

// Route de profil utilisateur
router.put('/profile', updateProfile);

// Routes de validation de stage
// NB: aucune page du frontend n'appelle encore ces deux routes — la
// génération réelle de certificat n'est pas implémentée (pas de service de
// génération de PDF branché ici), donc certificateUrl reste vide pour
// l'instant plutôt que de simuler une valeur.
router.post('/validate-stage/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Stagiaire non trouvé' });
    }

    user.stage = {
      ...user.stage,
      validatedAt: new Date(),
      validatedBy: `${req.users?.firstName ?? ''} ${req.users?.lastName ?? ''}`.trim(),
      status: 'validated',
    };

    await user.save();
    res.json({ message: 'Stage validé.' });
  } catch (error) {
    next(error);
  }
});

router.patch('/validate-stagiaire/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        isValidated: true,
        validatedAt: new Date(),
        validatedBy: req.users?._id,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    await sendAttestationEmail(user);
    res.json({ message: 'Stagiaire validé avec succès', user });
  } catch (error) {
    next(error);
  }
});

// Suppression d'un accompagnement (utilisé par AdminMentorships.tsx)
router.delete('/mentorships/:id', deleteMentorshipAsAdmin);

// Routes d'analytiques
router.get('/analytics', getAnalyticsData);

// Statistiques (utilisées par AdminReports / AdminDashboardPage)
router.get('/stats', getAnalytics);
router.get('/dashboard/stats', getAnalytics);

// Paramètres plateforme (document unique)
router.get('/settings', async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.json(settings);
  } catch (error) {
    next(error);
  }
});

router.put('/settings', async (req, res, next) => {
  try {
    const { platformName, contactEmail, maintenanceMode } = req.body;
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings({});
    if (platformName !== undefined) settings.platformName = platformName;
    if (contactEmail !== undefined) settings.contactEmail = contactEmail;
    if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;
    await settings.save();
    res.json(settings);
  } catch (error) {
    next(error);
  }
});

router.patch('/update-cv', async (req, res, next) => {
  try {
    const { cvUrl } = req.body;

    if (!cvUrl) {
      return res.status(400).json({ error: 'URL du CV requise' });
    }

    await User.findByIdAndUpdate(req.users?._id, {
      cvUrl,
      cvUploadedAt: new Date(),
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;