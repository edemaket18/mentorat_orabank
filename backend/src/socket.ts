 // socket.ts
import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import messagesRoutes from './routes/messagesRoutes'; // ✅ Tes routes
import dotenv from 'dotenv';
import { mockAuth } from './middlewares/authMiddleware';




dotenv.config();

const app = express();
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Attacher l’instance Socket.io à la requête (facultatif mais pratique)
declare global {
  namespace Express {
   
    interface Request {
      io?: Server;
      user?: any;
    }
  }
}

// Middleware
app.use(cors());
app.use(express.json());

// Mock auth temporaire pour dev
app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: 'userIdMock123',
    firstName: 'Mock',
    lastName: 'User',
    email: 'mock@example.com',
    role: 'stagiaire',
  };
  next();
});

// Injecte io dans toutes les req si besoin
app.use((req, res, next) => {
  req.io = io;
  next();
});


app.use(mockAuth);
// Routes
app.use('/api/messages', messagesRoutes);

// Socket.io handlers
io.on('connection', (socket) => {
  console.log('✅ Nouveau client connecté :', socket.id);

  socket.on('joinRoom', (roomId: string) => {
    socket.join(roomId);
    console.log(`👥 Utilisateur rejoint la room : ${roomId}`);
  });

  socket.on('sendMessage', ({ recipientId, message }) => {
    io.to(recipientId).emit('receiveMessage', message);
    console.log(`📤 Message envoyé à ${recipientId} : ${message}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ Utilisateur déconnecté');
  });
});



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});

// Après l'envoi d'un message

// Export si besoin
export { io, server };


