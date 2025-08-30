import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function Notes({ token }) {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ subject: '', note: '' });
  const [pdf, setPdf] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef();

  useEffect(() => {
    fetch('/api/notes', {
      headers: { 'x-auth-token': token }
    })
      .then(res => res.json())
      .then(data => setNotes(data));
  }, [token]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFileChange = e => setPdf(e.target.files[0]);

  const handleAdd = async () => {
    setError('');
    if (form.subject && form.note) {
      try {
        const res = await fetch('/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify(form)
        });
        const data = await res.json();
        if (res.ok) {
          setNotes([...notes, data]);
          setForm({ subject: '', note: '' });
        } else {
          setError(data.msg || 'Error');
        }
      } catch {
        setError('Server error');
      }
    }
  };

  const handleAddPdf = async () => {
    setError('');
    if (form.subject && form.note && pdf) {
      const formData = new FormData();
      formData.append('subject', form.subject);
      formData.append('note', form.note);
      formData.append('pdf', pdf);
      try {
        const res = await fetch('/api/notes/pdf', {
          method: 'POST',
          headers: {
            'x-auth-token': token
          },
          body: formData
        });
        const data = await res.json();
        if (res.ok) {
          setNotes([...notes, data]);
          setForm({ subject: '', note: '' });
          setPdf(null);
          fileInputRef.current.value = '';
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
      <h2 className="text-3xl font-bold text-purple-700 mb-6">Subject-wise Notes</h2>
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex gap-4 mb-4 flex-wrap">
          <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" className="input" />
          <input name="note" value={form.note} onChange={handleChange} placeholder="Note" className="input" />
          <button onClick={handleAdd} className="btn-primary">Add Text Note</button>
        </div>
        <div className="flex gap-4 mb-4 flex-wrap">
          <input type="file" accept="application/pdf" ref={fileInputRef} onChange={handleFileChange} className="input" />
          <button onClick={handleAddPdf} className="btn-primary">Add PDF Note</button>
        </div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <ul className="space-y-2">
          {notes.map((note, idx) => (
            <li key={idx} className="bg-purple-50 rounded p-3">
              <strong className="text-purple-700">{note.subject}:</strong> {note.note}
              {note.pdfUrl && (
                <a href={note.pdfUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 underline">View PDF</a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
