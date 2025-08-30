import React from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col items-center justify-center h-full">
      <h2 className="text-4xl font-bold text-purple-700 mb-4">Welcome to Remin</h2>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-xl">
        Manage your college life with ease! Add your timetable, exams, notes, reminders, and daily schedule. Stay organized, track your progress, and never miss a deadline.
      </p>
      <img src="/vite.svg" alt="Remin Logo" className="w-32 h-32 animate-bounce" />
    </motion.div>
  );
}
