import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  contactEmail?: string;
  maintenanceMode: boolean;
}

const SettingsSchema: Schema = new Schema(
  {
    contactEmail: { type: String, default: '' },
    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<ISettings>('Settings', SettingsSchema);