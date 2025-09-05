import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
// No Topbar import needed
import Home from './pages/Home';
import Timetable from './pages/Timetable';
import Exams from './pages/Exams';
import Notes from './pages/Notes';
import Reminders from './pages/Reminders';
import Schedule from './pages/Schedule';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import MarksEntry from './pages/MarksEntry';
import { FaBars } from 'react-icons/fa';
import TypingTest from './components/TypingTest';
import ImageSearch from './components/ImageSearch';
import Dictionary from './components/Dictionary';
import CurrencyConverter from './components/CurrencyConverter';
import TextToSpeech from './components/TextToSpeech';
import SpeechToText from './components/SpeechToText';
import LanguageTranslator from './components/LanguageTranslator';
import { FaCalculator } from 'react-icons/fa';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showTypingTest, setShowTypingTest] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showTTS, setShowTTS] = useState(false);
  const [showSTT, setShowSTT] = useState(false);
  const [showTranslator, setShowTranslator] = useState(false);
  const [showCurrency, setShowCurrency] = useState(false);
  const [showImageSearch, setShowImageSearch] = useState(false);
  const [showDictionary, setShowDictionary] = useState(false);
  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);
  useEffect(() => {
    const anyModalOpen = showTypingTest || showCalculator || showTTS || showSTT || showTranslator || showCurrency || showImageSearch || showDictionary;
    document.body.style.overflow = anyModalOpen ? 'hidden' : 'auto';
  }, [showTypingTest, showCalculator, showTTS, showSTT, showTranslator, showCurrency, showImageSearch, showDictionary]);
  const handleLogout = () => {
    setToken(null);
    window.location.href = '/auth';
  };

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
  return (
    <Router>
      <div className="flex min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
        {token && <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />}
        {token && isSidebarOpen && (
          <div
            className="fixed inset-0 backdrop-blur-sm z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
  {token && !isSidebarOpen && (
    <button
      onClick={() => setIsSidebarOpen(true)}
      className="absolute top-4 left-4 z-50 md:hidden"
    >
      <FaBars className="text-purple-700 text-2xl" />
    </button>
  )}
  {token && (
    <button
      onClick={handleLogout}
      className="absolute top-4 right-6 z-50 px-4 py-2 rounded-lg bg-purple-100 text-purple-700 font-semibold border border-purple-300 hover:bg-purple-200 transition text-sm shadow"
    >
      Logout
    </button>
  )}
  <div className={`flex-1 p-4 md:p-6 mt-14 ${isSidebarOpen ? 'md:ml-64' : ''} transition-all duration-300 overflow-x-hidden`}>
          <Routes>
            <Route path="/auth" element={<Auth setToken={setToken} />} />
            <Route path="/" element={
              <ProtectedRoute token={token}>
                <Home
                  setShowTypingTest={setShowTypingTest}
                  setShowCalculator={setShowCalculator}
                  setShowTTS={setShowTTS}
                  setShowSTT={setShowSTT}
                  setShowTranslator={setShowTranslator}
                  setShowCurrency={setShowCurrency}
                  setShowImageSearch={setShowImageSearch}
                  setShowDictionary={setShowDictionary}
                />
              </ProtectedRoute>
            } />
            <Route path="/timetable" element={
              <ProtectedRoute token={token}>
                <Timetable token={token} />
              </ProtectedRoute>
            } />
            <Route path="/exams" element={
              <ProtectedRoute token={token}>
                <Exams token={token} />
              </ProtectedRoute>
            } />
            <Route path="/marks-entry" element={
              <ProtectedRoute token={token}>
                <MarksEntry token={token} />
              </ProtectedRoute>
            } />
            <Route path="/notes" element={
              <ProtectedRoute token={token}>
                <Notes token={token} />
              </ProtectedRoute>
            } />
            <Route path="/reminders" element={
              <ProtectedRoute token={token}>
                <Reminders token={token} />
              </ProtectedRoute>
            } />
            <Route path="/schedule" element={
              <ProtectedRoute token={token}>
                <Schedule token={token} />
              </ProtectedRoute>
            } />
          </Routes>
        </div>

        {/* Modals */}
        {/* Typing Test Modal */}
        {showTypingTest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.15)'}}>
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-xs sm:max-w-2xl relative flex flex-col max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center w-full mb-4">
                <h4 className="text-lg font-bold text-cyan-700">Typing Test</h4>
                <button className="text-gray-400 hover:text-gray-700 text-xl" onClick={() => setShowTypingTest(false)}>&#10005;</button>
              </div>
              <TypingTest />
            </div>
          </div>
        )}
        {/* Image Generator Modal */}
        {showImageSearch && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.15)'}}>
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-xs sm:max-w-4xl relative flex flex-col max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center w-full mb-4">
                <h4 className="text-lg font-bold text-yellow-700">Image Generator</h4>
                <button className="text-gray-400 hover:text-gray-700 text-xl" onClick={() => setShowImageSearch(false)}>&#10005;</button>
              </div>
              <ImageSearch />
            </div>
          </div>
        )}
        {/* Dictionary Modal */}
        {showDictionary && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.15)'}}>
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-xs sm:max-w-md relative flex flex-col items-center justify-center max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center w-full mb-4">
                <h4 className="text-lg font-bold text-purple-700">Dictionary</h4>
                <button className="text-gray-400 hover:text-gray-700 text-xl" onClick={() => setShowDictionary(false)}>&#10005;</button>
              </div>
              <Dictionary />
            </div>
          </div>
        )}
        {/* Currency Converter Modal */}
        {showCurrency && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.15)'}}>
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-xs sm:max-w-md relative flex flex-col items-center justify-center max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center w-full mb-4">
                <h4 className="text-lg font-bold text-green-700">Currency Converter</h4>
                <button className="text-gray-400 hover:text-gray-700 text-xl" onClick={() => setShowCurrency(false)}>&#10005;</button>
              </div>
              <CurrencyConverter />
            </div>
          </div>
        )}
        {/* Calculator Modal */}
        {showCalculator && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.15)'}}>
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-xs sm:max-w-80 relative flex flex-col items-center justify-center max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center w-full mb-4">
                <h4 className="text-lg font-bold text-purple-700">Calculator</h4>
                <button className="text-gray-400 hover:text-gray-700 text-xl" onClick={() => setShowCalculator(false)}>&#10005;</button>
              </div>
              <Calculator />
            </div>
          </div>
        )}
        {/* Text-to-Speech Modal */}
        {showTTS && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.15)'}}>
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl relative flex flex-col items-center justify-center max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center w-full mb-4">
                <h4 className="text-lg font-bold text-pink-700">Text to Speech</h4>
                <button className="text-gray-400 hover:text-gray-700 text-xl" onClick={() => setShowTTS(false)}>&#10005;</button>
              </div>
              <TextToSpeech />
            </div>
          </div>
        )}
        {/* Speech-to-Text Modal */}
        {showSTT && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.15)'}}>
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-xs sm:max-w-2xl relative flex flex-col items-center justify-center max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center w-full mb-4">
                <h4 className="text-lg font-bold text-blue-700">Speech to Text</h4>
                <button className="text-gray-400 hover:text-gray-700 text-xl" onClick={() => setShowSTT(false)}>&#10005;</button>
              </div>
              <SpeechToText />
            </div>
          </div>
        )}
        {/* Language Translator Modal */}
        {showTranslator && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.15)'}}>
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-xs sm:max-w-2xl relative flex flex-col items-center justify-center max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center w-full mb-4">
                <h4 className="text-lg font-bold text-purple-700">Language Translator</h4>
                <button className="text-gray-400 hover:text-gray-700 text-xl" onClick={() => setShowTranslator(false)}>&#10005;</button>
              </div>
              <LanguageTranslator />
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
