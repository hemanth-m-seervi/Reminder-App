import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Schedule({ token }) {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ time: '', task: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/schedule', {
      headers: { 'x-auth-token': token }
    })
      .then(res => res.json())
      .then(data => setTasks(data));
  }, [token]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAdd = async () => {
    setError('');
    if (form.time && form.task) {
      try {
        const res = await fetch('/api/schedule', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify(form)
        });
        const data = await res.json();
        if (res.ok) {
          setTasks([...tasks, data]);
          setForm({ time: '', task: '' });
        } else {
          setError(data.msg || 'Error');
        }
      } catch {
        setError('Server error');
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">Daily Schedule</h2>
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex gap-4 mb-4">
          <input name="time" value={form.time} onChange={handleChange} placeholder="Time" className="input" />
          <input name="task" value={form.task} onChange={handleChange} placeholder="Task" className="input" />
          <button onClick={handleAdd} className="btn-primary">Add</button>
        </div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <ul className="space-y-2">
          {tasks.map((task, idx) => (
            <li key={idx} className="bg-purple-50 rounded p-3">
              <strong className="text-purple-700">{task.time}:</strong> {task.task}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
