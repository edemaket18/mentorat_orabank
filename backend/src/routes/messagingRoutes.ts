 import express from 'express';
import mongoose from 'mongoose';
import Conversation from '../models/Conversation';
import Message from '../models/Message';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// Applique le middleware d'authentification (remplace le mock)
router.use(authMiddleware);

interface IFormattedConversation {
  _id: mongoose.Types.ObjectId;
  participantId: mongoose.Types.ObjectId;
  participantName: string;
  participantAvatar?: string;
  lastMessage?: {
    content: string;
    createdAt: Date;
    unreadCount: number;
  };
}

/**
 * @route GET /conversations
 * @description Récupère toutes les conversations de l'utilisateur avec les dernières informations
 */
router.get('/conversations', async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.aggregate([
      // Trouve les conversations de l'utilisateur
      { $match: { participants: userId } },
      
      // Jointure avec les messages
      {
        $lookup: {
          from: 'messages',
          let: { conversationId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$conversation', '$$conversationId'] } } },
            { $sort: { createdAt: -1 } },
            { $limit: 1 }
          ],
          as: 'lastMessage'
        }
      },
      { $unwind: { path: '$lastMessage', preserveNullAndEmptyArrays: true } },
      
      // Jointure avec les participants
      {
        $lookup: {
          from: 'users',
          localField: 'participants',
          foreignField: '_id',
          as: 'participants'
        }
      },
      
      // Compte les messages non lus
      {
        $lookup: {
          from: 'messages',
          let: { conversationId: '$_id' },
          pipeline: [
            { 
              $match: { 
                $expr: { 
                  $and: [
                    { $eq: ['$conversation', '$$conversationId'] },
                    { $ne: ['$sender', userId] },
                    { $eq: ['$read', false] }
                  ]
                }
              }
            },
            { $count: 'count' }
          ],
          as: 'unreadMessages'
        }
      },
      { $unwind: { path: '$unreadMessages', preserveNullAndEmptyArrays: true } },
      
      // Formatage des données
      {
        $project: {
          _id: 1,
          participants: {
            $filter: {
              input: '$participants',
              as: 'participant',
              cond: { $ne: ['$$participant._id', userId] }
            }
          },
          lastMessage: {
            content: '$lastMessage.content',
            createdAt: '$lastMessage.createdAt'
          },
          unreadCount: { $ifNull: ['$unreadMessages.count', 0] }
        }
      },
      { $unwind: '$participants' }
    ]);

    const formatted: IFormattedConversation[] = conversations.map(conv => ({
      _id: conv._id,
      participantId: conv.participants._id,
      participantName: `${conv.participants.firstName} ${conv.participants.lastName}`,
      participantAvatar: conv.participants.avatar,
      lastMessage: conv.lastMessage ? {
        content: conv.lastMessage.content,
        createdAt: conv.lastMessage.createdAt,
        unreadCount: conv.unreadCount
      } : undefined
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Erreur GET /conversations:', err);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des conversations.',
      //details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

/**
 * @route GET /messages/:conversationId
 * @description Récupère les messages d'une conversation avec pagination
 */
router.get('/messages/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Vérifie que l'utilisateur fait partie de la conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user._id
    });

    if (!conversation) {
      return res.status(403).json({ error: 'Accès non autorisé à cette conversation.' });
    }

    const messages = await Message.find({ conversation: conversationId })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .populate('sender', 'firstName avatar');

    // Marquer les messages comme lus si c'est le destinataire
    await Message.updateMany(
      {
        conversation: conversationId,
        sender: { $ne: req.user._id },
        read: false
      },
      { $set: { read: true } }
    );

    res.json({
      messages: messages.reverse(), // Retourne les plus anciens en premier
      hasMore: messages.length === limit
    });
  } catch (err) {
    console.error('Erreur GET /messages:', err);
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des messages.',
      //details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

/**
 * @route POST /messages
 * @description Envoie un nouveau message
 */
router.post('/messages', async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    const sender = req.user._id;

    if (!conversationId || !content) {
      return res.status(400).json({ error: 'ID de conversation et contenu sont obligatoires.' });
    }

    // Vérifie que l'utilisateur fait partie de la conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: sender
    });

    if (!conversation) {
      return res.status(403).json({ error: 'Accès non autorisé à cette conversation.' });
    }

    // Crée et sauvegarde le message
    const message = new Message({
      conversation: conversationId,
      sender,
      content,
      read: false
    });

    await message.save();

    // Met à jour la conversation avec le dernier message
    conversation.lastMessage = message._id;
    await conversation.save();

    // Retourne le message avec les infos de l'expéditeur
    const populatedMessage = await message.populate('sender', 'firstName avatar');

    // Émet un événement WebSocket si nécessaire
    // (implémentation dépend de votre système de websockets)

    res.status(201).json(populatedMessage);
  } catch (err) {
    console.error('Erreur POST /messages:', err);
    res.status(500).json({ 
      error: 'Erreur lors de l\'envoi du message.',
      //details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

export default router;