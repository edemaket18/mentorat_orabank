import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import compression from 'compression';
import morgan from 'morgan';
 import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import adminUserRoutes from './routes/adminUserRoutes';
import mentorshipRoutes from './routes/mentorshipRoutes';
import experienceShareRoutes from './routes/experienceShareRoutes';
import skillRoutes from './routes/skillRoutes';
import reportRoutes from './routes/reportRoutes';
import contractRoutes from './routes/contractRoutes';
import internRoutes from './routes/internRoutes';
import notificationRoutes from './routes/notificationRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import rhRoutes from './routes/rhRoutes';
import mentorRoutes from './routes/mentorRoutes';
import moderationReportRoutes from './routes/moderationReportRoutes';
import matchingRoutes from './routes/matchingRoutes';
import messagingRoutes from './routes/messagingRoutes';
import studentRoutes from './routes/studentRoutes';
import uploadCvRoutes from './routes/uploadCvRoutes';
import attestationRoutes from './routes/attestationsRoutes';
import analyticsRoutes from './routes/analyticsRoutes';

import { notFound, errorHandler } from './middlewares/errorMiddleware';
import { specs } from './config/swagger';

dotenv.config();

const app: Application = express();


const PORT = process.env.PORT || 5001;
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://127.0.0.1:3000',
  // Origines utilisées par le shell mobile Capacitor (Android/iOS)
  'capacitor://localhost',
  'https://localhost',
  'http://localhost',
];

// DB connection
mongoose.connect(process.env.MONGODB_URI || '', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as any)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Middleware
app.use(helmet());
app.use(compression());

// Logs des requêtes HTTP (format compact en prod, détaillé en dev)
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Limite le nombre de requêtes par IP pour l'API en général
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de requêtes, veuillez réessayer plus tard.' },
});

// Limite plus stricte spécifiquement sur l'authentification (anti brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de tentatives de connexion, veuillez réessayer plus tard.' },
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

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

// Nettoie req.body/req.query des opérateurs Mongo ($gt, $ne...) pour se
// prémunir des injections NoSQL.
app.use(mongoSanitize());
// Empêche la pollution de paramètres HTTP (ex: ?role=admin&role=stagiaire)
app.use(hpp());

app.get('/', (req, res) => {
  res.send('API fonctionne 🚀');
});


// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Static files
app.use('/uploads', express.static('uploads'));

// Routes
app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Bienvenue sur l\'API mentorat Orabank Togo V1' });
});
//app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/admin', adminUserRoutes);
app.use('/api/mentorships', mentorshipRoutes);
app.use('/api/experiences', experienceShareRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/intern', internRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/rh', rhRoutes);
app.use('/api/mentors', mentorRoutes);
app.use('/api/moderation-reports', moderationReportRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/messaging', messagingRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attestations', attestationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/uploadCv', uploadCvRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Create HTTP server
const httpServer = createServer(app);

// Socket.io
export const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('✅ Connexion Socket.io :', socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    socket.join(userId as string); // chaque utilisateur rejoint sa room personnelle
    console.log(`🟢 Utilisateur ${userId} connecté à la room ${userId}`);
  }

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`🔗 ${socket.id} a rejoint la room ${roomId}`);
  });

  socket.on('sendMessage', ({ roomId, message, senderId }) => {
    io.to(roomId).emit('receiveMessage', { message, senderId });
  });

  socket.on('disconnect', () => {
    console.log('❌ Déconnexion socket:', socket.id);
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Serveur + WebSocket sur le port ${PORT}`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});