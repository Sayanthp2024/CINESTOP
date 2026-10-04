import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: string;
  watchlist: number[]; // TMDB movie IDs
  favorites: number[]; // TMDB movie IDs
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for OAuth
  role: { type: String, default: 'user' },
  watchlist: [{ type: Number }],
  favorites: [{ type: Number }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
