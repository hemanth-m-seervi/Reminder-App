import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function MarksEntry({ token }) {
  const [marksNotes, setMarksNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedExam, setSelectedExam] = useState('');
  const [showAddSubjectForm, setShowAddSubjectForm] = useState(false);
  const [newExamName, setNewExamName] = useState('');
  const [newSubject, setNewSubject] = useState({ subject: '', totalMarks: '', marks: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/marks-note', {
      headers: { 'x-auth-token': token }
    })
      .then(res => res.json())
      .then(data => setMarksNotes(data));
  }, [token]);

  // Create new exam note
  const handleCreateExam = async () => {
    setError('');
    if (!newExamName) {
      setError('Please enter exam name');
      return;
    }
    try {
      const res = await fetch('/api/marks-note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ examName: newExamName, subjects: [] })
      });
      const data = await res.json();
      if (res.ok) {
        setMarksNotes([...marksNotes, data]);
        setSelectedExam(data.examName);
        setNewExamName('');
      } else {
        setError(data.msg || 'Error');
      }
    } catch {
      setError('Server error');
    }
  };

  // Add subject to selected exam
  const handleAddSubject = async () => {
    setError('');
    if (!selectedExam || !newSubject.subject || !newSubject.totalMarks || !newSubject.marks) {
      setError('Please fill all fields');
      return;
    }
    try {
      const res = await fetch(`/api/marks-note/${selectedExam}/subject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(newSubject)
      });
      const data = await res.json();
      if (res.ok) {
        setMarksNotes(notes => notes.map(n => n.examName === selectedExam ? data : n));
        setNewSubject({ subject: '', totalMarks: '', marks: '' });
      } else {
        setError(data.msg || 'Error');
      }
    } catch {
      setError('Server error');
    }
  };

  // Edit subject in selected exam
  const handleEditSubject = async (subject, totalMarks, marks) => {
    setError('');
    try {
      const res = await fetch(`/api/marks-note/${selectedExam}/subject/${subject}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ totalMarks, marks })
      });
      const data = await res.json();
      if (res.ok) {
        setMarksNotes(notes => notes.map(n => n.examName === selectedExam ? data : n));
      } else {
        setError(data.msg || 'Error');
      }
    } catch {
      setError('Server error');
    }
  };

  // Delete subject from selected exam
  const handleDeleteSubject = async (subject) => {
    setError('');
    try {
      const res = await fetch(`/api/marks-note/${selectedExam}/subject/${subject}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token
        }
      });
      const data = await res.json();
      if (res.ok) {
        setMarksNotes(notes => notes.map(n => n.examName === selectedExam ? data : n));
      } else {
        setError(data.msg || 'Error');
      }
    } catch {
      setError('Server error');
    }
  };

  const selectedNote = marksNotes.find(n => n.examName === selectedExam);

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">Marks Entry</h2>
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="text-xl font-bold text-purple-700 mb-2">Create or Select Exam Session</h3>
        <div className="flex gap-2 mb-4">
          <input
            value={newExamName}
            onChange={e => setNewExamName(e.target.value)}
            placeholder="New Session Name"
            className="input rounded-lg border-2 border-purple-200 px-4 py-2"
          />
          <button type="button" onClick={handleCreateExam} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Create Session
          </button>
        </div>
        <div className="flex mb-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by session name..."
            className="input border-2 border-purple-300 rounded-lg px-3 py-2 w-56 focus:outline-none focus:border-purple-500 transition"
            style={{ minWidth: '140px' }}
          />
        </div>
        {/* Session List - click to select */}
        {/* Saved Marks Notes Section Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-purple-700 mb-2">Saved Marks Notes</h3>
          {marksNotes.length === 0 && <div className="text-gray-500">No marks notes yet.</div>}
        </div>
        <div className="grid gap-3 mb-6">
          {marksNotes
            .filter(note => (note.examName || "").toLowerCase().includes(search.toLowerCase()))
            .map((note, idx) => (
              <div key={idx}>
                <div className={`rounded-xl p-4 shadow cursor-pointer border ${selectedExam === note.examName ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white hover:border-purple-300'}`}
                  onClick={() => {
                    if (selectedExam === note.examName) {
                      setSelectedExam('');
                      setShowAddSubjectForm(false);
                    } else {
                      setSelectedExam(note.examName);
                      setShowAddSubjectForm(false);
                    }
                  }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-purple-700">{note.examName}</span>
                    <span className="text-sm text-gray-500">{note.subjects.length} Subjects</span>
                  </div>
                </div>
                {/* Show details below the selected session card only */}
                {selectedExam === note.examName && (
                  <div className="mt-2 mb-4">
                    <h4 className="text-lg font-semibold text-purple-700 mb-2">Subjects in {note.examName}</h4>
                    {note.subjects.length > 0 ? (
                      <table className="w-full text-left border border-purple-100 rounded-lg mb-2">
                        <thead>
                          <tr className="bg-purple-100 text-purple-700">
                            <th className="py-2 px-3">Subject</th>
                            <th className="py-2 px-3">Total Marks</th>
                            <th className="py-2 px-3">Marks Scored</th>
                            <th className="py-2 px-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {note.subjects.map((subj, sidx) => (
                            <tr key={sidx} className="hover:bg-purple-50 transition">
                              <td className="py-1 px-3 font-medium">{subj.subject}</td>
                              <td className="py-1 px-3">{subj.totalMarks}</td>
                              <td className="py-1 px-3">{subj.marks}</td>
                              <td className="py-1 px-3">
                                <button type="button" className="text-blue-600 text-xs px-2" onClick={e => {e.stopPropagation(); handleEditSubject(subj.subject, prompt('Total Marks', subj.totalMarks), prompt('Marks Scored', subj.marks));}}>Edit</button>
                                <button type="button" className="text-red-500 text-xs px-2" onClick={e => {e.stopPropagation(); handleDeleteSubject(subj.subject);}}>Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-gray-500 mb-2">No subjects added yet.</div>
                    )}
                    {/* Add Subject Button and Form */}
                    <div className="mt-4">
                      {!showAddSubjectForm ? (
                        <button type="button" className="btn-primary px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition" onClick={() => setShowAddSubjectForm(true)}>
                          Add Subject
                        </button>
                      ) : (
                        <div className="flex gap-2 mb-2 mt-2">
                          <input
                            value={newSubject.subject}
                            onChange={e => setNewSubject({ ...newSubject, subject: e.target.value })}
                            placeholder="Subject Name"
                            className="input rounded-lg border-2 border-purple-200 px-4 py-2"
                          />
                          <input
                            value={newSubject.totalMarks}
                            onChange={e => setNewSubject({ ...newSubject, totalMarks: e.target.value })}
                            placeholder="Total Marks"
                            type="number"
                            className="input rounded-lg border-2 border-purple-200 px-4 py-2 w-24"
                          />
                          <input
                            value={newSubject.marks}
                            onChange={e => setNewSubject({ ...newSubject, marks: e.target.value })}
                            placeholder="Marks Scored"
                            type="number"
                            className="input rounded-lg border-2 border-purple-200 px-4 py-2 w-24"
                          />
                          <button type="button" onClick={handleAddSubject} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Save
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
        
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      </div>
    </motion.div>
  );
}
