import mongoose from 'mongoose';

/**
 * Session model that stores a userId, refreshToken and when the session were created
 * The createdAt field contains an expiry date TTL (Time-To-Live) which automatically deletes the document after 7 days
 */

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  refreshToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 7 },
});

const Session = mongoose.model('Session', sessionSchema);
export default Session;
