import { useEffect, useState } from 'react';
import axios from 'axios';
import './Leaderboard.css';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/submissions/leaderboard');
        setLeaders(res.data);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      }
    };
    fetchLeaders();
  }, []);

  return (
    <div className="leaderboard-container">
      <h2>🏆 Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>Test Cases Passed</th>
            <th>Total Submissions</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.totalPassed}</td>
              <td>{user.totalSubmissions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
