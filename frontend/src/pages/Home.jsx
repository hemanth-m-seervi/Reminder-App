import React from 'react';
import { motion } from 'framer-motion';
import { FaUserCircle, FaRegCalendarAlt } from 'react-icons/fa';

export default function Home() {
  return (
    <motion.div initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1, y: -30 }} transition={{ duration: 0.6 }} className="flex flex-row items-start justify-center h-full pt-12">
      {/* Welcome message and logo on the left */}
      <div className="flex flex-col items-start justify-center mr-32">
        <FaUserCircle className="text-7xl text-purple-400 mb-4 ml-15 mt-25" />
        <h2 className="text-4xl font-bold text-purple-700 mb-4 text-left ml-15 mt-3">Welcome to Remin!</h2>
        <p className="text-lg text-gray-600 mb-8 pl-15 text-left max-w-xl">
          Manage your college life with ease! Add your timetable, exams, notes, reminders, and daily schedule. Stay organized, track your progress, and never miss a deadline.
        </p>
      </div>
      {/* Calendar on the right */}
      <div className="flex flex-col items-center p-6 rounded-xl shadow-lg bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 w-fit ml-32">
        <div className="flex justify-between items-center w-full mb-4">
          <button className="px-3 py-1 rounded bg-purple-200 text-purple-700 font-bold hover:bg-purple-300 transition">&#8592;</button>
          <span className="text-xl font-bold text-purple-700">September 2025</span>
          <button className="px-3 py-1 rounded bg-purple-200 text-purple-700 font-bold hover:bg-purple-300 transition">&#8594;</button>
        </div>
        <div className="grid grid-cols-7 gap-2 w-full">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => (
            <span key={day} className="text-xs font-semibold text-purple-600 text-center">{day}</span>
          ))}
          {/* Example days for September 2025 (1st is Monday) */}
          {Array.from({ length: 6 }, (_, i) => <span key={'empty'+i}></span>)}
          {Array.from({ length: 30 }, (_, i) => {
            const today = new Date();
            const isToday = today.getFullYear() === 2025 && today.getMonth() === 8 && today.getDate() === i+1;
            return (
              <button
                key={i+1}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 hover:bg-purple-200 focus:bg-purple-400 focus:text-white transition ${isToday ? 'bg-purple-500 text-white font-bold border-2 border-purple-700' : ''}`}
              >
                {i+1}
              </button>
            );
          })}
        </div>
        <span className="mt-4 text-base text-purple-700 font-semibold">Today: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
      </div>
    </motion.div>
  );
}
