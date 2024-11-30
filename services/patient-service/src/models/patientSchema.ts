import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the Patient document
interface IPatient extends Document {
    Personnummer: string;
    Firstname: string;
    Lastname: string;
    password: string;
    email: string;
}

// Create the schema
const patientSchema: Schema<IPatient> = new mongoose.Schema({
    Personnummer: {
        type: String,
        required: [true, "Personnummer is required"],
        unique: true,
        trim: true,
    },
    Firstname: {
        type: String,
        required: [true, "Firstname is required"],
        trim: true,
    },
    Lastname: {
        type: String,
        required: [true, "Lastname is required"],
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Please provide a valid email address",
        ],
    },
});

// Create the model
const Patient: Model<IPatient> = mongoose.model<IPatient>("Patient", patientSchema);

export { Patient, IPatient };
