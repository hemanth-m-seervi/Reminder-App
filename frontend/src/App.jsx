import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
// No Topbar import needed
import Home from './pages/Home';
import Timetable from './pages/Timetable';
import Exams from './pages/Exams';
import Notes from './pages/Notes';
import Reminders from './pages/Reminders';
import Schedule from './pages/Schedule';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import MarksEntry from './pages/MarksEntry';
import { FaBars } from 'react-icons/fa';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
        {token && <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />}
        {token && isSidebarOpen && (
          <div
            className="fixed inset-0 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
        {token && (
          <button
            onClick={handleLogout}
            className="absolute top-4 right-6 z-50 px-4 py-2 rounded-lg bg-purple-100 text-purple-700 font-semibold border border-purple-300 hover:bg-purple-200 transition text-sm shadow"
          >
            Logout
          </button>
        )}
  <div className={`flex-1 p-4 md:p-6 mt-14 ${isSidebarOpen ? 'md:ml-64' : ''} transition-all duration-300 overflow-x-hidden`}>
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
            <Route path="/marks-entry" element={
              <ProtectedRoute token={token}>
                <MarksEntry token={token} />
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
