import express from 'express';
import Problem from '../models/Problem.js';

const router = express.Router();

// @route   GET /api/problems
// @desc    Fetch all problems
router.get('/', async (req, res) => {
  try {
    const problems = await Problem.find();
    console.log('📦 Problems fetched from DB:', problems);
    res.json(problems);
  } catch (err) {
    console.error('❌ Error fetching problems:', err.message);
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
});

// @route   GET /api/problems/:id
// @desc    Fetch single problem by ID
router.get('/:id', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    res.json(problem);
  } catch (err) {
    console.error('❌ Error fetching problem by ID:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
