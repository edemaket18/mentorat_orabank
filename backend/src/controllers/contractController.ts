import { Request, Response, NextFunction } from 'express';
import Contract from '../models/Contract';

// @desc    Liste de tous les contrats (RH / admin)
// @route   GET /api/contracts
// @access  Private (rh, admin)
export const getAllContracts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contracts = await Contract.find()
      .populate('intern', 'firstName lastName email')
      .sort({ createdAt: -1 });

    const formatted = contracts.map((contract) => {
      const plain: any = contract.toObject();
      const intern: any = plain.intern;
      return {
        ...plain,
        intern: intern
          ? { ...intern, name: `${intern.firstName ?? ''} ${intern.lastName ?? ''}`.trim() }
          : intern,
      };
    });

    res.json(formatted);
  } catch (error) {
    next(error);
  }
};

// @desc    Contrats du stagiaire connecté
// @route   GET /api/intern/contracts
// @access  Private (stagiaire)
export const getMyContracts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contracts = await Contract.find({ intern: req.users?._id })
      .populate('intern', 'firstName lastName')
      .sort({ createdAt: -1 });

    const formatted = contracts.map((contract) => {
      const plain: any = contract.toObject();
      const intern: any = plain.intern;
      return {
        _id: plain._id,
        internName: intern ? `${intern.firstName ?? ''} ${intern.lastName ?? ''}`.trim() : '',
        startDate: plain.startDate,
        endDate: plain.endDate,
        status: plain.status,
      };
    });

    res.json(formatted);
  } catch (error) {
    next(error);
  }
};

// @desc    Détail d'un contrat
// @route   GET /api/contracts/:id
// @access  Private
export const getContractById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contract = await Contract.findById(req.params.id).populate('intern', 'firstName lastName email');
    if (!contract) return res.status(404).json({ message: 'Contrat introuvable.' });
    res.json(contract);
  } catch (error) {
    next(error);
  }
};

// @desc    Créer un contrat
// @route   POST /api/contracts
// @access  Private (rh, admin)
export const createContract = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, intern, parties, startDate, endDate, status } = req.body;
    const contract = await Contract.create({ title, description, intern, parties, startDate, endDate, status });
    res.status(201).json(contract);
  } catch (error) {
    next(error);
  }
};

// @desc    Mettre à jour un contrat
// @route   PUT /api/contracts/:id
// @access  Private (rh, admin)
export const updateContract = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contract = await Contract.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contract) return res.status(404).json({ message: 'Contrat introuvable.' });
    res.json(contract);
  } catch (error) {
    next(error);
  }
};

// @desc    Supprimer un contrat
// @route   DELETE /api/contracts/:id
// @access  Private (rh, admin)
export const deleteContract = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const contract = await Contract.findByIdAndDelete(req.params.id);
    if (!contract) return res.status(404).json({ message: 'Contrat introuvable.' });
    res.json({ message: 'Contrat supprimé.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Liste des contrats pour l'administration
// @route   GET /api/admin/contracts
// @access  Private (admin)
export const getAllContractsForAdmin = getAllContracts;