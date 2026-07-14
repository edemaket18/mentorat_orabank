import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import ExperienceShare from '../models/ExperienceShare'; // Assurez-vous que le modèle est correct

// @desc    Créer une nouvelle publication (article, question, astuce)
// @route   POST /api/experiences
// @access  Private (Stagiaires et Mentors)
export const createExperience = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, category, tags } = req.body;

    try {
        const newExperience = new ExperienceShare({
            title,
            content,
            category,
            tags: tags || [],
            author: req.users?._id,
        });

        const experience = await newExperience.save();
        const populatedExperience = await ExperienceShare.findById(experience._id)
            .populate('author', 'firstName lastName avatar');
        res.status(201).json(populatedExperience);
    } catch (error) {
        next(error);
    }
};

// @desc    Obtenir toutes les publications (avec filtres optionnels: catégorie, tags, auteur)
// @route   GET /api/experiences
// @access  Public ou Private (selon la politique de visibilité)
export const getAllExperiences = async (req: Request, res: Response, next: NextFunction) => {
    const { category, tag, authorId, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;
    const query: any = {};

    if (category) query.category = category as string;
    if (tag) query.tags = { $in: [tag as string] };
    if (authorId) query.author = authorId as string;

    const sortOptions: any = {};
    sortOptions[sortBy as string] = order === 'asc' ? 1 : -1;

    try {
        const experiences = await ExperienceShare.find(query)
            .populate('author', 'firstName lastName avatar email role')
            .sort(sortOptions)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));

        const totalExperiences = await ExperienceShare.countDocuments(query);

        res.json({
            experiences,
            currentPage: Number(page),
            totalPages: Math.ceil(totalExperiences / Number(limit)),
            totalExperiences,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Obtenir une publication par son ID
// @route   GET /api/experiences/:experienceId
// @access  Public ou Private
export const getExperienceById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const experience = await ExperienceShare.findById(req.params.experienceId)
            .populate('author', 'firstName lastName avatar email role');

        if (!experience) {
            return res.status(404).json({ message: 'Publication non trouvée.' });
        }
        res.json(experience);
    } catch (error) {
        if (error instanceof Error && error.name === 'CastError') {
            return res.status(400).json({ message: 'ID de publication invalide' });
        }
        next(error);
    }
};

// @desc    Mettre à jour une publication (seulement l'auteur ou un admin)
// @route   PUT /api/experiences/:experienceId
// @access  Private
export const updateExperience = async (req: Request, res: Response, next: NextFunction) => {
    const { title, content, category, tags } = req.body;
    const { experienceId } = req.params;

    try {
        const experience = await ExperienceShare.findById(experienceId);

        if (!experience) {
            return res.status(404).json({ message: 'Publication non trouvée.' });
        }

        if (experience.author.toString() !== req.users?._id.toString() && req.users?.role !== 'admin') {
            return res.status(403).json({ message: 'Action non autorisée.' });
        }

        if (title) experience.title = title;
        if (content) experience.content = content;
        if (category) experience.category = category;
        if (tags) experience.tags = tags;

        experience.updatedAt = new Date();
        await experience.save();

        const populatedExperience = await ExperienceShare.findById(experience._id)
            .populate('author', 'firstName lastName avatar');
        res.json(populatedExperience);
    } catch (error) {
        next(error);
    }
};

// @desc    Supprimer une publication (seulement l'auteur ou un admin)
// @route   DELETE /api/experiences/:experienceId
// @access  Private
export const deleteExperience = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const experience = await ExperienceShare.findById(req.params.experienceId);

        if (!experience) {
            return res.status(404).json({ message: 'Publication non trouvée.' });
        }

        if (experience.author.toString() !== req.users?._id.toString() && req.users?.role !== 'admin') {
            return res.status(403).json({ message: 'Action non autorisée.' });
        }

        await ExperienceShare.findByIdAndDelete(req.params.experienceId);
        res.json({ message: 'Publication supprimée avec succès.' });
    } catch (error) {
        next(error);
    }
};
