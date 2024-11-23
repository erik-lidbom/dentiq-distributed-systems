import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the Patient document
interface IPatient extends Document {
    Personnummer: string;
    Firstname: string;
    Lastname: string;
    password: string;
    email: string;
    appointments: mongoose.Types.ObjectId[];
}

// Create the schema
const patientSchema: Schema<IPatient> = new mongoose.Schema({
    Personnummer: {
        type: String,
        required: true,
        unique: true,
    },
    Firstname: {
        type: String,
        required: true,
    },
    Lastname: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    appointments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
        },
    ],
});

// Create the model
const Patient: Model<IPatient> = mongoose.model<IPatient>("Patient", patientSchema);

export { Patient, IPatient };
