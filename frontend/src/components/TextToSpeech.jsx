import React, { useRef, useEffect, useState } from "react";
// import playIcon from "./images/play.png";
// import dropdownIcon from "../../texttospeech/images/dropdown.png";
// Removed custom CSS, now using Tailwind

export default function TextToSpeech() {
  const textareaRef = useRef();
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(0);

  useEffect(() => {
    if (!window.speechSynthesis) return;
    const updateVoices = () => {
      const voicesList = window.speechSynthesis.getVoices();
      setVoices(voicesList);
    };
    window.speechSynthesis.onvoiceschanged = updateVoices;
    updateVoices();
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const handlePlay = () => {
    if (!window.speechSynthesis || !textareaRef.current) return;
    const text = textareaRef.current.value;
    if (!text.trim()) return;
    const utterance = new window.SpeechSynthesisUtterance(text);
    if (voices.length > 0) {
      utterance.voice = voices[selectedVoice];
      utterance.lang = voices[selectedVoice].lang;
    }
    window.speechSynthesis.cancel(); // Stop any current speech
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceChange = (e) => {
    setSelectedVoice(Number(e.target.value));
  };

  return (
  <div className="w-full min-h-[60vh] bg-gradient-to-br from-purple-600 via-blue-100 to-purple-100 flex flex-col items-center justify-center rounded-2xl shadow-lg p-8 text-gray-900 border-2 border-purple-200">
      <h1 className="text-3xl font-extrabold mb-6 mt-2 text-purple-800 tracking-tight drop-shadow">
        Text To Speech <span className="text-pink-500">Converter</span>
      </h1>
      <textarea
        ref={textareaRef}
        placeholder="Write anything here...."
        className="w-full max-w-xl h-36 bg-purple-100 text-purple-900 text-base border-2 border-purple-300 outline-none p-5 rounded-xl mb-5 placeholder:text-purple-400 shadow focus:border-purple-500 transition duration-150"
      />
      <div className="w-full max-w-xl flex flex-col sm:flex-row items-center gap-4">
        <select
          onChange={handleVoiceChange}
          value={selectedVoice}
          className="flex-1 text-purple-900 bg-purple-50 h-12 px-5 outline-none border-2 border-purple-300 rounded-full appearance-none shadow focus:border-purple-500 transition duration-150"
        >
          {voices.map((voice, i) => (
            <option key={voice.name} value={i}>{voice.name} ({voice.lang})</option>
          ))}
        </select>
        <button
          className="bg-gradient-to-r from-purple-400 via-purple-500 to-blue-300 hover:from-purple-500 hover:to-blue-400 text-white text-base px-4 py-1 rounded-full flex items-center font-semibold shadow transition-colors duration-150 border border-purple-300 drop-shadow"
          style={{ minWidth: '90px', maxWidth: '120px' }}
          onClick={handlePlay}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5v14l11-7L5 5z" />
          </svg>
          Listen
        </button>
      </div>
    </div>
  );
}
