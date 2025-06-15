import express from 'express';
import Submission from '../models/Submission.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const runCode = require('../judge/runner.js'); // ✅ Correct way to import CommonJS module in ES Module

import { verifyToken } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  const { code, language, problemId } = req.body;

  try {
    const output = await runCode(language, code);

    const submission = new Submission({
      user: req.user.id,
      problem: problemId,
      code,
      language,
      result: output
    });

    await submission.save();

    res.status(201).json({ result: output });
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

export default router;
