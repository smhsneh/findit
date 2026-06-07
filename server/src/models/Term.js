import mongoose from 'mongoose';

const termSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  term: {
    type: String,
    required: true,
    index: true, // Speeds up search
  },
  postings: {
    type: Map,
    of: Number, // Maps docId (as string) to frequency
    default: {}
  }
}, { timestamps: true });

// Ensure term is unique per user
termSchema.index({ userId: 1, term: 1 }, { unique: true });

export default mongoose.model('Term', termSchema);
