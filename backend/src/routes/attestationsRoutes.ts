import express from 'express';
import { generateAttestationPDF } from '../utils/generateAttestation';
import User from '../models/User';

const router = express.Router();

router.get('/:userId.pdf', async (req, res) => {
  const user = await User.findById(req.params.userId);

  if (!user || !user.isValidated) {
    return res.status(404).json({ message: 'Stagiaire non validé ou inexistant' });
  }

  generateAttestationPDF(res, user);
});

export default router;
