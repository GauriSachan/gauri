// src/pages/ProblemPage.jsx
import { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProblemPage() {
  const { id: problemId } = useParams();
  const [code, setCode] = useState('// Write your code here...');
  const [language, setLanguage] = useState('python');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/submit',
        { code, language, problemId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResult(res.data.result);
      toast.success('Code submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Submission failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Problem #{problemId}</h2>

      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="python">Python</option>
        <option value="cpp">C++</option>
        <option value="c">C</option>
        <option value="java">Java</option>
      </select>

      <textarea
        rows="15"
        cols="70"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        style={{
          background: '#1e1e1e',
          color: 'white',
          border: '1px solid #555',
          padding: '10px',
          marginTop: '1rem',
        }}
      />

      <br />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? <LoadingSpinner /> : 'Submit'}
      </button>

      {result && (
        <div className="card" style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
          <strong>Output:</strong>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}
