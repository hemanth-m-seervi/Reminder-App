import React, { useState } from 'react';

export default function ExamDetails({ exam, onAddDetail }) {
  const [form, setForm] = useState({ subject: '', date: '', day: '', time: '' });
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleAdd = async e => {
    e.preventDefault();
    if (form.subject && form.date && form.day && form.time) {
      const success = await onAddDetail(exam._id, form);
      if (success) {
        setForm({ subject: '', date: '', day: '', time: '' });
        setError('');
      } else {
        setError('Error adding detail');
      }
    } else {
      setError('All fields required');
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-semibold text-purple-500">Details</span>
        <button
          className="btn-primary py-1 px-4 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700"
          onClick={() => setShowAdd(!showAdd)}
        >
          {showAdd ? 'Hide Add Subject' : 'Add Subject'}
        </button>
      </div>
      {showAdd && (
        <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4" onSubmit={handleAdd}>
          <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" className="input border rounded px-2 py-1" />
          <input name="date" value={form.date} onChange={handleChange} placeholder="Date" className="input border rounded px-2 py-1" type="date" />
          <input name="day" value={form.day} onChange={handleChange} placeholder="Day" className="input border rounded px-2 py-1" type="text" />
          <input name="time" value={form.time} onChange={handleChange} placeholder="Time" className="input border rounded px-2 py-1" type="time" />
          <button type="submit" className="btn-primary col-span-1 md:col-span-2 lg:col-span-4 py-1 px-4 rounded bg-purple-600 text-white font-semibold hover:bg-purple-700">Add Detail</button>
        </form>
      )}
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <table className="min-w-full text-left border rounded">
        <thead>
          <tr className="bg-purple-100 text-purple-700">
            <th className="py-2 px-3">Subject</th>
            <th className="py-2 px-3">Date</th>
            <th className="py-2 px-3">Day</th>
            <th className="py-2 px-3">Time</th>
          </tr>
        </thead>
        <tbody>
          {exam.details && exam.details.length > 0 ? (
            [...exam.details]
              .sort((a, b) => {
                
                const dateA = new Date(a.date + 'T' + (a.time || '00:00'));
                const dateB = new Date(b.date + 'T' + (b.time || '00:00'));
                return dateA - dateB;
              })
              .map((detail, idx) => (
                <tr key={idx} className="hover:bg-purple-50 transition">
                  <td className="py-1 px-3">{detail.subject}</td>
                  <td className="py-1 px-3">{detail.date ? new Date(detail.date).toLocaleDateString('en-GB') : ''}</td>
                  <td className="py-1 px-3">{detail.day}</td>
                  <td className="py-1 px-3">{detail.time}</td>
                </tr>
              ))
          ) : (
            <tr><td colSpan={4} className="text-center py-4 text-gray-400">No details added yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
