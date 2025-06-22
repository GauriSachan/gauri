import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  title: String,
  description: String,
  examples: [String],
  testCases: [
    {
      input: String,
      expectedOutput: String,
    }
  ],
});

const Problem = mongoose.model('Problem', problemSchema);
export default Problem;
