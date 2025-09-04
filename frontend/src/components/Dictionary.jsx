import React, { useRef, useState } from "react";

const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

export default function Dictionary() {
  const [word, setWord] = useState("");
  const [result, setResult] = useState(null);
  const [info, setInfo] = useState(
    "Type a word and press enter to get meaning, example, pronunciation and synonyms of that typed word."
  );
  const [active, setActive] = useState(false);
  const [audio, setAudio] = useState(null);
  const inputRef = useRef();

  const fetchApi = async (searchWord) => {
    setActive(false);
    setInfo(`Searching the meaning of "${searchWord}"`);
    try {
      const res = await fetch(`${API_URL}${searchWord}`);
      const data = await res.json();
      if (data.title) {
        setInfo(`Can't find the meaning of "${searchWord}". Please, try to search for another word.`);
        setResult(null);
      } else {
        setActive(true);
        setResult(data[0]);
        setAudio(data[0].phonetics[0]?.audio || null);
      }
    } catch {
      setInfo(`Can't find the meaning of "${searchWord}". Please, try to search for another word.`);
      setResult(null);
    }
  };

  const handleSearch = (e) => {
    const searchWord = e.target.value.trim();
    setWord(searchWord);
    if (e.key === "Enter" && searchWord) {
      fetchApi(searchWord);
    }
  };

  const handleVolume = () => {
    if (audio) {
      const aud = new Audio(audio);
      aud.play();
    }
  };

  const handleClear = () => {
    setWord("");
    inputRef.current.focus();
    setActive(false);
    setInfo("Type any existing word and press enter to get meaning, example, synonyms, etc.");
    setResult(null);
  };

  return (
    <div className="bg-white rounded-lg p-7 w-full max-w-md shadow-lg mx-auto">
      <header className="text-2xl font-semibold text-center mb-4">English Dictionary</header>
      <div className="relative mb-4">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search a word"
          required
          value={word}
          onChange={(e) => setWord(e.target.value)}
          onKeyUp={handleSearch}
          className="h-12 w-full px-10 pr-10 border border-gray-400 rounded focus:border-blue-600 text-base outline-none"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <i className="fas fa-search" />
        </span>
        {word && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
            onClick={handleClear}
          >
            <i className="material-icons">close</i>
          </span>
        )}
      </div>
      {!active && (
        <p className="text-sm text-gray-500 mb-2 text-center">
          {info}
        </p>
      )}
      {active && result && (
        <ul className="transition-all duration-200">
          <li className="flex items-center justify-between mb-4 pb-4 border-b">
            <div>
              <p className="text-xl font-bold">{result.word}</p>
              <span className="text-xs text-gray-400">
                {result.meanings[0]?.partOfSpeech} /{result.phonetics[0]?.text}/
              </span>
            </div>
            {audio && (
              <button
                className="text-blue-600 text-lg ml-2"
                onClick={handleVolume}
                title="Play pronunciation"
              >
                <i className="fas fa-volume-up" />
              </button>
            )}
          </li>
          <div className="max-h-52 overflow-y-auto">
            <li className="mb-3">
              <div className="border-l-4 border-blue-600 pl-3 rounded">
                <p className="font-semibold">Meaning</p>
                <span className="text-gray-700 text-sm">
                  {result.meanings[0]?.definitions[0]?.definition || "__"}
                </span>
              </div>
            </li>
            <li className="mb-3">
              <div className="border-l-4 border-blue-600 pl-3 rounded">
                <p className="font-semibold">Example</p>
                <span className="text-gray-700 text-sm">
                  {result.meanings[0]?.definitions[0]?.example || "__"}
                </span>
              </div>
            </li>
            {result.meanings[0]?.definitions[0]?.synonyms?.length > 0 && (
              <li>
                <div className="border-l-4 border-blue-600 pl-3 rounded">
                  <p className="font-semibold">Synonyms</p>
                  <div className="flex flex-wrap">
                    {result.meanings[0].definitions[0].synonyms.slice(0, 5).map((syn, i) => (
                      <span
                        key={syn}
                        className="underline cursor-pointer mr-2 text-blue-600"
                        onClick={() => fetchApi(syn)}
                      >
                        {syn}
                        {i < Math.min(4, result.meanings[0].definitions[0].synonyms.length - 1) ? "," : ""}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            )}
          </div>
        </ul>
      )}
    </div>
  );
}
