 import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface TypeScript pour un document Message
export interface MessageDocument extends Document {
  mentorshipId: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  content: string;
  seen: boolean;
  createdAt: Date;
  updatedAt: Date;
  markAsSeen(): Promise<MessageDocument>;
}



// Interface pour les méthodes statiques
export interface MessageModel extends Model<MessageDocument> {
  findByMentorshipId(mentorshipId: mongoose.Types.ObjectId): Promise<MessageDocument[]>;
  getAllMessages(): Promise<MessageDocument[]>;
}

 
// Schéma Mongoose
const messageSchema = new Schema<MessageDocument, MessageModel>(
  {
    
    
    content: {
      type: String,
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);
 
// Add to your Conversation model initialization:

// Add this to your Message model:
const MessageSchema = new Schema({
  conversation: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  read: { type: Boolean, default: false }
}, { timestamps: true });

MessageSchema.index({ conversation: 1, createdAt: -1 });
MessageSchema.index({ recipient: 1, read: 1 });
 
 

// ✅ Méthode d'instance : marquer comme vu
messageSchema.methods.markAsSeen = async function () {
  this.seen = true;
  return this.save();
};

// ✅ Méthodes statiques
messageSchema.statics.findByMentorshipId = function (mentorshipId) {
  return this.find({ mentorshipId });
};

messageSchema.statics.getAllMessages = function () {
  return this.find();
};

// ✅ Création du modèle
const Message = mongoose.model<MessageDocument, MessageModel>('Message', messageSchema);

export default Message;

