import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import './ProblemPage.css';

export default function ProblemPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('// Write your code here...');
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [summary, setSummary] = useState('');

  // AI Companion States
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // AI Review States
  const [aiReview, setAiReview] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/problems/${id}`);
        setProblem(res.data);
      } catch (err) {
        console.error('Failed to load problem:', err);
        toast.error('Could not load problem');
      }
    };

    fetchProblem();
  }, [id]);

  const handleSubmit = async () => {
    setLoading(true);
    setTestResults([]);
    setSummary('');
    setAiReview('');

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/submissions',
        { language, code, problemId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTestResults(res.data.testResults);
      setSummary(res.data.summary);

      if (res.data.aiFeedback) {
        setAiReview(res.data.aiFeedback);
      }

      toast.success('Code submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAIHelp = async () => {
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiResponse('');

    try {
      const res = await axios.post('http://localhost:5000/api/ai/help', {
        prompt: aiQuery,
        problemTitle: problem.title,
        problemDescription: problem.description,
      });
      setAiResponse(res.data.response);
    } catch (err) {
      console.error('AI error:', err);
      setAiResponse('AI is currently unavailable.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleAIReview = async () => {
    setReviewLoading(true);
    setAiReview('');

    try {
      const res = await axios.post('http://localhost:5000/api/ai/review', {
        problemTitle: problem.title,
        problemDescription: problem.description,
        code,
        language,
      });

      setAiReview(res.data.response);
    } catch (err) {
      console.error('AI Review Error:', err);
      toast.error('AI review failed');
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="problem-container">
      {problem ? (
        <>
          <h2>{problem.title}</h2>
          <p>{problem.description}</p>

          <h4>Examples:</h4>
          {problem.examples.map((ex, i) => (
            <pre key={i}>{ex}</pre>
          ))}

          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="java">Java</option>
          </select>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={15}
          ></textarea>

          <button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>

          {loading && <LoadingSpinner />}

          {summary && (
            <div className="summary-box">
              <h4>Summary:</h4>
              <p>{summary}</p>
            </div>
          )}

          {testResults.length > 0 && (
            <div className="results-box">
              <h4>Test Case Results:</h4>
              {testResults.map((test, i) => (
                <div key={i} className={`test-result ${test.passed ? 'pass' : 'fail'}`}>
                  <p><strong>Input:</strong> {test.input}</p>
                  <p><strong>Expected:</strong> {test.expected}</p>
                  <p><strong>Received:</strong> {test.received}</p>
                  <p>Status: {test.passed ? '✅ Passed' : '❌ Failed'}</p>
                  <hr />
                </div>
              ))}
            </div>
          )}

          {/* AI Companion Section */}
          <div className="ai-companion">
            <h3>💬 AI Companion</h3>
            <p>Ask for a hint or explanation:</p>
            <textarea
              placeholder="e.g., I don't understand the example input"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              rows={4}
            />
            <button onClick={handleAIHelp} disabled={aiLoading}>
              {aiLoading ? 'Thinking...' : 'Ask AI'}
            </button>

            {aiResponse && (
              <div className="ai-response">
                <strong>AI says:</strong>
                <p>{aiResponse}</p>
              </div>
            )}
          </div>

          {/* AI Review Section */}
          <div className="ai-review">
            <h3>🧠 Ask AI to Review Your Code</h3>
            <button onClick={handleAIReview} disabled={reviewLoading}>
              {reviewLoading ? 'Analyzing...' : 'Review My Code'}
            </button>
            {aiReview && (
              <div className="ai-response">
                <strong>AI Feedback:</strong>
                <p>{aiReview}</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <p>Loading problem...</p>
      )}
    </div>
  );
}
