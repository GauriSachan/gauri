// models/Problem.js
import mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema({
  input: String,
  output: String,
});

const problemSchema = new mongoose.Schema({
  title: String,
  description: String,
  examples: [exampleSchema],
  difficulty: String,
});

const Problem = mongoose.model('Problem', problemSchema);
export default Problem;
