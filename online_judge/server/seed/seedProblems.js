import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Problem from '../models/Problem.js';

dotenv.config();

const problems = [
  {
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    difficulty: 'Easy',
  },
  {
    title: 'Reverse Linked List',
    description: 'Reverse a singly linked list.',
    difficulty: 'Easy',
  },
  {
    title: 'Median of Two Sorted Arrays',
    description: 'Find the median of the two sorted arrays.',
    difficulty: 'Hard',
  },
  {
    title: 'Valid Parentheses',
    description: 'Given a string s containing just the characters (), {}, [], determine if the input string is valid.',
    difficulty: 'Easy',
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    difficulty: 'Medium',
  },
];

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    await Problem.deleteMany({});
    await Problem.insertMany(problems);
    console.log('✅ Problems inserted successfully');
    process.exit();
  })
  .catch(err => {
    console.error('❌ Error inserting problems:', err);
    process.exit(1);
  });
