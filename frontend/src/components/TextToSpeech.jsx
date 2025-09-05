import React, { useRef, useEffect, useState } from "react";


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
    window.speechSynthesis.cancel(); 
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceChange = (e) => {
    setSelectedVoice(Number(e.target.value));
  };

  return (
    <div className="w-full min-h-[40vh] bg-gradient-to-br from-purple-100 via-blue-50 to-purple-50 flex flex-col items-center justify-center rounded-2xl shadow-lg p-8 text-gray-900 border-2 border-purple-200">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6 flex flex-col items-center gap-6">
  
        <textarea
          ref={textareaRef}
          placeholder="Write anything here...."
          className="w-full max-w-xl h-36 bg-purple-50 text-purple-900 text-base border-2 border-purple-200 outline-none p-5 rounded-xl mb-5 placeholder:text-purple-400 shadow focus:border-purple-400 transition duration-150"
        />
        <div className="w-full max-w-xl flex flex-col sm:flex-row items-center gap-4">
          <select
            onChange={handleVoiceChange}
            value={selectedVoice}
            className="text-purple-900 bg-purple-50 h-10 px-6 outline-none border-2 border-purple-200 rounded-full appearance-none shadow focus:border-purple-400 transition duration-150 text-lg w-full sm:w-auto sm:min-w-[260px] sm:max-w-[380px]"
          >
            {voices.map((voice, i) => (
              <option key={voice.name} value={i}>{voice.name} ({voice.lang})</option>
            ))}
          </select>
          <button
            className="bg-gradient-to-r from-purple-500 via-blue-500 to-purple-400 hover:from-purple-600 hover:to-blue-600 text-white text-base px-4 py-1 rounded-full flex items-center font-semibold shadow transition-colors duration-150 border border-purple-200 drop-shadow w-full sm:w-auto sm:min-w-[90px] sm:max-w-[120px]"
            onClick={handlePlay}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5v14l11-7L5 5z" />
            </svg>
            Listen
          </button>
        </div>
      </div>
    </div>
  );
}
