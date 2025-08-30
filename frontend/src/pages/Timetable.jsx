import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Timetable({ token }) {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ day: '', startTime: '08:00', endTime: '09:00', subject: '' });
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
    if (form.day && form.subject && form.startTime && form.endTime) {
      try {
        const res = await fetch('/api/timetable', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify({
            day: form.day,
            subject: form.subject,
            startTime: form.startTime,
            endTime: form.endTime
          })
        });
        const data = await res.json();
        if (res.ok) {
          setEntries([...entries, data]);
          setForm({ day: '', startTime: '', endTime: '', subject: '' });
        } else {
          setError(data.msg || 'Error');
        }
      } catch {
        setError('Server error');
      }
    }
  };

  // Prepare days and times for table
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  // Build unique time slots from startTime and endTime
  const timeSlots = Array.from(new Set(entries.map(e => {
    const st = e.startTime || '08:00';
    const et = e.endTime || '08:00';
    return `${st} - ${et}`;
  }))).sort();

  // Build timetable grid
  const grid = timeSlots.map(slot => {
    const row = { slot };
    days.forEach(day => {
      const entry = entries.find(e => {
        const st = e.startTime || '08:00';
        const et = e.endTime || '08:00';
        return e.day === day && `${st} - ${et}` === slot;
      });
      row[day] = entry ? entry.subject : '';
    });
    return row;
  });

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">College Timetable</h2>
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex gap-4 mb-4 flex-wrap">
          <select name="day" value={form.day} onChange={handleChange} className="input">
            <option value="">Select Day</option>
            {days.map(day => <option key={day} value={day}>{day}</option>)}
          </select>
          <div className="flex items-center gap-1">
            <input name="startTime" value={form.startTime} onChange={handleChange} placeholder="Start Time" className="input w-26" type="time" />
            <span className="mx-1 text-gray-500 font-semibold ml-2 mr-2">to</span>
            <input name="endTime" value={form.endTime} onChange={handleChange} placeholder="End Time" className="input w-26" type="time" />
          </div>
          <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" className="input ml-4" />
          <button
            onClick={handleAdd}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold px-3 py-1.5 rounded-lg shadow hover:scale-105 transition-transform duration-200 disabled:opacity-60 text-sm"
          >
            <span className="inline-flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add
            </span>
          </button>
        </div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <div className="overflow-x-auto">
          <table className="w-full text-center border">
            <thead>
              <tr className="text-purple-700 bg-purple-50">
                <th className="border px-2 py-1">Time</th>
                {days.map(day => <th key={day} className="border px-2 py-1">{day}</th>)}
              </tr>
            </thead>
            <tbody>
              {grid.map((row, idx) => (
                <tr key={idx} className="hover:bg-purple-50 transition">
                  <td className="border px-2 py-1 font-semibold">{row.slot}</td>
                  {days.map(day => (
                    <td key={day} className="border px-2 py-1">{row[day]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
