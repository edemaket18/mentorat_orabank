import express from 'express';
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} from '../controllers/studentController';
import { param } from 'express-validator';


const router = express.Router();

// Créer un étudiant
router.post('/', createStudent);

// Récupérer tous les étudiants
router.get('/', getAllStudents);

// Récupérer un étudiant par ID
router.get('/:id', getStudentById);

// Mettre à jour un étudiant
router.put('/:id', updateStudent);

// Supprimer un étudiant
router.delete('/:id', deleteStudent);

export default router;