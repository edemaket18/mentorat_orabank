 import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User'; // modèle mongoose
import { protect } from '../middlewares/authMiddleware';
import { registerUser, loginUser, forgotPassword, resetPassword, updateProfile } from '../controllers/authController'; 
 import { registerValidator, loginValidator } from '../middlewares/validators/authValidators';
 import { sendEmail } from '../utils/sendEmail';
 import { passwordChangedTemplate } from '../emailTemplates/passwordChanged';
 import nodemailer from 'nodemailer';
import crypto from 'crypto';
 


const router = express.Router();




// Config NodeMailer (à adapter selon ton fournisseur SMTP)
const transporter = nodemailer.createTransport({
   service: 'gmail', 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});



router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/current', protect, async (req, res) => {
  res.json(req.users);
});

router.put('/update-profile', protect, updateProfile);

 
router.post('/change-password', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Champs manquants.' });
  }

  try {
    const user = await User.findById(req.users?._id);
    if (!user)
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Mot de passe actuel incorrect.' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
 
     await sendEmail({
  to: user.email,
  subject: 'Mot de passe modifié',
  html: passwordChangedTemplate(user.firstName),
});

 
    res.json({ message: 'Mot de passe mis à jour avec succès.' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

router.get('/verify-email', async (req, res) => {
  const { token } = req.query;
  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: 'Token invalide ou expiré.' });
  }

  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  res.status(200).json({ message: 'E-mail vérifié avec succès !' });
});

router.post('/resend-email', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé." });
  }

  if (user.emailVerified) {
    return res.status(400).json({ message: "Adresse e-mail déjà vérifiée." });
  }

  const token = crypto.randomBytes(32).toString("hex");
  user.emailVerificationToken = token;
  user.emailVerificationExpires = Date.now() + 3600000; // 1h
  await user.save();

  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  await sendEmail({
    to: user.email,
    subject: "Nouveau lien de vérification d’e-mail",
    html: `
      <h2>Bonjour ${user.firstName}</h2>
      <p>Voici un nouveau lien pour vérifier votre adresse e-mail :</p>
      <a href="${verificationLink}">Vérifier mon e-mail</a>
    `,
  });

  return res.status(200).json({ message: "Un nouveau lien a été envoyé par e-mail." });
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


 

export default router;