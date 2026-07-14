import { Request, Response, NextFunction } from 'express';
import Student from '../models/Student'; // Assurez-vous que le modèle Student est correct
import mongoose from 'mongoose';


// @desc    Créer un nouvel étudiant
// @route   POST /api/students
// @access  Private/Admin
export const createStudent = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, age, enrolled } = req.body;

  try {
    const studentExists = await Student.findOne({ email });

    if (studentExists) {
      return res.status(400).json({ message: 'Un étudiant avec cet email existe déjà.' });
    }

    const student = new Student({
      firstName,
      lastName,
      email,
      age,
      enrolled,
    });

    const savedStudent = await student.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// @desc    Obtenir tous les étudiants
// @route   GET /api/students
// @access  Private/Admin
export const getAllStudents = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const students = await Student.find().sort({ lastName: 1, firstName: 1 }); // Trier par nom de famille, puis prénom
    res.json(students);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// @desc    Obtenir un étudiant par ID
// @route   GET /api/students/:studentId
// @access  Private/Admin
export const getStudentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const student = await Student.findById(req.params.studentId);

    if (!student) {
      return res.status(404).json({ message: 'Étudiant non trouvé.' });
    }

    res.json(student);
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      return res.status(400).json({ message: 'ID d\'étudiant invalide.' });
    }
    console.error(error);
    next(error);
  }
};

// @desc    Mettre à jour un étudiant
// @route   PUT /api/students/:studentId
// @access  Private/Admin
export const updateStudent = async (req: Request, res: Response, next: NextFunction) => {
  const { firstName, lastName, email, age, enrolled } = req.body;

  try {
    const student = await Student.findById(req.params.studentId);

    if (!student) {
      return res.status(404).json({ message: 'Étudiant non trouvé.' });
    }

    if (firstName) student.firstName = firstName;
    if (lastName) student.lastName = lastName;
    if (email) student.email = email;
    if (age !== undefined) student.age = age;
    if (enrolled !== undefined) student.enrolled = enrolled;

    const updatedStudent = await student.save();
    res.json(updatedStudent);
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      return res.status(400).json({ message: 'ID d\'étudiant invalide.' });
    }
    console.error(error);
    next(error);
  }
};

// @desc    Supprimer un étudiant
// @route   DELETE /api/students/:studentId
// @access  Private/Admin
export const deleteStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const student = await Student.findById(req.params.studentId);

    if (!student) {
      return res.status(404).json({ message: 'Étudiant non trouvé.' });
    }

    await student.deleteOne();
    res.json({ message: 'Étudiant supprimé avec succès.' });
  } catch (error) {
    if (error instanceof Error && error.name === 'CastError') {
      return res.status(400).json({ message: 'ID d\'étudiant invalide.' });
    }
    console.error(error);
    next(error);
  }
};

export const studentController = {
  createStudent,
getAllStudents,
getStudentById,
updateStudent,
deleteStudent
}; 

export default studentController;