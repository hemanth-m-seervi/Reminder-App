import React, { useState } from "react";
import countries from "./countriesData";

export default function LanguageTranslator() {
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [fromLang, setFromLang] = useState("en-GB");
  const [toLang, setToLang] = useState("hi-IN");
  const [loading, setLoading] = useState(false);

  const handleExchange = () => {
    setFromText(toText);
    setToText(fromText);
    const tempLang = fromLang;
    setFromLang(toLang);
    setToLang(tempLang);
  };

  const handleTranslate = async () => {
    if (!fromText.trim()) return;
    setLoading(true);
    setToText("");
    try {
      const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(fromText)}&langpair=${fromLang}|${toLang}`;
      const res = await fetch(apiUrl);
      const data = await res.json();
      setToText(data.responseData.translatedText);
    } catch {
      setToText("Translation failed.");
    }
    setLoading(false);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Text copied to clipboard");
  };

  const handleSpeak = (text, lang) => {
    if (!text) return;
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full min-h-[40vh] bg-gradient-to-br from-purple-100 via-blue-50 to-purple-50 flex flex-col items-center justify-center rounded-2xl shadow-lg p-8 text-gray-900 border-2 border-purple-200">
  {/* Removed Language Translator heading as requested */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6 mb-4 flex flex-col gap-4">
        <div className="flex gap-4">
          <textarea
            className="flex-1 h-32 border-2 border-purple-200 rounded-xl p-3 text-base resize-none focus:border-purple-400"
            placeholder="Enter Text"
            value={fromText}
            onChange={e => setFromText(e.target.value)}
          />
          <textarea
            className="flex-1 h-32 border-2 border-purple-200 rounded-xl p-3 text-base resize-none bg-purple-50 text-gray-700 focus:border-purple-400"
            placeholder={loading ? "Translating..." : "Translation"}
            value={toText}
            readOnly
            disabled
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 items-center w-full sm:w-auto">
            <button className="text-purple-600 hover:text-purple-900" title="Speak" onClick={() => handleSpeak(fromText, fromLang)}>
              <i className="fas fa-volume-up"></i>
            </button>
            <button className="text-blue-600 hover:text-blue-900" title="Copy" onClick={() => handleCopy(fromText)}>
              <i className="fas fa-copy"></i>
            </button>
            <select className="flex-1 sm:flex-none border rounded px-2 py-1" value={fromLang} onChange={e => setFromLang(e.target.value)}>
              {Object.entries(countries).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>
          <button className="text-gray-500 hover:text-gray-900 text-xl px-3" title="Exchange" onClick={handleExchange}>
            <i className="fas fa-exchange-alt"></i>
          </button>
          <div className="flex gap-2 items-center w-full sm:w-auto">
            <select className="flex-1 sm:flex-none border rounded px-2 py-1" value={toLang} onChange={e => setToLang(e.target.value)}>
              {Object.entries(countries).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
            <button className="text-purple-600 hover:text-purple-900" title="Speak" onClick={() => handleSpeak(toText, toLang)}>
              <i className="fas fa-volume-up"></i>
            </button>
            <button className="text-blue-600 hover:text-blue-900" title="Copy" onClick={() => handleCopy(toText)}>
              <i className="fas fa-copy"></i>
            </button>
          </div>
        </div>
      </div>
      <button
        className="w-full max-w-2xl py-3 mt-2 rounded-xl bg-gradient-to-r from-purple-500 via-blue-500 to-purple-400 text-white font-bold text-lg shadow hover:from-purple-600 hover:to-blue-600 transition"
        onClick={handleTranslate}
        disabled={loading}
      >
        {loading ? "Translating..." : "Translate Text"}
      </button>
    </div>
  );
}
