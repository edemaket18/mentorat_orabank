export const resetPasswordTemplate = (resetLink: string, firstName: string = '') => {
  return `
  <html>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="background-color: white; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px;">
        <h2>Réinitialisation de mot de passe</h2>
        <p>Bonjour ${firstName},</p>
        <p>Nous avons reçu une demande pour réinitialiser votre mot de passe.</p>
        <p><a href="${resetLink}" style="padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px;">Réinitialiser mon mot de passe</a></p>
        <p>Ce lien est valable pendant 1 heure.</p>
        <p>Si vous n’avez pas fait cette demande, ignorez simplement cet e-mail.</p>
        <p>Mentorat App</p>
      </div>
    </body>
  </html>`;
};
