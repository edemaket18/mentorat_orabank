import { Request, Response, NextFunction } from 'express';
import Skill from '../models/Skill'; // Assurez-vous que le modèle Skill est correct
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';


// @desc    Créer une nouvelle compétence
// @route   POST /api/skills
// @access  Private/Admin
export const createSkill = async (req: Request, res: Response, next: NextFunction) => {
  const { name, description } = req.body;

  try {
    const skillExists = await Skill.findOne({ name });

    if (skillExists) {
      return res.status(400).json({ message: 'Cette compétence existe déjà.' });
    }

    const skill = new Skill({
      name,
      description,
    });

    const savedSkill = await skill.save();
    res.status(201).json(savedSkill);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// @desc    Obtenir toutes les compétences
// @route   GET /api/skills
// @access  Public
export const getAllSkills = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const skills = await Skill.find().sort({ name: 1 }); // Trier par nom
    res.json(skills);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// @desc    Obtenir une compétence par ID
// @route   GET /api/skills/:skillId
// @access  Public
export const getSkillById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const skill = await Skill.findById(req.params.skillId);

    if (!skill) {
      return res.status(404).json({ message: 'Compétence non trouvée.' });
    }

    res.json(skill);
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      return res.status(400).json({ message: 'ID de compétence invalide.' });
    }
    console.error(error);
    next(error);
  }
};

// @desc    Mettre à jour une compétence
// @route   PUT /api/skills/:skillId
// @access  Private/Admin
export const updateSkill = async (req: Request, res: Response, next: NextFunction) => {
 const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { skillId } = req.params;
  const { name, level, category, isActive } = req.body;

  try {
    // 2. Recherche de la compétence
    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({ message: 'Compétence introuvable.' });
    }

    // 3. Mise à jour conditionnelle
    if (name) skill.name = name;
    if (level) skill.level = level;
    if (category) skill.category = category;
    if (isActive !== undefined) skill.isActive = isActive;

    await skill.save();

    // 4. Réponse
    res.status(200).json({
      message: 'Compétence mise à jour avec succès.',
      data: skill,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la mise à jour de la compétence.'});
 console.error(error);
    next(error);     
  }
};

// @desc    Supprimer une compétence
// @route   DELETE /api/skills/:skillId
// @access  Private/Admin
export const deleteSkill = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { skillId } = req.params;

  try {
    // 2. Perform deletion
    const deletedSkill = await Skill.findByIdAndDelete(skillId);
    
    if (!deletedSkill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    // 3. Respond
    res.status(200).json({
      message: 'Skill deleted successfully',
      deletedId: skillId
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error deleting skill'});
 console.error(error);
    next(error);     
     
  }
};


export const skillController = {
 
createSkill,
getAllSkills,
getSkillById,
updateSkill,
deleteSkill
 
};

export default skillController;