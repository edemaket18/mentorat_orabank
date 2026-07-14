import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
  import profileRoutes from './routes/profileRoutes';
import adminUserRoutes from './routes/adminUserRoutes';
import mentorshipRoutes from './routes/mentorshipRoutes';
import experienceShareRoutes from './routes/experienceShareRoutes';
import skillRoutes from './routes/skillRoutes';
import reportRoutes from './routes/reportRoutes';
import swaggerUi from 'swagger-ui-express';
import specs from './swagger/swagger.json';
 import authRoutes from './routes/authRoutes';
 import studentRoutes from './routes/studentRoutes';
import connectDB from './config/db';
import { notFound, errorHandler } from './middlewares/errorMiddleware';
  import swaggerJsdoc from 'swagger-jsdoc';
 
 
 

dotenv.config();
const app: Application = express();
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

// Connexion à la base de données
connectDB();


console.log('💡 Type de authRoutes :', typeof authRoutes);  
 
 

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`Origin not allowed by CORS: ${origin}`));
  },
  credentials: true,
}));


 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api', (req: Request, res: Response) => { /* ... */ });
console.log('➡️ authRoutes type:', typeof authRoutes); 
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
  
  app.use('/api/admin/users', adminUserRoutes);
    app.use('/api/mentorships', mentorshipRoutes );
    app.use('/api/experiences', experienceShareRoutes);
    app.use('/api/skills', skillRoutes);
    app.use('/api/reports', reportRoutes);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));  
         
app.use(notFound);
app.use(errorHandler); 
 

setTimeout(() => {
  console.log('\n📚 Routes enregistrées :');
  (app._router?.stack || [])
    .filter((r: any) => r.route)
    .forEach((r: any) => {
      const methods = Object.keys(r.route.methods).join(', ').toUpperCase();
      console.log(`${methods} ${r.route.path}`);
    });
}, 100);


export default app;
