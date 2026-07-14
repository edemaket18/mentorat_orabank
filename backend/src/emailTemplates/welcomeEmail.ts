export const welcomeEmailTemplate = (firstName: string = '') => {
  return `
  <html>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="background-color: white; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px;">
        <h2>Bienvenue ${firstName} ! 🎉</h2>
        <p>Merci de rejoindre la plateforme Mentorat App.</p>
        <p>Nous sommes ravis de vous compter parmi nous. Explorez les profils, trouvez un mentor ou proposez votre aide !</p>
        <p>Bonne découverte,<br>L’équipe Mentorat</p>
      </div>
    </body>
  </html>`;
};
