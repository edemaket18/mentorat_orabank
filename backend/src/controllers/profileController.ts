import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Profile from '../models/Profile';
import User from '../models/User'; // Assurez-vous que le modèle User est correct

// @desc    Obtenir le profil de l'utilisateur connecté
// @route   GET /api/profiles/me
// @access  Private
export const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await Profile.findOne({ user: req.users?._id }).populate('user', ['firstName', 'lastName', 'email', 'role']);

    if (!profile) {
      return res.status(404).json({ message: 'Profil non trouvé pour cet utilisateur' });
    }
    res.json(profile);
  } catch (error) {
    console.error(error);
    next(error);
  }
};



 
export const createProfile = async (userId: string) => {
  const newProfile = new Profile({
    user: userId,
    skills: ["JavaScript"],
    education: [{
      school: "École XYZ",
      degree: "Licence",
      field: "Informatique",
      from: new Date("2018-09-01")
    }]
  });
  await newProfile.save();
  return newProfile;
};

export const searchProfiles = async (query: string) => {
  return await Profile.searchProfiles(query); // Utilisation de la méthode statique
};





// @desc    Créer ou mettre à jour le profil de l'utilisateur connecté
// @route   POST /api/profiles/me
// @access  Private
export const createOrUpdateMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { department, position, bio, skills, experiences, education, avatar, linkedinProfile, githubProfile, interests } = req.body;

  const profileFields: any = { user: req.users?._id };
  if (department) profileFields.department = department;
  if (position) profileFields.position = position;
  if (bio) profileFields.bio = bio;
  if (avatar) profileFields.avatar = avatar;
  if (linkedinProfile) profileFields.linkedinProfile = linkedinProfile;
  if (githubProfile) profileFields.githubProfile = githubProfile;
  if (skills) profileFields.skills = Array.isArray(skills) ? skills : skills.split(',').map((skill: string) => skill.trim());
  if (interests) profileFields.interests = Array.isArray(interests) ? interests : interests.split(',').map((interest: string) => interest.trim());
  if (experiences) profileFields.experiences = experiences;
  if (education) profileFields.education = education;

  try {
    let profile = await Profile.findOne({ user: req.users?._id });

    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.users?._id },
        { $set: profileFields },
        { new: true, runValidators: true }
      ).populate('user', ['firstName', 'lastName', 'email', 'role']);
      return res.json(profile);
    }

    profile = new Profile(profileFields);
    await profile.save();
    await profile.populate('user', ['firstName', 'lastName', 'email', 'role']);
    res.status(201).json(profile);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// @desc    Obtenir tous les profils
// @route   GET /api/profiles
// @access  Public
export const getAllProfiles = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const profiles = await Profile.find().populate('user', ['firstName', 'lastName', 'email', 'role']);
    res.json(profiles);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// @desc    Obtenir un profil par ID utilisateur
// @route   GET /api/profiles/user/:userId
// @access  Public
export const getProfileByUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId }).populate('user', ['firstName', 'lastName', 'email', 'role']);

    if (!profile) {
      return res.status(404).json({ message: 'Profil non trouvé' });
    }
    res.json(profile);
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      return res.status(400).json({ message: 'ID utilisateur invalide' });
    }
    console.error(error);
    next(error);
  }
};

// @desc    Supprimer le profil et l'utilisateur connecté
// @route   DELETE /api/profiles/me
// @access  Private
export const deleteMyAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Profile.findOneAndDelete({ user: req.users?._id });
    await User.findByIdAndDelete(req.users?._id);
    res.json({ message: 'Utilisateur et profil supprimés avec succès.' });
  } catch (error) {
    console.error(error);
    next(error);
  }

  
}
// @desc    Mettre à jour le profil de l'utilisateur connecté
// @route   PUT /api/profiles/me
// @access  Private
export const updateMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { department, position, bio, skills, experiences, education, avatar, linkedinProfile, githubProfile, interests } = req.body;

  const profileFields: any = { user: req.users?._id };
  if (department) profileFields.department = department;
  if (position) profileFields.position = position;
  if (bio) profileFields.bio = bio;
  if (avatar) profileFields.avatar = avatar;
  if (linkedinProfile) profileFields.linkedinProfile = linkedinProfile;
  if (githubProfile) profileFields.githubProfile = githubProfile;
  if (skills) profileFields.skills = Array.isArray(skills) ? skills : skills.split(',').map((skill: string) => skill.trim());
  if (interests) profileFields.interests = Array.isArray(interests) ? interests : interests.split(',').map((interest: string) => interest.trim());
  if (experiences) profileFields.experiences = experiences;
  if (education) profileFields.education = education;

  try {
    let profile = await Profile.findOne({ user: req.users?._id });

    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.users?._id },
        { $set: profileFields },
        { new: true, runValidators: true }
      ).populate('user', ['firstName', 'lastName', 'email', 'role']);
      return res.json(profile);
    }

    profile = new Profile(profileFields);
    await profile.save();
    await profile.populate('user', ['firstName', 'lastName', 'email', 'role']);
    res.status(201).json(profile);
  } catch (error) {
    console.error(error);
    next(error);
  }

}
export const profileController = {
  getMyProfile,
  createOrUpdateMyProfile,
  getAllProfiles,
  getProfileByUserId,
  deleteMyAccount,
  updateMyProfile
 
}

export default profileController;
