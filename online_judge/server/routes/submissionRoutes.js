import express from 'express';
import Submission from '../models/Submission.js';
import Problem from '../models/Problem.js';
import { runCode } from '../judge/runner.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import getAIReview from '../utils/getAIReview.js'; // Ensure this file exists

const router = express.Router();

// 🟢 Route: Submit Code and Run Test Cases
router.post('/', verifyToken, async (req, res) => {
  const { code, language, problemId } = req.body;

  try {
    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    const testResults = [];

    for (const test of problem.testCases) {
      try {
        const result = await runCode(language, code, test.input);
        testResults.push({
          input: test.input,
          expected: test.expectedOutput,
          received: result,
          passed: result.trim() === test.expectedOutput.trim(),
        });
      } catch (err) {
        testResults.push({
          input: test.input,
          expected: test.expectedOutput,
          received: err.toString(),
          passed: false,
        });
      }
    }

    const passedCount = testResults.filter(t => t.passed).length;

    const submission = new Submission({
      user: req.user.id,
      problem: problemId,
      code,
      language,
      result: `${passedCount}/${testResults.length} Test Cases Passed`,
    });

    await submission.save();

    // 🔍 If not all test cases passed, get AI feedback
    if (passedCount < testResults.length) {
      const review = await getAIReview({
        code,
        language,
        problemTitle: problem.title,
        problemDescription: problem.description,
      });

      return res.status(201).json({
        summary: submission.result,
        testResults,
        aiFeedback: review,
      });
    }

    res.status(201).json({
      summary: submission.result,
      testResults,
    });
  } catch (err) {
    console.error('Submission Error:', err);
    res.status(500).json({ error: err.toString() });
  }
});

// 🟢 Route: Fetch All Submissions by Logged-In User
router.get('/my-submissions', verifyToken, async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user.id })
      .populate('problem', 'title')
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// 🏆 Route: Leaderboard - Top Users by Total Passed Test Cases
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Submission.aggregate([
      {
        $group: {
          _id: '$user',
          totalPassed: {
            $sum: {
              $toInt: {
                $arrayElemAt: [
                  { $split: ['$result', '/'] },
                  0
                ]
              }
            }
          },
          totalSubmissions: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: '$userInfo' },
      {
        $project: {
          username: '$userInfo.username',
          totalPassed: 1,
          totalSubmissions: 1
        }
      },
      { $sort: { totalPassed: -1 } },
      { $limit: 10 }
    ]);

    res.json(leaderboard);
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ error: 'Failed to load leaderboard' });
  }
});

export default router;
