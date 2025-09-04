
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Notes({ token }) {
  // Delete note or PDF
  const handleDeleteNote = async (noteId, subject, noteObjIdx) => {
    try {
  const res = await fetch(`${API_BASE}/api/notes/note`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ noteId, subject, noteObjIdx })
      });
      const data = await res.json();
      if (res.ok) {
        setNotes(notes.map(n => n._id === data._id ? data : n));
      }
    } catch {
      setError('Delete failed');
    }
  };
  const [notes, setNotes] = useState([]); // Array of class/sem notes
  const [classForm, setClassForm] = useState({ classOrSem: '' });
  const [subjectForm, setSubjectForm] = useState({ subject: '' });
  const [noteForm, setNoteForm] = useState({ note: '' });
  const [pdf, setPdf] = useState(null);
  const [error, setError] = useState('');
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
  fetch(`${API_BASE}/api/notes`, {
      headers: { 'x-auth-token': token }
    })
      .then(res => res.json())
      .then(data => setNotes(data));
  }, [token]);

  // Create class/sem
  const handleAddClass = async () => {
    setError('');
    if (classForm.classOrSem) {
      try {
  const res = await fetch(`${API_BASE}/api/notes/class`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify(classForm)
        });
        const data = await res.json();
        if (res.ok) {
          setNotes([...notes, data]);
          setClassForm({ classOrSem: '' });
        } else {
          setError(data.msg || 'Error');
        }
      } catch {
        setError('Server error');
      }
    }
  };

  // Add subject session to selected class/sem
  const handleAddSubject = async () => {
    setError('');
    if (selectedClassId && subjectForm.subject) {
      try {
  const res = await fetch(`${API_BASE}/api/notes/subject`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify({ noteId: selectedClassId, subject: subjectForm.subject })
        });
        const data = await res.json();
        if (res.ok) {
          setNotes(notes.map(n => n._id === data._id ? data : n));
          setSubjectForm({ subject: '' });
        } else {
          setError(data.msg || 'Error');
        }
      } catch {
        setError('Server error');
      }
    }
  };

  // Add note to selected subject
  const handleAddNote = async () => {
    setError('');
    if (selectedClassId && selectedSubject && noteForm.note) {
      try {
  const res = await fetch(`${API_BASE}/api/notes/note`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          },
          body: JSON.stringify({ noteId: selectedClassId, subject: selectedSubject, note: noteForm.note })
        });
        const data = await res.json();
        if (res.ok) {
          setNotes(notes.map(n => n._id === data._id ? data : n));
          setNoteForm({ note: '' });
        } else {
          setError(data.msg || 'Error');
        }
      } catch {
        setError('Server error');
      }
    }
  };

  // Add PDF to selected subject
  const handleAddPdf = async () => {
    setError('');
    if (selectedClassId && selectedSubject && pdf) {
      const formData = new FormData();
      formData.append('noteId', selectedClassId);
      formData.append('subject', selectedSubject);
      formData.append('note', noteForm.note);
      formData.append('pdf', pdf);
      try {
  const res = await fetch(`${API_BASE}/api/notes/pdf`, {
          method: 'POST',
          headers: {
            'x-auth-token': token
          },
          body: formData
        });
        const data = await res.json();
        if (res.ok) {
          setNotes(notes.map(n => n._id === data._id ? data : n));
          setNoteForm({ note: '' });
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
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="max-w-5xl mx-auto">
      <h2 className="text-4xl font-extrabold text-purple-800 mb-8 text-center tracking-tight">Notes Organizer</h2>
      <div className="flex gap-8">
        {/* Sidebar: Classes/Sems */}
        <div className="w-64 bg-white rounded-2xl shadow-lg p-4 flex flex-col">
          <h3 className="text-xl font-bold text-purple-700 mb-4">Classes/Sems</h3>
          <div className="mb-4">
            <input name="classOrSem" value={classForm.classOrSem} onChange={e => setClassForm({ classOrSem: e.target.value })} placeholder="Add new class/sem" className="border-2 border-purple-300 rounded-lg px-3 py-2 w-full mb-2" />
            <button onClick={async () => {
              setError('');
              if (classForm.classOrSem) {
                try {
                  const res = await fetch(`${API_BASE}/api/notes/class`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'x-auth-token': token
                    },
                    body: JSON.stringify(classForm)
                  });
                  const data = await res.json();
                  if (res.ok) {
                    setNotes([...notes, data]);
                    setClassForm({ classOrSem: '' });
                  } else {
                    setError(data.msg || 'Error');
                  }
                } catch {
                  setError('Server error');
                }
              }
            }} className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-purple-600 hover:to-blue-600 transition w-full">Add</button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {notes.length === 0 ? (
              <p className="text-gray-400">No classes/sems yet.</p>
            ) : (
              <ul>
                {notes.map(n => (
                  <li key={n._id} className={`mb-2 p-2 rounded-lg cursor-pointer transition ${selectedClassId === n._id ? 'bg-purple-100 font-bold' : 'hover:bg-purple-50'}`} onClick={() => { setSelectedClassId(n._id); setSelectedSubject(null); }}>
                    {n.classOrSem}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {/* Main Content: Subjects and Notes */}
        <div className="flex-1 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-lg p-8">
          {selectedClassId ? (
            notes.filter(n => n._id === selectedClassId).map(n => (
              <div key={n._id}>
                <h3 className="text-2xl font-bold text-purple-700 mb-4">{n.classOrSem}</h3>
                {/* Subjects Dropdown and Add Button */}
                <div className="mb-6 flex gap-2 items-center">
                  <select
                    value={selectedSubject || ''}
                    onChange={e => setSelectedSubject(e.target.value)}
                    className="border-2 border-blue-300 rounded px-2 py-1 w-32 text-sm"
                  >
                    <option value="">Select Subject</option>
                    {n.subjects.map((s, idx) => (
                      <option key={idx} value={s.subject}>{s.subject}</option>
                    ))}
                  </select>
                  <input
                    name="subject"
                    value={subjectForm.subject}
                    onChange={e => setSubjectForm({ subject: e.target.value })}
                    placeholder="Add new subject"
                    className="border-2 border-blue-300 rounded px-2 py-1 w-28 text-sm"
                  />
                  <button
                    onClick={async () => {
                      setError("");
                      if (selectedClassId && subjectForm.subject) {
                        try {
                          const res = await fetch(`${API_BASE}/api/notes/subject`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'x-auth-token': token
                            },
                            body: JSON.stringify({ noteId: selectedClassId, subject: subjectForm.subject })
                          });
                          const data = await res.json();
                          if (res.ok) {
                            setNotes(notes.map(n => n._id === data._id ? data : n));
                            setSubjectForm({ subject: '' });
                            // Only set selectedSubject if it exists in the updated subjects array
                            const updatedClass = data;
                            if (updatedClass.subjects.some(s => s.subject === subjectForm.subject)) {
                              setSelectedSubject(subjectForm.subject);
                            } else {
                              setSelectedSubject(null);
                            }
                          } else {
                            setError(data.msg || 'Error');
                          }
                        } catch {
                          setError('Server error');
                        }
                      }
                    }}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition text-xs"
                  >
                    Add Subject
                  </button>
                </div>
                {/* Notes/PDFs for selected subject */}
                {selectedSubject ? (
                  n.subjects.filter(s => s.subject === selectedSubject).map((s, j) => (
                    <div key={j} className="mb-4">
                      <h4 className="text-lg font-semibold text-blue-700 mb-2">{s.subject}</h4>
                      {/* Add note/pdf */}
                      <div className="flex gap-3 mb-4 flex-wrap items-center">
                        <input name="note" value={noteForm.note} onChange={e => setNoteForm({ note: e.target.value })} placeholder="Note" className="border-2 border-blue-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-40 text-sm" />
                        <button onClick={handleAddNote} className="bg-blue-500 text-white px-3 py-1 rounded font-semibold shadow hover:bg-blue-600 transition text-xs">Add Text Note</button>
                        <input type="file" accept="application/pdf" ref={fileInputRef} onChange={e => setPdf(e.target.files[0])} className="border-2 border-blue-300 rounded-lg px-2 py-1 w-40 text-sm" />
                        <button onClick={handleAddPdf} className="bg-purple-500 text-white px-3 py-1 rounded font-semibold shadow hover:bg-purple-600 transition text-xs">Add PDF Note</button>
                      </div>
                      {/* List notes/pdfs */}
                      {s.notes.length === 0 ? (
                        <p className="text-gray-400 ml-2">No notes yet.</p>
                      ) : (
                        <ul className="ml-2 space-y-2">
                          {s.notes.map((noteObj, k) => (
                            <li key={k} className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-3 shadow flex items-center justify-between relative">
                              <button
                                className="mr-3 text-gray-400 hover:text-gray-600 text-xs"
                                title="Delete"
                                onClick={() => handleDeleteNote(n._id, s.subject, k)}
                              >&#10005;</button>
                              {noteObj.pdfUrl ? (
                                <a
                                  href={noteObj.pdfUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-4 text-blue-600 underline font-semibold"
                                >
                                  {noteObj.pdfUrl.split('/').pop()}
                                </a>
                              ) : (
                                <span className="text-gray-800 font-medium">{noteObj.note}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 ml-2">Select a subject to view/add notes.</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">Select a class/sem to view subjects and notes.</p>
          )}
          {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
        </div>
      </div>
  </motion.div>
  );
}
