import nodemailer from 'nodemailer';
import { generateAttestationPDF } from './pdfGenerator';

export const sendAttestationEmail = async (user: any) => {
  const filePath = await generateAttestationPDF(user);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER, // adresse Gmail
      pass: process.env.MAIL_PASS, // mot de passe appli
    },
  });

  await transporter.sendMail({
    from: '"Orabank Mentorat RH" <no-reply@orabank.tg>',
    to: user.email,
    subject: 'Attestation de stage Orabank',
    text: `Bonjour ${user.firstName},\n\nVeuillez trouver ci-joint votre attestation de stage.\n\nCordialement.`,
    attachments: [
      {
        filename: `attestation-${user.lastName}.pdf`,
        path: filePath,
      },
    ],
  });
};
