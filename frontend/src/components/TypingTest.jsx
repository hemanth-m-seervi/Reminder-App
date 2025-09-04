import React, { useEffect, useRef, useState } from "react";

const paragraphs = [
  `Typing is a fundamental skill for anyone using a computer. The ability to type quickly and accurately can save you a lot of time and effort, whether you are writing emails, coding, or creating documents. Practice regularly to improve your speed and reduce mistakes. Remember, consistency is key to mastering typing skills.`,
  `React is a popular JavaScript library for building user interfaces. It allows developers to create large web applications that can update and render efficiently in response to data changes. By breaking the UI into reusable components, React makes code easier to maintain and scale. Learning React opens doors to many modern web development opportunities.`,
  `A healthy lifestyle includes regular exercise, balanced nutrition, and sufficient sleep. Taking breaks during work or study sessions helps maintain focus and productivity. Hydration is also important, so remember to drink water throughout the day. Small changes in daily habits can lead to significant improvements in overall well-being.`,
  `Technology continues to evolve at a rapid pace, influencing every aspect of our lives. From smartphones to artificial intelligence, advancements are making tasks easier and more efficient. Staying updated with the latest trends can help you adapt and thrive in a digital world. Embrace learning and be open to new possibilities.`
];

export default function TypingTest() {
  const [activeParagraph, setActiveParagraph] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timer, setTimer] = useState(null);
  const [input, setInput] = useState("");
  const [wpm, setWpm] = useState(0);
  const [cpm, setCpm] = useState(0);
  const inputRef = useRef();

  useEffect(() => {
    loadParagraph();
    // Focus input on keydown or click
    const focusInput = () => inputRef.current && inputRef.current.focus();
    document.addEventListener("keydown", focusInput);
    return () => document.removeEventListener("keydown", focusInput);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isTyping && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      setTimer(interval);
      return () => clearInterval(interval);
    } else if (timeLeft === 0) {
      setIsTyping(false);
      setInput("");
      if (timer) clearInterval(timer);
    }
    // eslint-disable-next-line
  }, [isTyping, timeLeft]);

  useEffect(() => {
    // Update WPM and CPM
    const minutes = (60 - timeLeft) / 60;
    const grossWpm = Math.round(((charIndex - mistakes) / 5) / minutes);
    setWpm(grossWpm > 0 && grossWpm !== Infinity ? grossWpm : 0);
    setCpm(charIndex - mistakes > 0 ? charIndex - mistakes : 0);
    // eslint-disable-next-line
  }, [charIndex, mistakes, timeLeft]);

  function loadParagraph() {
    const ranIndex = Math.floor(Math.random() * paragraphs.length);
    setActiveParagraph(paragraphs[ranIndex]);
    setCharIndex(0);
    setMistakes(0);
    setIsTyping(false);
    setTimeLeft(60);
    setInput("");
    setWpm(0);
    setCpm(0);
    if (timer) clearInterval(timer);
  }

  function handleInput(e) {
    const val = e.target.value;
    setInput(val);
    if (!isTyping && timeLeft > 0) setIsTyping(true);
    if (timeLeft === 0) return;
    let newCharIndex = charIndex;
    let newMistakes = mistakes;
    const chars = activeParagraph.split("");
    const typedChar = val[newCharIndex];
    if (newCharIndex < chars.length && timeLeft > 0) {
      if (typedChar == null) {
        if (newCharIndex > 0) {
          newCharIndex--;
          if (input[newCharIndex] !== chars[newCharIndex]) {
            newMistakes = Math.max(0, newMistakes - 1);
          }
        }
      } else {
        if (chars[newCharIndex] === typedChar) {
          // correct
        } else {
          newMistakes++;
        }
        newCharIndex++;
      }
      setCharIndex(newCharIndex);
      setMistakes(newMistakes);
      // If finished typing the paragraph
      if (newCharIndex === chars.length) {
        setIsTyping(false);
        setTimeLeft(0);
      }
    }
  }

  function handleTryAgain() {
    loadParagraph();
    inputRef.current && inputRef.current.focus();
  }

  return (
    <div className="bg-gray-900 rounded-lg p-7 w-full max-w-2xl shadow-lg mx-auto text-white">
      <input
        ref={inputRef}
        type="text"
        className="input-field"
        value={input}
        onChange={handleInput}
        autoFocus
        style={{position: 'absolute', opacity: 0, pointerEvents: 'none'}}
      />
      <div className="content-box p-5 border-4 border-cyan-500 rounded-lg">
    <div className="typing-text mb-4 cursor-pointer" onClick={() => inputRef.current && inputRef.current.focus()}>
          <p id="paragraph" className="text-lg text-gray-300 font-mono tracking-normal">
            {activeParagraph.split("").map((char, idx) => {
              let className = "relative align-middle";
              let overlay = null;
              if (idx < input.length) {
                className += input[idx] === char ? " correct" : " incorrect";
                overlay = (
                  <span
                    className={input[idx] === char ? "absolute inset-0 flex items-center justify-center text-green-400 font-bold" : "absolute inset-0 flex items-center justify-center text-red-400 font-bold"}
                    style={{pointerEvents: 'none', width: '100%', height: '100%', left: 0, top: 0}}
                  >{input[idx]}</span>
                );
              }
              if (idx === charIndex) className += " active";
              return (
                <span key={idx} className={className} style={{display: 'inline-block', minWidth: '1ch', position: 'relative', verticalAlign: 'middle', textAlign: 'center'}}>
                  <span style={{visibility: overlay ? 'hidden' : 'visible'}}>{char}</span>
                  {overlay}
                </span>
              );
            })}
          </p>
        </div>
        <div className="content flex flex-wrap items-center justify-between border-t-4 border-cyan-500 pt-4 mt-4">
          <ul className="result-details flex flex-wrap items-center w-full justify-between mb-4">
            <li className="flex items-center mr-4">
              <p className="text-sm">Time Left:</p>
              <span className="ml-2"><b>{timeLeft}</b>s</span>
            </li>
            <li className="flex items-center mr-4">
              <p className="text-sm">Mistakes:</p>
              <span className="ml-2">{mistakes}</span>
            </li>
            <li className="flex items-center mr-4">
              <p className="text-sm">WPM:</p>
              <span className="ml-2">{wpm}</span>
            </li>
            <li className="flex items-center">
              <p className="text-sm">CPM:</p>
              <span className="ml-2">{cpm}</span>
            </li>
          </ul>
          <button
            className="outline-none border-none w-28 text-cyan-500 py-2 px-4 text-base font-semibold cursor-pointer rounded-xl border-2 border-cyan-500 bg-white hover:bg-cyan-500 hover:text-white transition"
            onClick={handleTryAgain}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
