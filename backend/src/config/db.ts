import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    throw new Error('MONGO_URI est manquant dans .env');
  }

  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Connexion MongoDB réussie');
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;






/*
import mongoose from 'mongoose';
import mysql from 'mysql2/promise';


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI!)
;
    console.log(`✅ Connexion MongoDB réussie : ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;

*/
