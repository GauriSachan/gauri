import { useEffect, useState } from 'react';
import axios from 'axios';
import './MySubmissions.css';
import { formatDistanceToNow } from 'date-fns';

export default function MySubmissions() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/submissions/my-submissions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSubmissions(res.data);
      } catch (err) {
        console.error('Failed to fetch submissions:', err);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="submission-page-container">
      <h2>📜 My Submissions</h2>
      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <div className="submissions-list">
          {submissions.map((sub, idx) => (
            <div className="submission-card" key={idx}>
              <div className="submission-header">
                <strong>{sub.problem.title}</strong>
                <span>{formatDistanceToNow(new Date(sub.createdAt))} ago</span>
              </div>
              <div className="submission-details">
                <p><b>Language:</b> {sub.language}</p>
                <p><b>Result:</b> {sub.result}</p>
                <pre className="submitted-code">{sub.code.slice(0, 200)}{sub.code.length > 200 ? '...' : ''}</pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
