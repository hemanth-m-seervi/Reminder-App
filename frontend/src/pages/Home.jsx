import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserCircle, FaRegCalendarAlt, FaCalculator, FaVolumeUp, FaMicrophone, FaGlobe, FaMoneyBillWave } from 'react-icons/fa';
import TextToSpeech from '../components/TextToSpeech';
import SpeechToText from '../components/SpeechToText';
import LanguageTranslator from '../components/LanguageTranslator';
import CurrencyConverter from '../components/CurrencyConverter';

export default function Home() {
  const [showCalculator, setShowCalculator] = useState(false);
  const [showTTS, setShowTTS] = useState(false);
  const [showSTT, setShowSTT] = useState(false);
  const [showTranslator, setShowTranslator] = useState(false);
  const [showCurrency, setShowCurrency] = useState(false);
  return (
    <>
  <motion.div initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1, y: -30 }} transition={{ duration: 0.6 }} className="flex flex-col items-center h-full pt-12 ml-64">
        <div className="flex flex-row items-start justify-center w-full">
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
        </div>

        {/* Tools for Students Section with improved UI */}
        <div className="w-full flex flex-col items-center mt-12">
          <h3 className="text-3xl font-extrabold mb-6 mt-5 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-400 bg-clip-text text-transparent drop-shadow-lg tracking-wide">Tools for Students</h3>
          <div className="flex flex-wrap gap-8 justify-center">
            {/* Currency Converter Card */}
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-lg p-6 flex flex-col items-center w-48 hover:scale-105 transition-transform cursor-pointer border border-blue-200">
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
      {/* Currency Converter Modal */}
      {showCurrency && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent" style={{backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.15)'}}>
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onClick={() => setShowCurrency(false)}>&#10005;</button>
            <h4 className="text-lg font-bold text-green-700 mb-4 text-center">Currency Converter</h4>
            <CurrencyConverter />
          </div>
        </div>
      )}
            {/* Calculator Card */}
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl shadow-lg p-6 flex flex-col items-center w-48 hover:scale-105 transition-transform cursor-pointer border border-purple-200">
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
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl shadow-lg p-6 flex flex-col items-center w-48 hover:scale-105 transition-transform cursor-pointer border border-pink-200">
              <button
                className="flex flex-col items-center justify-center"
                onClick={() => setShowTTS(true)}
                title="Text to Speech"
              >
                <div className="bg-purple-200 rounded-full p-4 mb-3 flex items-center justify-center shadow">
                  <FaVolumeUp className="text-4xl text-purple-700" />
                </div>
                <span className="text-lg font-bold text-pink-700">Text to Speech</span>
                <span className="text-xs text-gray-500 mt-1">Convert text to audio</span>
              </button>
            </div>
            {/* Speech-to-Text Card */}
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-lg p-6 flex flex-col items-center w-48 hover:scale-105 transition-transform cursor-pointer border border-blue-200">
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
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl shadow-lg p-6 flex flex-col items-center w-48 hover:scale-105 transition-transform cursor-pointer border border-purple-200">
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
      {/* Language Translator Modal */}
      {showTranslator && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent" style={{backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.15)'}}>
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onClick={() => setShowTranslator(false)}>&#10005;</button>
            <h4 className="text-lg font-bold text-purple-700 mb-4 text-center">Language Translator</h4>
            <LanguageTranslator />
          </div>
        </div>
      )}
          </div>
        </div>
      </motion.div>

      {/* Calculator Modal */}
      {showCalculator && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent" style={{backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.15)'}}>
          <div className="bg-white rounded-xl shadow-lg p-8 w-80 relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onClick={() => setShowCalculator(false)}>&#10005;</button>
            <h4 className="text-lg font-bold text-purple-700 mb-4 text-center">Calculator</h4>
            <Calculator />
          </div>
        </div>
      )}
      {/* Text-to-Speech Modal */}
      {showTTS && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent" style={{backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.15)'}}>
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onClick={() => setShowTTS(false)}>&#10005;</button>
            <h4 className="text-lg font-bold text-pink-700 mb-4 text-center">Text to Speech</h4>
            <TextToSpeech />
          </div>
        </div>
      )}
      {/* Speech-to-Text Modal */}
      {showSTT && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent" style={{backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.15)'}}>
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl" onClick={() => setShowSTT(false)}>&#10005;</button>
            <h4 className="text-lg font-bold text-blue-700 mb-4 text-center">Speech to Text</h4>
            <SpeechToText />
          </div>
        </div>
      )}
    </>
  );
}

function Calculator() {
  const [input, setInput] = useState('');
  const handleClick = val => setInput(input + val);
  const handleClear = () => setInput('');
  const handleEqual = () => {
    try {
      setInput(eval(input).toString());
    } catch {
      setInput('Error');
    }
  };
  return (
    <div className="flex flex-col items-center">
      <input
        type="text"
        value={input}
        readOnly
        className="mb-4 p-2 border rounded w-full text-lg text-center bg-purple-50"
      />
      <div className="grid grid-cols-4 gap-2 mb-2">
        {["7","8","9","/","4","5","6","*","1","2","3","-","0",".","=","+"]
          .map((val, idx) => (
            val === "="
              ? <button key={idx} className="w-12 h-12 rounded-full bg-purple-500 text-white font-bold shadow-md border border-purple-300 hover:bg-purple-700 transition duration-150" onClick={handleEqual}>=</button>
              : <button key={idx} className="w-12 h-12 rounded-full bg-white text-purple-700 font-bold shadow-md border border-purple-200 hover:bg-purple-200 hover:text-purple-900 transition duration-150" onClick={() => handleClick(val)}>{val}</button>
          ))}
      </div>
      <button className="mt-2 px-4 py-1 rounded bg-red-400 text-white font-semibold" onClick={handleClear}>Clear</button>
    </div>
  );
}
