import express from 'express';
import { protect, authorize, authMiddleware } from '../middlewares/authMiddleware';
import {
  getMyProfile,
  createOrUpdateMyProfile,
  getAllProfiles,
  getProfileByUserId,
} from '../controllers/profileController';
import { createOrUpdateProfileValidator, objectIdValidator } from '../middlewares/validators/profileValidators';
import { param } from 'express-validator';
import Profile from '../models/Profile';
 
const router = express.Router();

// Routes pour le profil de l'utilisateur connecté
router.route('/me')
  .get(protect, getMyProfile)
  .post(protect, createOrUpdateProfileValidator, createOrUpdateMyProfile);
 

// Routes pour les administrateurs ou mentors pour voir d'autres profils
router.route('/')
  .get(protect, authorize(['admin', 'mentor']), getAllProfiles); // Seuls admin et mentor peuvent voir tous les profils

router.route('/user/:userId')
  .get(protect, objectIdValidator('userId'), getProfileByUserId); // Tout utilisateur connecté peut voir un profil par ID

  // PUT /api/profile/visibility
router.put('/visibility', authMiddleware, async (req, res) => {
  const { isPublic, isAvailable } = req.body;

  try {
    const updatedProfile = await  Profile.findOneAndUpdate(
      { userId: req.user._id },
      { isPublic, isAvailable },
      { new: true }
    );

    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour." });
  }
});


export default router;