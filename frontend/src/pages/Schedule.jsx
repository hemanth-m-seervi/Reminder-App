import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Additional imports if necessary
export default function Schedule({ token }) {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ time: '', task: '', date: '' });
  const [error, setError] = useState('');

  // Real-time tracking: Remove tasks whose time has passed every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(tasks => tasks.filter(task => {
        const taskDate = new Date(`${task.date}T${task.time}`);
        return taskDate >= new Date();
      }));
    }, 60000); // check every minute
    return () => clearInterval(interval);
  }, []);

  // Sort schedule by date and time (nearest first)
  const sortedSchedule = [...tasks].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA - dateB;
  });

  // Find the nearest (upcoming) schedule
  const now = new Date();
  const upcoming = sortedSchedule.find(item => {
    const itemDate = new Date(`${item.date}T${item.time}`);
    return itemDate >= now;
  });
  const restSchedule = upcoming
    ? sortedSchedule.filter(item => item !== upcoming)
    : sortedSchedule;

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
  // Ensure form validation
  if (form.time && form.task && form.date) {
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
    // Sort schedule by date and time (nearest first)
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
        <div className="w-full flex flex-row gap-3 items-center mb-2">
          <input name="task" value={form.task} onChange={handleChange} placeholder="What to do" className="input rounded-lg border-2 border-purple-200 px-4 py-2 flex-1" />
          <input name="time" value={form.time} onChange={handleChange} placeholder="Time" className="input rounded-lg border-2 border-purple-200 px-4 py-2 flex-1" type="time" />
          <input name="date" value={form.date} onChange={handleChange} placeholder="Date" className="input rounded-lg border-2 border-purple-200 px-4 py-2 flex-1" type="date" />
        </div>
        <div className="w-full flex justify-end mb-4">
          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-purple-800 transition-all duration-200 focus:outline-none flex-shrink-0"
            style={{ minWidth: '100px' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Add
          </button>
        </div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <ul className="space-y-2">
          {[...tasks]
            .sort((a, b) => {
              // Sort by date descending, then time descending
            // Find the nearest (upcoming) schedule
            const now = new Date();
            const upcoming = sortedSchedule.find(item => {
              const itemDate = new Date(`${item.date}T${item.time}`);
              return itemDate >= now;
            });

              const dateA = new Date(a.date + 'T' + (a.time || '00:00'));
              const dateB = new Date(b.date + 'T' + (b.time || '00:00'));
              return dateB - dateA;
            })
            .map((task, idx) => {
               let dateStr = '';
               let timeStr = '';
               if (task.date && task.time) {
                 const d = new Date(`${task.date}T${task.time}`);
                 dateStr = d.toLocaleDateString('en-GB', {
                   day: '2-digit',
                   month: 'long',
                   year: 'numeric',
                 });
                 timeStr = d.toLocaleTimeString([], {
                   hour: '2-digit',
                   minute: '2-digit',
                 });
               }
               return (
                 <li key={idx} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 shadow flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch(`/api/schedule/${task._id}`, {
                            method: 'DELETE',
                            headers: { 'x-auth-token': token }
                          });
                          if (res.ok) {
                            setTasks(tasks => tasks.filter((t) => t._id !== task._id));
                          }
                        } catch {}
                      }}
                      className="mr-2 p-0 rounded-full text-gray-400 text-xs font-bold hover:text-red-500 transition flex items-center justify-center"
                      title="Delete schedule item"
                      style={{ width: '18px', height: '18px', background: 'transparent', border: 'none', lineHeight: '0' }}
                    >
                      &#10005;
                    </button>
                    <span className="text-lg font-bold text-purple-700">{dateStr}</span>
                    <span className="text-md text-blue-700 font-semibold">{timeStr}</span>
                  </div>
                  <span className="text-gray-700 mt-2 md:mt-0">{task.task}</span>
                </li>
               );
            })}
                  {/* Nearest deadline banner */}
                  {upcoming && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 rounded-lg p-3 mb-4 shadow">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                        <span className="font-semibold text-lg mb-1 md:mb-0">Upcoming: {upcoming.task}</span>
                        <span className="text-sm text-gray-700">
                          {(() => {
                            const dateObj = new Date(`${upcoming.date}T${upcoming.time}`);
                            const formattedDate = dateObj.toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            });
                            const formattedTime = dateObj.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            });
                            return `${formattedDate} | ${formattedTime}`;
                          })()}
                        </span>
                      </div>
                    </div>
                  )}
        </ul>
      </div>
    </motion.div>
  );
}
