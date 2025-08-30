import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Reminders({ token }) {
  const [reminders, setReminders] = useState([]);
  const [form, setForm] = useState({ title: '', deadline: '', completed: false });
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/reminders', {
      headers: { 'x-auth-token': token }
    })
      .then(res => res.json())
      .then(data => setReminders(data));
  }, [token]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAdd = async () => {
    setError('');
    if (form.title && form.deadline) {
      try {
        const res = await fetch('/api/reminders', {
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
      const res = await fetch(`/api/reminders/${reminder._id}`, {
        method: 'PATCH',
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      if (res.ok) {
        setReminders(reminders.map((r, i) => i === idx ? data : r));
      }
    } catch {}
  };

  // Sort reminders by deadline ascending
  const sortedReminders = [...reminders]
    .filter(r => !r.completed)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  const nearest = sortedReminders.length > 0 ? sortedReminders[0] : null;
  const rest = sortedReminders.slice(1);

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">Reminders & Deadlines</h2>
      <div className="bg-white rounded-xl shadow p-6 mb-6">
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
          </div>
        </div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        {/* Nearest deadline banner */}
        {nearest && (
          <div className={`rounded-xl p-4 mb-6 flex flex-col md:flex-row justify-between items-center shadow-lg border-2 ${nearest.completed ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'}`}>
            <div>
              <span className="text-lg font-bold text-red-700">Nearest Deadline:</span>
              <span className="ml-2 text-xl font-bold text-purple-700">{nearest.title}</span>
              <span className="ml-2 text-base text-gray-700">{nearest.deadline ? new Date(nearest.deadline).toLocaleDateString('en-GB') : ''}</span>
            </div>
            <button onClick={() => handleComplete(reminders.findIndex(r => r._id === nearest._id))} className={`btn-secondary mt-2 md:mt-0 ${nearest.completed ? 'line-through' : ''}`}>{nearest.completed ? 'Completed' : 'Mark as Done'}</button>
          </div>
        )}
        <ul className="space-y-2">
          {rest.map((reminder, idx) => (
            <li key={reminder._id || idx} className={`rounded p-3 flex justify-between items-center ${reminder.completed ? 'bg-green-100' : 'bg-purple-50'}`}>
              <span>
                <strong className="text-purple-700">{reminder.title}</strong> - {reminder.deadline ? new Date(reminder.deadline).toLocaleDateString('en-GB') : ''}
              </span>
              <button onClick={() => handleComplete(reminders.findIndex(r => r._id === reminder._id))} className={`btn-secondary ${reminder.completed ? 'line-through' : ''}`}>{reminder.completed ? 'Completed' : 'Mark as Done'}</button>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
