import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Exams({ token }) {
  const [exams, setExams] = useState([]);
  const [form, setForm] = useState({ subject: '', date: '', marks: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/exams', {
      headers: { 'x-auth-token': token }
    })
      .then(res => res.json())
      .then(data => setExams(data));
  }, [token]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAdd = async () => {
    setError('');
    if (form.subject && form.date && form.marks) {
      try {
        const res = await fetch('/api/exams', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify(form)
        });
        const data = await res.json();
        if (res.ok) {
          setExams([...exams, data]);
          setForm({ subject: '', date: '', marks: '' });
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
      <h2 className="text-3xl font-bold text-purple-700 mb-6">Exam Timetable & Marks</h2>
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex gap-4 mb-4">
          <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" className="input" />
          <input name="date" value={form.date} onChange={handleChange} placeholder="Date" className="input" type="date" />
          <input name="marks" value={form.marks} onChange={handleChange} placeholder="Marks" className="input" type="number" />
          <button onClick={handleAdd} className="btn-primary">Add</button>
        </div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <table className="w-full text-left">
          <thead>
            <tr className="text-purple-700">
              <th>Subject</th>
              <th>Date</th>
              <th>Marks</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam, idx) => (
              <tr key={idx} className="hover:bg-purple-50 transition">
                <td>{exam.subject}</td>
                <td>{exam.date}</td>
                <td>{exam.marks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
