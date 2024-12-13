import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the interface for the Dentist document
interface IDentist extends Document {
  personnummer: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  clinics: mongoose.Types.ObjectId[];
}

const dentistSchema: Schema<IDentist> = new mongoose.Schema({
  personnummer: {
    type: String,
    required: [true, 'Personnummer is required'],
    unique: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address',
    ],
  },
  clinics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clinic',
    },
  ],
});

// Create the model
const Dentist: Model<IDentist> = mongoose.model<IDentist>(
  'Dentist',
  dentistSchema
);

export { Dentist, IDentist };
