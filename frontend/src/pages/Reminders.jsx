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

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">Reminders & Deadlines</h2>
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex gap-4 mb-4">
          <input name="title" value={form.title} onChange={handleChange} placeholder="Assignment/Project" className="input" />
          <input name="deadline" value={form.deadline} onChange={handleChange} placeholder="Deadline" className="input" type="date" />
          <button onClick={handleAdd} className="btn-primary">Add</button>
        </div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <ul className="space-y-2">
          {reminders.map((reminder, idx) => (
            <li key={idx} className={`rounded p-3 flex justify-between items-center ${reminder.completed ? 'bg-green-100' : 'bg-purple-50'}`}>
              <span>
                <strong className="text-purple-700">{reminder.title}</strong> - {reminder.deadline}
              </span>
              <button onClick={() => handleComplete(idx)} className={`btn-secondary ${reminder.completed ? 'line-through' : ''}`}>{reminder.completed ? 'Completed' : 'Mark as Done'}</button>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
