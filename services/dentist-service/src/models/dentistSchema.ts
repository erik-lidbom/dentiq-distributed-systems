import mongoose, { Schema, Document, Model } from 'mongoose';

interface Availability {
  date: string; // e.g., "2024-01-01"
  times: string[]; // e.g., ["09:00", "10:00"]
}

interface IDentist extends Document {
  name: string;
  speciality: string;
  languages: string[];
  availability: Availability[];
  image?: string;
  clinic: mongoose.Types.ObjectId; // Reference to Clinic document
}

const availabilitySchema: Schema<Availability> = new mongoose.Schema({
  date: { type: String, required: true },
  times: { type: [String], required: true },
});

const dentistSchema: Schema<IDentist> = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, // Combines firstName and lastName
  speciality: { type: String, required: true }, // e.g., "Orthodontist"
  languages: { type: [String], required: true }, // e.g., ["English", "Swedish"]
  availability: { type: [availabilitySchema], required: true }, // Nested availability
  image: { type: String }, // URL for dentist's image
  clinic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
  },
});

const Dentist: Model<IDentist> =
  mongoose.models.Dentist || mongoose.model<IDentist>('Dentist', dentistSchema);

export { Dentist, IDentist };
