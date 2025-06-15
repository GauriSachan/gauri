// routes/problemRoutes.js
import express from 'express';
import Problem from '../models/Problem.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
});

export default router;
