 import express from 'express';
import {
  protect,
  authorizeRoles,
  isAdmin,
  adminMiddleware,
  authMiddleware
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
import { getAnalyticsData } from '../controllers/analyticsController';
import { sendAttestationEmail } from '../utils/mailer';
import User from '../models/User';

const router = express.Router();

// Middleware d'administration global
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
router.put('/profile', authMiddleware, updateProfile);

// Routes de validation de stage
router.post('/validate-stage/:userId', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "Stagiaire non trouvé" });
    }

    // Mise à jour de la validation
    user.stage = {
      ...user.stage,
      validatedAt: new Date(),
      validatedBy: req.user.fullName,
      status: 'validated',
      certificateUrl: new RTCCertificate 
    };

    await user.save();
    res.json({ message: 'Stage validé et certificat généré.' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erreur lors de la validation du stage'});
      console.error(error);
    next(error); 
  }
});

router.patch('/validate-stagiaire/:userId', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        isValidated: true,
        validatedAt: new Date(),
        validatedBy: req.user?.id || 'admin',
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    await sendAttestationEmail(user);
    res.json({ message: "Stagiaire validé avec succès", user });
  } catch (error) {
    res.status(500).json({ 
      message: "Erreur lors de la validation"});
       console.error(error);
    next(error);  
  }
});

// Routes d'analytiques
router.get('/analytics', adminMiddleware, getAnalyticsData);




router.patch('/update-cv', authMiddleware, async (req, res) => {
  const { cvUrl } = req.body;
  
  if (!cvUrl) {
    return res.status(400).json({ error: 'URL du CV requise' });
  }

  await User.findByIdAndUpdate(req.user.id, { 
    cvUrl,
    cvUploadedAt: new Date() 
  });

  res.json({ success: true });
});

function next(error: unknown) {
  throw new Error('Function not implemented.');
}

export default router;


