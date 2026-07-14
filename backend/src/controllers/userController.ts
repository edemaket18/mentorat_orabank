import { Request, Response } from 'express';
import User from '../models/User';
import mongoose from 'mongoose';


export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const {
      skills,
      education,
      experiences,
      isPublic,
      showSkills,
      showCv,
      cvUrl,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        skills,
        education,
        experiences,
        isPublic,
        showSkills,
        showCv,
        cvUrl,
      },
      { new: true }
    );

    return res.status(200).json(updatedUser);
  } catch (err) {
    return res.status(500).json({ message: 'Erreur lors de la mise à jour du profil.' });
  }
};


 /*
export default mongoose.model("", {
  skills: {} as any,
  education: {} as any,
  experiences: {} as any,
  cvUrl: {} as any,

});
 

export default userController;

*/