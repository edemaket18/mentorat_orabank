import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/User';

// Comptes de démarrage, un par rôle, pour pouvoir tester chaque espace de
// l'application dès le premier lancement sans passer par l'inscription.
// Mot de passe identique pour tous, à changer après le premier test.
const DEFAULT_PASSWORD = 'Password123!';

const SEED_USERS = [
  { firstName: 'Alice', lastName: 'Admin', email: 'admin@orabank.test', role: 'admin' as const },
  { firstName: 'Rita', lastName: 'RH', email: 'rh@orabank.test', role: 'rh' as const },
  { firstName: 'Marc', lastName: 'Mentor', email: 'mentor@orabank.test', role: 'mentor' as const },
  { firstName: 'Sophie', lastName: 'Stagiaire', email: 'stagiaire@orabank.test', role: 'stagiaire' as const },
];

const run = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/orabank_mentorat_test';

  console.log(`Connexion à MongoDB (${mongoUri})...`);
  await mongoose.connect(mongoUri);

  for (const seedUser of SEED_USERS) {
    const existing = await User.findOne({ email: seedUser.email });
    if (existing) {
      console.log(`- ${seedUser.role.padEnd(10)} déjà présent : ${seedUser.email}`);
      continue;
    }

    // Le hachage du mot de passe est géré automatiquement par le hook
    // pre('save') du modèle User — on passe le mot de passe en clair ici.
    await User.create({
      firstName: seedUser.firstName,
      lastName: seedUser.lastName,
      email: seedUser.email,
      password: DEFAULT_PASSWORD,
      role: seedUser.role,
      isActive: true,
      isVerified: true,
      emailVerified: true,
    });
    console.log(`- ${seedUser.role.padEnd(10)} créé       : ${seedUser.email}`);
  }

  console.log('');
  console.log('Comptes disponibles (mot de passe pour tous : ' + DEFAULT_PASSWORD + ') :');
  SEED_USERS.forEach((u) => console.log(`  ${u.role.padEnd(10)} -> ${u.email}`));

  await mongoose.disconnect();
  console.log('');
  console.log('Terminé.');
  process.exit(0);
};

run().catch((error) => {
  console.error('Erreur lors du seed :', error);
  process.exit(1);
});