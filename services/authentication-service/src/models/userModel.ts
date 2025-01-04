import mongoose from 'mongoose';

/**
 * User model that stores an email. hashedPassword, role.
 */

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'dentist'], required: true },
});

const User = mongoose.model('User', userSchema);
export default User;
