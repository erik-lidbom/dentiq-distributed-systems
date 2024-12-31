import mongoose, { Schema, Document, Model } from 'mongoose';

interface IClinic extends Document {
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  services: string[];
  firstAvailableTime: string;
  languages: string[];
  dentists: mongoose.Types.ObjectId[]; // References to Dentist documents
}

const clinicSchema: Schema<IClinic> = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  phone: { type: String, required: true, trim: true },
  services: { type: [String], required: true },
  firstAvailableTime: { type: String, required: true }, // e.g., "2024-01-01T09:00:00Z"
  languages: { type: [String], required: true }, // e.g., ["English", "Swedish"]
  dentists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dentist',
    },
  ],
});

const Clinic: Model<IClinic> =
  mongoose.models.Clinic || mongoose.model<IClinic>('Clinic', clinicSchema);

export { Clinic, IClinic };
