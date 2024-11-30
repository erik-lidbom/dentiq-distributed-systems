import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the Dentist document
interface IDentist extends Document {
    personnummer: string;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    appointments: mongoose.Types.ObjectId[];
    clinics: mongoose.Types.ObjectId[];
}

const dentistSchema: Schema<IDentist> = new mongoose.Schema({
    personnummer: {
        type: String,
        required: true,
        unique: true,
        trim: true, 
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please provide a valid email address",
        ],
    },
    appointments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
        },
    ],
    clinics: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clinic",
        },
    ],
});

// Create the model
const Dentist: Model<IDentist> = mongoose.model<IDentist>("Dentist", dentistSchema);

export { Dentist, IDentist };
