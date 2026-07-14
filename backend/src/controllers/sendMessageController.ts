 /*
 // controllers/message/base.ts
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Message from '../models/Message';
import {io} from '../server';

interface CustomRequest extends Request {
  user?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
  };
}


export const createMessage = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { recipientId, content } = req.body;
    const senderId = req.user?.id;

    if (!senderId) return res.status(401).json({ message: 'Non autorisé.' });
    if (!mongoose.Types.ObjectId.isValid(recipientId)) return res.status(400).json({ message: 'ID du destinataire invalide.' });
    if (!content || content.trim() === '') return res.status(400).json({ message: 'Le contenu du message est requis.' });

    const message = await Message.create({ sender: senderId, recipient: recipientId, content });

    io.to(`user:${recipientId}`).emit('message:received', {
      from: senderId,
      content,
      sentAt: message.createdAt,
    });

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const includeMentorship = req.query.includeMentorship === 'true';

    if (!userId) return res.status(401).json({ message: 'Non autorisé.' });

    let query = Message.find({ $or: [{ sender: userId }, { recipient: userId }] })
      .populate('sender', 'firstName lastName')
      .populate('recipient', 'firstName lastName');
 
      const finalQuery = includeMentorship 
    ? query.populate('mentorshipId') 
    : query;

    const messages = await query.exec();
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

 

export const deleteMessage = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const messageId = req.params.messageId;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: 'Non autorisé.' });

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: 'Message non trouvé.' });
    if (message.sender.toString() !== userId && message.recipient.toString() !== userId) {
      return res.status(403).json({ message: 'Action interdite.' });
    }

    await Message.findByIdAndDelete(messageId);
    io.to(`user:${message.recipient}`).emit('message:deleted', { id: messageId });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const updateMessage = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const messageId = req.params.messageId;
    const { content } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: 'Non autorisé.' });
    if (!content || content.trim() === '') return res.status(400).json({ message: 'Le contenu du message est requis.' });

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: 'Message non trouvé.' });
    if (message.sender.toString() !== userId) return res.status(403).json({ message: 'Action interdite.' });

    message.content = content;
    await message.save();

    io.to(`user:${message.recipient}`).emit('message:updated', {
      id: message._id,
      content,
      updatedAt: message.updatedAt,
    });

    res.json(message);
  } catch (error) {
    next(error);
  }
};

export const markMessageAsSeen = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const messageId = req.params.messageId;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: 'Non autorisé.' });

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: 'Message non trouvé.' });
    if (message.recipient.toString() !== userId) return res.status(403).json({ message: 'Action interdite.' });

    message.seen = true;
    await message.save();

    io.to(`user:${message.sender}`).emit('message:seen', {
      id: message._id,
      seenAt: new Date(),
    });

    res.json(message);
  } catch (error) {
    next(error);
  }
};



export const messageController = {
  createMessage,
  getMessages,
  deleteMessage,
  updateMessage,
  markMessageAsSeen,
};

export default messageController;

*/
 
 
 
 
 
 
 
 
 import { Request, Response, NextFunction } from 'express';
import Message from '../models/Message';
import    {io}   from '../server'; // Assure-toi que c’est bien exporté
import mongoose from 'mongoose';

// Ajout d’un typage personnalisé si nécessaire
interface CustomRequest extends Request {
  user?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;

  };
}

export const sendMessage = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { recipientId, content } = req.body;
    const senderId = req.user?.id;

    if (!senderId) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
      return res.status(400).json({ message: 'ID du destinataire invalide.' });
    }

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Le contenu du message est requis.' });
    }

    const message = await Message.create({
      sender: senderId,
      recipient: recipientId,
      content,
    });

    // Envoi Socket.io dans une room ou directement
    io.to(recipientId).emit('message:received', {
      from: senderId,
      content,
      sentAt: message.createdAt,
    });

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    }).populate('sender', 'firstName lastName').populate('recipient', 'firstName lastName');

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const deleteMessage = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const messageId = req.params.messageId;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé.' });
    }

    if (message.sender.toString() !== userId && message.recipient.toString() !== userId) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à supprimer ce message.' });
    }

    await Message.findByIdAndDelete(messageId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const updateMessage = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const messageId = req.params.messageId;
    const { content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Le contenu du message est requis.' });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé.' });
    }

    if (message.sender.toString() !== userId) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à modifier ce message.' });
    }

    message.content = content;
    await message.save();

    // Envoi Socket.io dans une room ou directement
    io.to(message.recipient.toString()).emit('message:updated', {
      id: message._id,
      content,
      updatedAt: message.updatedAt,
    });

    res.json(message);
  } catch (error) {
    next(error);
  }
};

export const markMessageAsSeen = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const messageId = req.params.messageId;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé.' });
    }

    if (message.recipient.toString() !== userId) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à marquer ce message comme vu.' });
    }

    message.seen = true;
    await message.save();

    // Envoi Socket.io dans une room ou directement
    io.to(message.sender.toString()).emit('message:seen', {
      id: message._id,
      seenAt: new Date(),
    });

    res.json(message);
  } catch (error) {
    next(error);
  }
};

export const getMessageById = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const messageId = req.params.messageId;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    const message = await Message.findById(messageId).populate('sender', 'firstName lastName').populate('recipient', 'firstName lastName');

    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé.' });
    }

    if (message.sender.toString() !== userId && message.recipient.toString() !== userId) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à voir ce message.' });
    }

    res.json(message);
  } catch (error) {
    next(error);
  }
};

export const getMessagesByMentorshipId = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const mentorshipId = req.params.mentorshipId;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    if (!mongoose.Types.ObjectId.isValid(mentorshipId)) {
      return res.status(400).json({ message: 'ID de mentorat invalide.' });
    }

    const messages = await Message.find({ mentorshipId })
      .populate('sender', 'firstName lastName')
      .populate('recipient', 'firstName lastName');

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const deleteMessagesByMentorshipId = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const mentorshipId = req.params.mentorshipId;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    if (!mongoose.Types.ObjectId.isValid(mentorshipId)) {
      return res.status(400).json({ message: 'ID de mentorat invalide.' });
    }

    await Message.deleteMany({ mentorshipId });

    // Envoi Socket.io dans une room ou directement
    io.to(mentorshipId).emit('messages:deleted', { mentorshipId });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const deleteMessagesBySender = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const senderId = req.params.senderId;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    if (!mongoose.Types.ObjectId.isValid(senderId)) {
      return res.status(400).json({ message: 'ID de l\'expéditeur invalide.' });
    }

    await Message.deleteMany({ sender: senderId });

    // Envoi Socket.io dans une room ou directement
    io.to(senderId).emit('messages:deleted', { senderId });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const deleteMessagesByRecipient = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const recipientId = req.params.recipientId;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
      return res.status(400).json({ message: 'ID du destinataire invalide.' });
    }

    await Message.deleteMany({ recipient: recipientId });

    // Envoi Socket.io dans une room ou directement
    io.to(recipientId).emit('messages:deleted', { recipientId });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const deleteAllMessages = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    await Message.deleteMany({});

    // Envoi Socket.io dans une room ou directement
    io.emit('messages:allDeleted');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getAllMessages = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    const messages = await Message.find({})
      .populate('sender', 'firstName lastName')
      .populate('recipient', 'firstName lastName');

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const getMessageByIdWithMentorship = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const messageId = req.params.messageId;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    const message = await Message.findById(messageId)
      .populate('sender', 'firstName lastName')
      .populate('recipient', 'firstName lastName')
      .populate('mentorshipId');

    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé.' });
    }

    if (message.sender.toString() !== userId && message.recipient.toString() !== userId) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à voir ce message.' });
    }

    res.json(message);
  } catch (error) {
    next(error);
  }
};

export const getMessagesByMentorshipIdWithMentorship = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const mentorshipId = req.params.mentorshipId;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    if (!mongoose.Types.ObjectId.isValid(mentorshipId)) {
      return res.status(400).json({ message: 'ID de mentorat invalide.' });
    }

    const messages = await Message.find({ mentorshipId })
      .populate('sender', 'firstName lastName')
      .populate('recipient', 'firstName lastName')
      .populate('mentorshipId');

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const deleteMessagesByMentorshipIdWithMentorship = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const mentorshipId = req.params.mentorshipId;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    if (!mongoose.Types.ObjectId.isValid(mentorshipId)) {
      return res.status(400).json({ message: 'ID de mentorat invalide.' });
    }

    await Message.deleteMany({ mentorshipId });

    // Envoi Socket.io dans une room ou directement
    io.to(mentorshipId).emit('messages:deleted', { mentorshipId });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const deleteMessagesBySenderWithMentorship = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const senderId = req.params.senderId;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    if (!mongoose.Types.ObjectId.isValid(senderId)) {
      return res.status(400).json({ message: 'ID de l\'expéditeur invalide.' });
    }

    await Message.deleteMany({ sender: senderId });

    // Envoi Socket.io dans une room ou directement
    io.to(senderId).emit('messages:deleted', { senderId });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const deleteMessagesByRecipientWithMentorship = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const recipientId = req.params.recipientId;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    if (!mongoose.Types.ObjectId.isValid(recipientId)) {
      return res.status(400).json({ message: 'ID du destinataire invalide.' });
    }

    await Message.deleteMany({ recipient: recipientId });

    // Envoi Socket.io dans une room ou directement
    io.to(recipientId).emit('messages:deleted', { recipientId });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const deleteAllMessagesWithMentorship = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    await Message.deleteMany({});

    // Envoi Socket.io dans une room ou directement
    io.emit('messages:allDeleted');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getAllMessagesWithMentorship = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    const messages = await Message.find({})
      .populate('sender', 'firstName lastName')
      .populate('recipient', 'firstName lastName')
      .populate('mentorshipId');

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const getMessageByIdWithMentorshipAndSender = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const messageId = req.params.messageId;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    const message = await Message.findById(messageId)
      .populate('sender', 'firstName lastName')
      .populate('recipient', 'firstName lastName')
      .populate('mentorshipId');

    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé.' });
    }

    if (message.sender.toString() !== userId && message.recipient.toString() !== userId) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à voir ce message.' });
    }

    res.json(message);
  } catch (error) {
    next(error);
  }
};

export const getMessagesByMentorshipIdWithMentorshipAndSender = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const mentorshipId = req.params.mentorshipId;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    if (!mongoose.Types.ObjectId.isValid(mentorshipId)) {
      return res.status(400).json({ message: 'ID de mentorat invalide.' });
    }

    const messages = await Message.find({ mentorshipId })
      .populate('sender', 'firstName lastName')
      .populate('recipient', 'firstName lastName')
      .populate('mentorshipId');

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const deleteMessagesByMentorshipIdWithMentorshipAndSender = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const mentorshipId = req.params.mentorshipId;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    if (!mongoose.Types.ObjectId.isValid(mentorshipId)) {
      return res.status(400).json({ message: 'ID de mentorat invalide.' });
    }

    await Message.deleteMany({ mentorshipId });

    // Envoi Socket.io dans une room ou directement
    io.to(mentorshipId).emit('messages:deleted', { mentorshipId });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const createMessageWithMentorship = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { mentorshipId, content } = req.body;
    const senderId = req.user?.id;

    if (!senderId) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    if (!mongoose.Types.ObjectId.isValid(mentorshipId)) {
      return res.status(400).json({ message: 'ID de mentorat invalide.' });
    }

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Le contenu du message est requis.' });
    }

    const message = await Message.create({
      mentorshipId,
      sender: senderId,
      content,
    });

    // Envoi Socket.io dans une room ou directement
    io.to(mentorshipId).emit('message:created', {
      ...message.toObject(),
      sender: {
        _id: senderId,
        firstName: req.user?.firstName,
        lastName: req.user?.lastName,
      },
    });

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

export const deleteMessageWithMentorship = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const messageId = req.params.messageId;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé.' });
    }

    if (message.sender.toString() !== userId && message.recipient.toString() !== userId) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à supprimer ce message.' });
    }

    await Message.findByIdAndDelete(messageId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const updateMessageWithMentorship = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const messageId = req.params.messageId;
    const { content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Le contenu du message est requis.' });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé.' });
    }

    if (message.sender.toString() !== userId) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à modifier ce message.' });
    }

    message.content = content;
    await message.save();

    // Envoi Socket.io dans une room ou directement
    io.to(message.mentorshipId.toString()).emit('message:updated', message);

    res.json(message);
  } catch (error) {
    next(error);
  }
};

export const markMessageAsSeenWithMentorship = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const messageId = req.params.messageId;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message non trouvé.' });
    }

    if (message.recipient.toString() !== userId) {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à marquer ce message comme vu.' });
    }

    message.seen = true;
    await message.save();

    // Envoi Socket.io dans une room ou directement
    io.to(message.sender.toString()).emit('message:seen', { id: message._id, seenAt: new Date() });

    res.json(message);
  } catch (error) {
    next(error);
  }
};
        

export const getMessagesWithMentorship = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    }).populate('sender', 'firstName lastName').populate('recipient', 'firstName lastName').populate('mentorshipId');

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const getMessagesBySenderWithMentorship = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const senderId = req.params.senderId;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé.' });
    }

    if (!mongoose.Types.ObjectId.isValid(senderId)) {
      return res.status(400).json({ message: 'ID de l\'expéditeur invalide.' });
    }

    const messages = await Message.find({ sender: senderId })
      .populate('sender', 'firstName lastName')
      .populate('recipient', 'firstName lastName')
      .populate('mentorshipId');

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const sendMessageController = {
      createMessageWithMentorship,
      deleteMessageWithMentorship,
      updateMessageWithMentorship,
      markMessageAsSeenWithMentorship,
      getMessagesWithMentorship,
      getMessagesBySenderWithMentorship,
      deleteAllMessagesWithMentorship,
      getAllMessagesWithMentorship,
      getMessageByIdWithMentorshipAndSender,
      getMessagesByMentorshipIdWithMentorshipAndSender,
      deleteMessagesByMentorshipIdWithMentorshipAndSender,
};


export default sendMessageController;
 