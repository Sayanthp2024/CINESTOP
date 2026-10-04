import mongoose, { Schema, Document } from 'mongoose';

export interface IMovie extends Document {
  id: number; // Custom large number to mimic TMDB ID
  title: string;
  overview: string;
  poster_path: string; // URL to custom image
  release_date: string;
  vote_average: number;
}

const MovieSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  overview: { type: String, required: true },
  poster_path: { type: String, required: true },
  release_date: { type: String, required: true },
  vote_average: { type: Number, default: 0 },
});

export default mongoose.models.CustomMovie || mongoose.model<IMovie>('CustomMovie', MovieSchema);
