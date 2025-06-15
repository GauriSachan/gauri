// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css'; // optional styling

export default function Dashboard() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/problems');
        setProblems(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch problems:', err.message);
      }
    };

    fetchProblems();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Available Problems</h2>
      {problems.length === 0 ? (
        <p>No problems available</p>
      ) : (
        <ul>
          {problems.map((p) => (
            <li key={p._id}>
              <a href={`/problems/${p._id}`}>{p.title}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
