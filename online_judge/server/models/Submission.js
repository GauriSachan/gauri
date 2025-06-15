import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
  code: String,
  language: String,
  result: String // e.g., "Accepted", "Wrong Answer"
}, { timestamps: true });

export default mongoose.model('Submission', submissionSchema);
