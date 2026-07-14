// controllers/messageController.ts
import { Request, Response } from 'express';
import Conversation from '../models/Conversation';
import Message from '../models/Message';

interface ConversationHistoryItem {
  participant: {
    _id: string;
    name: string;
    avatar?: string;
  };
  lastMessage: {
    content: string;
    createdAt: Date;
    read: boolean;
  };
  unreadCount: number;
}

export const getConversationHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id; // From auth middleware

    // Get conversations with last message and unread count
    const conversations = await Conversation.aggregate<ConversationHistoryItem>([
      { $match: { participants: userId } },
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
      { $unwind: '$lastMessage' },
      {
        $lookup: {
          from: 'users',
          localField: 'participants',
          foreignField: '_id',
          as: 'participants'
        }
      },
      {
        $addFields: {
          participant: {
            $filter: {
              input: '$participants',
              as: 'participant',
              cond: { $ne: ['$$participant._id', userId] }
            }
          }
        }
      },
      { $unwind: '$participant' },
      {
        $lookup: {
          from: 'messages',
          let: { conversationId: '$_id', participantId: '$participant._id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$conversation', '$$conversationId'] },
                    { $eq: ['$sender', '$$participantId'] },
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
      {
        $project: {
          participant: {
            _id: '$participant._id',
            name: '$participant.name',
            avatar: '$participant.avatar'
          },
          lastMessage: {
            content: '$lastMessage.content',
            createdAt: '$lastMessage.createdAt',
            read: '$lastMessage.read'
          },
          unreadCount: { $ifNull: ['$unreadMessages.count', 0] }
        }
      },
      { $sort: { 'lastMessage.createdAt': -1 } }
    ]);

    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversation history'
    });
  }
};


/*
import { Request, Response, NextFunction } from 'express';
import Message from '../models/Message';
import mongoose from 'mongoose';
import { MentorshipMessage } from '../models/MentorshipMessage';
import messageModel from '../models/Message';

// Pour étendre l'objet Request avec io
interface CustomRequest extends Request {
  io: any;
  user: { id: string };
}

interface MessageDocument {
  _id: mongoose.Types.ObjectId;
  mentorshipId: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
 

// @route   GET /api/messages/:mentorshipId
// @desc    Récupérer tous les messages liés à un mentorat
export const getMessages = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const messages = await Message.find({ mentorshipId: req.params.mentorshipId })
      .populate('sender', 'firstName lastName avatar'); // si avatar existe
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/messages/:mentorshipId
// @desc    Envoyer un message lié à un mentorat
export const sendMessage = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const message = await Message.create({
      mentorshipId: new mongoose.Types.ObjectId(req.params.mentorshipId),
      sender: req.user.id,
      content: req.body.content,
    });

    // socket.io : émettre à la room du mentorat
    req.io.to(req.params.mentorshipId).emit('newMessage', {
      ...message.toObject(),
      sender: {
        _id: req.user.id,
        firstName: req.users.firstName,
        lastName: req.users.lastName
      }
    });

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/messages/:messageId
// @desc    Supprimer un message
export const deleteMessage = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }

    // socket.io : émettre à la room du mentorat
    req.io.to(message.mentorshipId.toString()).emit('messageDeleted', message._id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/messages/:messageId
// @desc    Mettre à jour un message
export const updateMessage = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.messageId,
      { content: req.body.content },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }

    // socket.io : émettre à la room du mentorat
    req.io.to(message.mentorshipId.toString()).emit('messageUpdated', message._id);

    res.json(message);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/messages/:mentorshipId/:messageId
// @desc    Récupérer un message spécifique
export const getMessage = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const message = await Message.findOne({
      _id: req.params.messageId,
      mentorshipId: req.params.mentorshipId
    }).populate('sender', 'firstName lastName avatar');

    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }

    res.json(message);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/messages/:mentorshipId/unreadCount
// @desc    Compter le nombre de messages non lus
export const getUnreadCount = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const count = await Message.countDocuments({
      mentorshipId: req.params.mentorshipId,
      read: false
    });
    res.json({ unreadCount: count });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/messages/:messageId/read
// @desc    Marquer un message comme lu
export const markAsRead = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.messageId,
      { read: true },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé' });
    }

    // socket.io : émettre à la room du mentorat
    req.io.to(message.mentorshipId.toString()).emit('messageRead', message._id);

    res.json(message);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/messages/:mentorshipId/lastMessage
// @desc    Récupérer le dernier message d'un mentorat
export const getLastMessage = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const message = await Message.findOne({
      mentorshipId: req.params.mentorshipId
    }).sort({ createdAt: -1 }).populate('sender', 'firstName lastName avatar');

    if (!message) {
      return res.status(404).json({ message: 'Aucun message trouvé' });
    }

    res.json(message);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/messages/:mentorshipId/lastMessageByUser/:userId
// @desc    Récupérer le dernier message d'un mentorat par un utilisateur spécifique
export const getLastMessageByUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const message = await Message.findOne({
      mentorshipId: req.params.mentorshipId,
      sender: req.params.userId
    }).sort({ createdAt: -1 }).populate('sender', 'firstName lastName avatar');

    if (!message) {
      return res.status(404).json({ message: 'Aucun message trouvé' });
    }

    res.json(message);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/messages/:mentorshipId/lastMessageByMentor/:mentorId
// @desc    Récupérer le dernier message d'un mentorat par un mentor spécifique
export const getLastMessageByMentor = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const message = await Message.findOne({
      mentorshipId: req.params.mentorshipId,
      sender: req.params.mentorId
    }).sort({ createdAt: -1 }).populate('sender', 'firstName lastName avatar');

    if (!message) {
      return res.status(404).json({ message: 'Aucun message trouvé' });
    }

    res.json(message);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/messages/:mentorshipId/unreadMessages
// @desc    Récupérer les messages non lus d'un mentorat
export const getUnreadMessages = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const messages = await Message.find({
      mentorshipId: req.params.mentorshipId,
      read: false
    }).populate('sender', 'firstName lastName avatar');

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/messages/:mentorshipId/unreadMentorships
// @desc    Récupérer les mentorats avec des messages non lus
export const getUnreadMentorships = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const mentorships = await MentorshipMessage.find({
      _id: req.params.mentorshipId,
      'messages.read': false
    }).populate('messages.sender', 'firstName lastName avatar');

    res.json(mentorships);
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/messages/:mentorshipId/lastMessageByMentorAndMentee
// @desc    Récupérer le dernier message d'un mentorat par un mentor et un apprenant spécifiques
export const getLastMessageByMentorAndMentee = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const message = await Message.findOne({
      mentorshipId: req.params.mentorshipId,
      sender: { $in: [req.params.mentorId, req.params.menteeId] }
    }).sort({ createdAt: -1 }).populate('sender', 'firstName lastName avatar');

    if (!message) {
      return res.status(404).json({ message: 'Aucun message trouvé' });
    }

    res.json(message);
  } catch (error) {
    next(error);
  }
};
 

export const messageController = {
  getMessages,
  sendMessage,
  deleteMessage,
  updateMessage,
  getMessage,
  getUnreadCount,
  markAsRead,
  getLastMessage,
  getLastMessageByUser,
  getLastMessageByMentor,
  getUnreadMessages,
  getUnreadMentorships,
  getLastMessageByMentorAndMentee
};

export default messageController;

*/