 // models/Conversation.ts
import mongoose, { Document, Schema, Model } from 'mongoose';
import { IUser } from './User';

/*export interface Conversation {
  conversationId: string;
   firstName: string;
lastName: string; 
avatar?: string;

}*/
export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  content: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  lastMessage?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

interface IConversationMethods {
  markAsRead(userId: string): Promise<void>;
}

interface ConversationModel extends Model<IConversation, {}, IConversationMethods> {
  findOrCreate(senderId: string, recipientId: string): Promise<IConversation>;
  getUserConversations(userId: string): Promise<IConversation[]>;
}

const ConversationSchema = new Schema<IConversation, ConversationModel, IConversationMethods>({
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: (participants: mongoose.Types.ObjectId[]) => participants.length === 2,
      message: 'Conversation must have exactly 2 participants'
    }
  }],
  lastMessage: {
    type: Schema.Types.ObjectId,
    ref: 'Message'
  }
}, { timestamps: true });

ConversationSchema.index({ participants: 1, updatedAt: -1 }); // For faster queries



// Method to mark messages as read
ConversationSchema.method('markAsRead', async function(userId: string) {
  await mongoose.model('Message').updateMany(
    {
      conversation: this._id,
      recipient: userId,
      read: false
    },
    { $set: { read: true } }
  );
});

// Static method to find or create conversation
ConversationSchema.static('findOrCreate', async function(
  senderId: string,
  recipientId: string
) {
  const existing = await this.findOne({
    participants: { $all: [senderId, recipientId] }
  }).populate('lastMessage');

  if (existing) return existing;

  return this.create({
    participants: [senderId, recipientId]
  });
});

// Static method to get user conversations
ConversationSchema.static('getUserConversations', async function(userId: string) {
  return this.find({ participants: userId })
    .populate('participants', 'name avatar')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });
});

const Conversation = mongoose.model<IConversation, ConversationModel>('Conversation', ConversationSchema);


export default Conversation;