import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProblemPage from './pages/ProblemPage';
import NotFound from './pages/NotFound';
import './App.css';

// Toast imports
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SubmissionHistory from './pages/SubmissionHistory';

<Route path="/submissions" element={<SubmissionHistory />} />

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="main-container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/problems/:id" element={<ProblemPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <ToastContainer theme="dark" position="bottom-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
