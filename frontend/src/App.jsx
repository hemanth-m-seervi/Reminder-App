import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Timetable from './pages/Timetable';
import Exams from './pages/Exams';
import Notes from './pages/Notes';
import Reminders from './pages/Reminders';
import Schedule from './pages/Schedule';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);
  const handleLogout = () => {
    setToken(null);
    window.location.href = '/auth';
  };
  return (
    <Router>
      <div className="flex min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
        {token && <Sidebar />}
        <div className="flex-1 p-6">
          {token && (
            <div className="flex justify-end mb-4">
              <button onClick={handleLogout} className="btn-secondary px-4 py-2 rounded-lg text-purple-700 border border-purple-300 hover:bg-purple-100 transition">Logout</button>
            </div>
          )}
          <Routes>
            <Route path="/auth" element={<Auth setToken={setToken} />} />
            <Route path="/" element={
              <ProtectedRoute token={token}>
                <Home />
              </ProtectedRoute>
            } />
            <Route path="/timetable" element={
              <ProtectedRoute token={token}>
                <Timetable token={token} />
              </ProtectedRoute>
            } />
            <Route path="/exams" element={
              <ProtectedRoute token={token}>
                <Exams token={token} />
              </ProtectedRoute>
            } />
            <Route path="/notes" element={
              <ProtectedRoute token={token}>
                <Notes token={token} />
              </ProtectedRoute>
            } />
            <Route path="/reminders" element={
              <ProtectedRoute token={token}>
                <Reminders token={token} />
              </ProtectedRoute>
            } />
            <Route path="/schedule" element={
              <ProtectedRoute token={token}>
                <Schedule token={token} />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
