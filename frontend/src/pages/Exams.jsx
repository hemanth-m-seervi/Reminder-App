
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ExamDetails from '../components/ExamDetails';
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Exams({ token }) {
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState("");
  const [examForm, setExamForm] = useState({ name: '' });
  const [showDetails, setShowDetails] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
  fetch(`${API_BASE}/api/exams`, {
      headers: { 'x-auth-token': token }
    })
      .then(res => res.json())
      .then(data => setExams(data));
  }, [token]);

  const handleExamChange = e => setExamForm({ ...examForm, [e.target.name]: e.target.value });
  const handleAddExam = async e => {
    e.preventDefault();
    setError('');
    if (examForm.name) {
      try {
  const res = await fetch(`${API_BASE}/api/exams`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify({ name: examForm.name })
        });
        const data = await res.json();
        if (res.ok) {
          setExams([...exams, { ...data, details: [] }]);
          setExamForm({ name: '' });
        } else {
          setError(data.msg || 'Error');
        }
      } catch {
        setError('Server error');
      }
    }
  };

  const handleAddDetail = async (examId, detail) => {
    try {
  const res = await fetch(`${API_BASE}/api/exams/${examId}/details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(detail)
      });
      const data = await res.json();
      if (res.ok) {
        setExams(exams => exams.map(exam => exam._id === examId ? { ...exam, details: data.details } : exam));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="min-h-screen md:ml-64 flex pt-16 px-4">
      <div className="max-w-4xl w-full mx-auto">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">Exams</h2>
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 mb-8">
        <form className="flex flex-col sm:flex-row gap-4 mb-6" onSubmit={handleAddExam}>
          <input name="name" value={examForm.name} onChange={handleExamChange} placeholder="Exam Name" className="input border-2 border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 transition" />
          <button type="submit" className="btn-primary py-2 px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition self-start">Add Exam</button>
        </form>
        <div className="flex mb-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by exam name..."
            className="input border-2 border-purple-300 rounded-lg px-3 py-2 w-56 focus:outline-none focus:border-purple-500 transition"
            style={{ minWidth: '140px' }}
          />
        </div>
        {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
        <div>
          {exams.length === 0 ? (
            <div className="text-center py-6 text-gray-400">No exams added yet.</div>
          ) : (
            [...exams]
              .reverse()
              .filter(exam => (exam.name || "").toLowerCase().includes(search.toLowerCase()))
              .map(exam => (
                <div key={exam._id || exam.name} className="mb-4">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-3 mb-2 flex items-center justify-between shadow cursor-pointer"
                    onClick={() => setShowDetails(showDetails === exam._id ? null : exam._id)}>
                    <span className="text-xl font-bold text-purple-700">{exam.name}</span>
                    <button
                      className="text-purple-600 font-semibold px-4 py-2 rounded hover:bg-purple-200 transition"
                      onClick={e => {e.stopPropagation(); setShowDetails(showDetails === exam._id ? null : exam._id);}}
                    >
                      {showDetails === exam._id ? 'Hide Details' : 'Show Details'}
                    </button>
                  </div>
                  {showDetails === exam._id && (
                    <ExamDetails exam={exam} onAddDetail={handleAddDetail} />
                  )}
                </div>
              ))
          )}
        </div>
      </div>
      </div>
    </motion.div>
  );
}
