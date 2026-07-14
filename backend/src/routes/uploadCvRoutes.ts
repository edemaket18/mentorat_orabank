 import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// Configuration sécurisée du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/cvs/';
    
    // Crée le dossier s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${randomUUID()}_${Date.now()}`;
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${uniqueSuffix}_${sanitizedName}`);
  }
});

// Filtrage des fichiers
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non supporté. Seuls les PDF et DOCX sont acceptés.'));
  }
};

// Configuration de Multer avec limites
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1
  }
});

// Middleware pour nettoyer les fichiers en cas d'erreur
const cleanUpOnError = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.on('finish', () => {
    if (res.statusCode >= 400 && req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Erreur lors du nettoyage du fichier:', err);
      });
    }
  });
  next();
};

/**
 * @route POST /upload-cv
 * @description Upload un fichier CV (PDF ou DOCX)
 * @access Privé (utilisateurs authentifiés)
 * @returns {Object} URL du CV uploadé
 */
router.post(
  '/upload-cv',
  authMiddleware, // Sécurité : seul les utilisateurs authentifiés
  cleanUpOnError, // Nettoyage des fichiers en cas d'erreur
  upload.single('cv'), // Gestion du fichier
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false,
          error: 'Aucun fichier fourni ou fichier invalide' 
        });
      }

      // Vérification supplémentaire du type (double sécurité)
      const allowedExtensions = ['.pdf', '.doc', '.docx'];
      const ext = path.extname(req.file.originalname).toLowerCase();
      
      if (!allowedExtensions.includes(ext)) {
        throw new Error('Extension de fichier non autorisée');
      }

      // Construction de l'URL sécurisée
      const fileUrl = `/uploads/cvs/${req.file.filename}`;
      
      // Ici vous pourriez enregistrer l'URL dans la base de données
      // await User.findByIdAndUpdate(req.user.id, { cvUrl: fileUrl });

      return res.status(201).json({
        success: true,
        url: fileUrl,
        filename: req.file.originalname,
        size: req.file.size
      });

    } catch (error) {
      console.error('Erreur lors de l\'upload du CV:', error);
      return res.status(500).json({
        success: false,
        error: 'Erreur lors du traitement du fichier',
        //details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route DELETE /delete-cv
 * @description Supprime le CV de l'utilisateur
 * @access Privé
 */
router.delete(
  '/delete-cv', 
  authMiddleware,
  async (req, res) => {
    try {
      // const user = await User.findById(req.user.id);
      // if (!user?.cvUrl) {
      //   return res.status(404).json({ error: 'Aucun CV trouvé' });
      // }

      // const filePath = path.join(__dirname, '..', user.cvUrl);
      // fs.unlinkSync(filePath);
      
      // await User.findByIdAndUpdate(req.user.id, { $unset: { cvUrl: 1 } });
      
      return res.status(200).json({ 
        success: true,
        message: 'CV supprimé avec succès' 
      });
    } catch (error) {
      console.error('Erreur suppression CV:', error);
      return res.status(500).json({
        success: false,
        error: 'Erreur lors de la suppression du CV'
      });
    }
  }
);

export default router;