import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserCircle, FaRegCalendarAlt, FaCalculator, FaVolumeUp, FaMicrophone, FaGlobe, FaMoneyBillWave } from 'react-icons/fa';

export default function Home({
  setShowTypingTest,
  setShowCalculator,
  setShowTTS,
  setShowSTT,
  setShowTranslator,
  setShowCurrency,
  setShowImageSearch,
  setShowDictionary
}) {
  const [calendarMonth, setCalendarMonth] = useState(8);
  const [calendarYear, setCalendarYear] = useState(2025);
  return (
    <>
  <motion.div initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1, y: -30 }} transition={{ duration: 0.6 }} className="flex flex-col items-center h-full pt-12 md:ml-64 ml-0 px-4">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-center w-full">
          
          <div className="flex flex-col items-center md:items-start justify-center md:mr-32 mb-8 md:mb-0 w-full md:w-auto">
            
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
              className="inline-block"
            >
              <FaUserCircle className="text-7xl text-black-600 mb-4 ml-0 md:ml-10 mt-7" />
            </motion.div>
            <h2 className="text-4xl font-bold text-red-600 mb-4 text-center md:text-left ml-0 md:ml-8 mt-3">Welcome to Remin!</h2>
            <p className="text-lg text-gray-600 mb-8 pl-0  md:pl-8 text-center md:text-left max-w-xl">
              Manage your college life with ease! Add your timetable, exams, notes, reminders, and daily schedule. Stay organized, track your progress, and never miss a deadline.
            </p>
          </div>
          
          <div className="flex flex-col items-center p-4 rounded-xl shadow-lg bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 w-full max-w-xs" style={{ minWidth: '260px' }}>
            <div className="flex justify-between items-center w-full mb-4">
              <button className="px-2 py-1 rounded bg-purple-200 text-purple-700 font-bold hover:bg-purple-300 transition text-sm" onClick={() => {
                if (calendarMonth === 0) {
                  setCalendarMonth(11);
                  setCalendarYear(calendarYear - 1);
                } else {
                  setCalendarMonth(calendarMonth - 1);
                }
              }}>&#8592;</button>
              <span className="text-lg font-bold text-purple-700">{new Date(calendarYear, calendarMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
              <button className="px-2 py-1 rounded bg-purple-200 text-purple-700 font-bold hover:bg-purple-300 transition text-sm" onClick={() => {
                if (calendarMonth === 11) {
                  setCalendarMonth(0);
                  setCalendarYear(calendarYear + 1);
                } else {
                  setCalendarMonth(calendarMonth + 1);
                }
              }}>&#8594;</button>
            </div>
            <div className="grid grid-cols-7 gap-1 w-full">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => (
                <span key={day} className="text-xs font-semibold text-purple-600 text-center">{day}</span>
              ))}
              
              {Array.from({ length: new Date(calendarYear, calendarMonth, 1).getDay() }, (_, i) => <span key={'empty'+i}></span>)}
              {/* Days in month */}
              {Array.from({ length: new Date(calendarYear, calendarMonth + 1, 0).getDate() }, (_, i) => {
                const today = new Date();
                const isToday = today.getFullYear() === calendarYear && today.getMonth() === calendarMonth && today.getDate() === i+1;
                return (
                  <button
                    key={i+1}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-gray-700 hover:bg-purple-200 focus:bg-purple-400 focus:text-white transition ${isToday ? 'bg-purple-500 text-white font-bold border-2 border-purple-700' : ''}`}
                  >
                    {i+1}
                  </button>
                );
              })}
            </div>
            <span className="mt-2 text-sm text-purple-700 font-semibold">Today: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Tools for Students Section with improved UI */}
        <div className="w-full flex flex-col items-center mt-15">
          <h3 className="text-3xl font-extrabold mb-2 mt-8 text-purple-700 bg-clip-text  drop-shadow-lg tracking-wide text-center">Tools for Students</h3>
          <div className="w-40 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-400 rounded-full mx-auto mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-center w-full max-w-5xl mx-auto">
            {/* Typing Test Card */}
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-lg p-4 flex flex-col items-center w-full max-w-xs hover:scale-105 transition-transform cursor-pointer border border-blue-200">
              <button
                className="flex flex-col items-center justify-center"
                onClick={() => setShowTypingTest(true)}
                title="Typing Test"
              >
                <div className="bg-cyan-200 rounded-full p-4 mb-3 flex items-center justify-center shadow">
                  <span className="text-4xl text-cyan-700">⌨️</span>
                </div>
                <span className="text-lg font-bold text-cyan-700">Typing Test</span>
                <span className="text-xs text-gray-500 mt-1">Test your typing speed</span>
              </button>
            </div>

            {/* Image Generator Card */}
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-lg p-4 flex flex-col items-center w-full max-w-xs hover:scale-105 transition-transform cursor-pointer border border-blue-200">
              <button
                className="flex flex-col items-center justify-center"
                onClick={() => setShowImageSearch(true)}
                title="Image Generator"
              >
                <div className="bg-purple-200 rounded-full p-4 mb-3 flex items-center justify-center shadow">
                  <span className="text-4xl text-blue-700">🖼️</span>
                </div>
                <span className="text-lg font-bold text-blue-700">Image Generator</span>
                <span className="text-xs text-gray-500 mt-1">Search Unsplash images</span>
              </button>
            </div>
            {/* Dictionary Card */}
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-lg p-4 flex flex-col items-center w-full max-w-xs hover:scale-105 transition-transform cursor-pointer border border-blue-200">
              <button
                className="flex flex-col items-center justify-center"
                onClick={() => setShowDictionary(true)}
                title="Dictionary"
              >
                <div className="bg-blue-200 rounded-full p-4 mb-3 flex items-center justify-center shadow">
                  <span className="text-4xl text-purple-700">📖</span>
                </div>
                <span className="text-lg font-bold text-purple-700">Dictionary</span>
                <span className="text-xs text-gray-500 mt-1">Find word meanings</span>
              </button>
            </div>


            {/* Currency Converter Card */}
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-lg p-4 flex flex-col items-center w-full max-w-xs hover:scale-105 transition-transform cursor-pointer border border-blue-200">
              <button
                className="flex flex-col items-center justify-center"
                onClick={() => setShowCurrency(true)}
                title="Currency Converter"
              >
                <div className="bg-purple-200 rounded-full p-4 mb-3 flex items-center justify-center shadow">
                  <FaMoneyBillWave className="text-4xl text-green-600" />
                </div>
                <span className="text-lg font-bold text-green-700">Currency Converter</span>
                <span className="text-xs text-gray-500 mt-1">Convert currencies</span>
              </button>
            </div>

            {/* Calculator Card */}
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-lg p-4 flex flex-col items-center w-full max-w-xs hover:scale-105 transition-transform cursor-pointer border border-blue-200">
              <button
                className="flex flex-col items-center justify-center"
                onClick={() => setShowCalculator(true)}
                title="Calculator"
              >
                <div className="bg-purple-200 rounded-full p-4 mb-3 flex items-center justify-center shadow">
                  <FaCalculator className="text-4xl text-purple-700" />
                </div>
                <span className="text-lg font-bold text-purple-700">Calculator</span>
                <span className="text-xs text-gray-500 mt-1">Quick math operations</span>
              </button>
            </div>
            {/* Text-to-Speech Card */}
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-lg p-4 flex flex-col items-center w-full max-w-xs hover:scale-105 transition-transform cursor-pointer border border-blue-200">
              <button
                className="flex flex-col items-center justify-center"
                onClick={() => setShowTTS(true)}
                title="Text to Speech"
              >
                <div className="bg-purple-200 rounded-full p-4 mb-3 flex items-center justify-center shadow">
                  <FaVolumeUp className="text-4xl text-blue-700" />
                </div>
                <span className="text-lg font-bold text-blue-700">Text to Speech</span>
                <span className="text-xs text-gray-500 mt-1">Convert text to audio</span>
              </button>
            </div>
            {/* Speech-to-Text Card */}
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-lg p-4 flex flex-col items-center w-full max-w-xs hover:scale-105 transition-transform cursor-pointer border border-blue-200">
              <button
                className="flex flex-col items-center justify-center"
                onClick={() => setShowSTT(true)}
                title="Speech to Text"
              >
                <div className="bg-blue-200 rounded-full p-4 mb-3 flex items-center justify-center shadow">
                  <FaMicrophone className="text-4xl text-blue-700" />
                </div>
                <span className="text-lg font-bold text-blue-700">Speech to Text</span>
                <span className="text-xs text-gray-500 mt-1">Convert speech to text</span>
              </button>
            </div>
            {/* Language Translator Card */}
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-lg p-4 flex flex-col items-center w-full max-w-xs hover:scale-105 transition-transform cursor-pointer border border-blue-200">
              <button
                className="flex flex-col items-center justify-center"
                onClick={() => setShowTranslator(true)}
                title="Language Translator"
              >
                <div className="bg-blue-200 rounded-full p-4 mb-3 flex items-center justify-center shadow">
                  <FaGlobe className="text-4xl text-purple-700" />
                </div>
                <span className="text-lg font-bold text-purple-700">Language Translator</span>
                <span className="text-xs text-gray-500 mt-1">Translate text between languages</span>
              </button>
            </div>

          </div>
        </div>
      </motion.div>


      

    </>
  );
}


