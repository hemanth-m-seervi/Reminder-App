import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Timetable({ token }) {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ day: '', subject: '', time: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/timetable', {
      headers: { 'x-auth-token': token }
    })
      .then(res => res.json())
      .then(data => setEntries(data));
  }, [token]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAdd = async () => {
    setError('');
    if (form.day && form.subject && form.time) {
      try {
        const res = await fetch('/api/timetable', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify(form)
        });
        const data = await res.json();
        if (res.ok) {
          setEntries([...entries, data]);
          setForm({ day: '', subject: '', time: '' });
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
      <h2 className="text-3xl font-bold text-purple-700 mb-6">College Timetable</h2>
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex gap-4 mb-4">
          <input name="day" value={form.day} onChange={handleChange} placeholder="Day" className="input" />
          <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" className="input" />
          <input name="time" value={form.time} onChange={handleChange} placeholder="Time" className="input" />
          <button onClick={handleAdd} className="btn-primary">Add</button>
        </div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <table className="w-full text-left">
          <thead>
            <tr className="text-purple-700">
              <th>Day</th>
              <th>Subject</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, idx) => (
              <tr key={idx} className="hover:bg-purple-50 transition">
                <td>{entry.day}</td>
                <td>{entry.subject}</td>
                <td>{entry.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
