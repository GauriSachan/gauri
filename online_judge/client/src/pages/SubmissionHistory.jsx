import { useEffect, useState } from 'react';
import axios from 'axios';
import './SubmissionHistory.css';

export default function SubmissionHistory() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/submissions/my-submissions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubmissions(res.data);
      } catch (err) {
        console.error('Error fetching submissions:', err);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="submission-history-container">
      <h2>My Submissions</h2>
      {submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <ul>
          {submissions.map((sub, idx) => (
            <li key={idx}>
              <strong>{sub.problem.title}</strong> <br />
              Language: {sub.language} <br />
              <code>{sub.result}</code> <br />
              <small>{new Date(sub.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
