 export const passwordChangedTemplate = (userFirstName: string = '') => {
  return `
  <!DOCTYPE html>
  <html lang="fr">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Mot de passe modifié</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f6f9fc;
          margin: 0;
          padding: 0;
        }
        .container {
          background-color: #ffffff;
          max-width: 600px;
          margin: 40px auto;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        .logo {
          text-align: center;
          margin-bottom: 20px;
        }
        .logo img {
          max-width: 100px;
        }
        h2 {
          color: #333;
        }
        p {
          color: #555;
          line-height: 1.5;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #999;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Mentorship_icon.svg" alt="Mentorat Logo" />
        </div>
        <h2>Bonjour ${userFirstName},</h2>
        <p>Votre mot de passe a été <strong>modifié avec succès</strong>.</p>
        <p>Si vous n'êtes pas à l'origine de cette action, nous vous recommandons de <a href="#">changer à nouveau votre mot de passe</a> et de contacter notre support immédiatement.</p>
        <p>Merci de votre confiance,<br/>L’équipe Mentorat App</p>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Mentorat App. Tous droits réservés.
        </div>
      </div>
    </body>
  </html>
  `;
};
