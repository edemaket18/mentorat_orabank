import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    const mailOptions = {
      from: `"Mentorat App" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html, // <-- Utilise le HTML ici
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email HTML envoyé:', info.response);
  } catch (error) {
    console.error('Erreur envoi e-mail HTML:', error);
    throw new Error('Erreur lors de l’envoi du mail');
  }
};
