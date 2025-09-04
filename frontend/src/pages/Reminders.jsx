
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
const API_BASE = import.meta.env.VITE_API_BASE_URL;

function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [form, setForm] = useState({ title: '', deadline: '', completed: false });
  const [error, setError] = useState('');
  const [showMissed, setShowMissed] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
  fetch(`${API_BASE}/api/reminders`, {
      headers: { 'x-auth-token': token }
    })
      .then(res => res.json())
      .then(data => setReminders(data));
    // Real-time check every minute
    const interval = setInterval(() => {
      setReminders(reminders => reminders.map(r => {
        if (!r.completed && new Date(r.deadline) < new Date() && !r.missed) {
          return { ...r, missed: true };
        }
        return r;
      }));
    }, 60000);
    return () => clearInterval(interval);
  }, [token]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAdd = async () => {
    setError('');
    if (form.title && form.deadline) {
      try {
  const res = await fetch(`${API_BASE}/api/reminders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify(form)
        });
        const data = await res.json();
        if (res.ok) {
          setReminders([...reminders, data]);
          setForm({ title: '', deadline: '', completed: false });
        } else {
          setError(data.msg || 'Error');
        }
      } catch {
        setError('Server error');
      }
    }
  };
  const handleComplete = async idx => {
    try {
      const reminder = reminders[idx];
  const res = await fetch(`${API_BASE}/api/reminders/${reminder._id}`, {
        method: 'PATCH',
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      if (res.ok) {
        setReminders(reminders => reminders.filter((r, i) => i !== idx));
      }
    } catch {}
  };

  // Real-time missed and upcoming logic
  const now = new Date();
  const upcomingReminders = reminders.filter(r => !r.completed && !r.missed && new Date(r.deadline) >= now)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  const nearest = upcomingReminders.length > 0 ? upcomingReminders[0] : null;
  const rest = upcomingReminders.slice(1);
  const missedReminders = reminders.filter(r => r.missed && !r.completed);

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">Reminders & Deadlines</h2>
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <span></span>
        </div>
        {/* Remove the top Missed button, keep only the small one next to Add */}
        <div className="flex gap-4 mb-4">
          <div className="w-full flex flex-row flex-nowrap gap-4 items-center">
            <input name="title" value={form.title} onChange={handleChange} placeholder="Assignment/Project" className="input  min-w-0" />
            <input name="deadline" value={form.deadline} onChange={handleChange} placeholder="Deadline" className="input min-w-0 w-32 ml-2" type="date" />
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-purple-800 transition-all duration-200 focus:outline-none flex-shrink-0 ml-15"
              style={{ maxWidth: '120px', minWidth: '100px' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add
            </button>
            <button
              className="px-2 py-1 rounded bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition ml-2"
              onClick={() => setShowMissed(m => !m)}
              style={{ height: '32px' }}
            >
              Missed ({missedReminders.length})
            </button>
          </div>
        </div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        {/* Nearest deadline banner */}
        {nearest && !showMissed && (
          <div className={`rounded-xl p-4 mb-6 flex flex-col md:flex-row justify-between items-center shadow-lg border-2 border-red-400 bg-red-50`}>
            <div>
              <span className="text-lg font-bold text-red-700">Nearest Deadline:</span>
              <span className="ml-2 text-xl font-bold text-purple-700">{nearest.title}</span>
              <span className="ml-2 text-base text-gray-700">{nearest.deadline ? new Date(nearest.deadline).toLocaleDateString('en-GB') : ''}</span>
            </div>
            <button onClick={() => handleComplete(reminders.findIndex(r => r._id === nearest._id))} className="btn-secondary mt-2 md:mt-0">Mark as Done</button>
          </div>
        )}
        {!showMissed && (
          <ul className="space-y-2">
            {rest.map((reminder, idx) => (
              <li key={reminder._id || idx} className={`rounded p-3 flex justify-between items-center bg-purple-50`}>
                <span>
                  <strong className="text-purple-700">{reminder.title}</strong> - {reminder.deadline ? new Date(reminder.deadline).toLocaleDateString('en-GB') : ''}
                </span>
                <button onClick={() => handleComplete(reminders.findIndex(r => r._id === reminder._id))} className="btn-secondary">Mark as Done</button>
              </li>
            ))}
          </ul>
        )}
        {/* Missed deadlines list */}
        {showMissed && (
          <div className="mt-4">
            <h4 className="text-lg font-bold text-red-600 mb-2">Missed Deadlines</h4>
            {missedReminders.length === 0 ? (
              <div className="text-gray-500">No missed deadlines.</div>
            ) : (
              <ul className="space-y-2">
                {missedReminders.map((reminder, idx) => (
                  <li key={reminder._id || idx} className="rounded p-3 flex justify-between items-center bg-red-100">
                    <span>
                      <strong className="text-red-700">{reminder.title}</strong> - {reminder.deadline ? new Date(reminder.deadline).toLocaleDateString('en-GB') : ''}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default Reminders;
