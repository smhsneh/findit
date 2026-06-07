import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
  content: {
    type: [String],
    required: true,
  },
  originalText: {
    type: String,
    required: true,
  }
}, { timestamps: true });

export default mongoose.model('Document', documentSchema);
