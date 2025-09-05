import React, { useRef, useState } from "react";

export default function SpeechToText() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef(""); // Stores all final transcripts

  const handleRecord = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported. Use Chrome.");
      return;
    }

    // Stop recording if already recording
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    // Create a new recognition instance
    const recog = new window.webkitSpeechRecognition();
    recog.continuous = true; // Keep recording continuously
    recog.interimResults = true; // Get live results
    recog.lang = "en-US";

    recog.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = finalTranscriptRef.current;

      // Loop through results from the current event
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const currentText = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += currentText + " ";
        } else {
          interimTranscript += currentText;
        }
      }

      finalTranscriptRef.current = finalTranscript;
      setTranscript(finalTranscript + interimTranscript); 
    };

    recog.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };

    recog.onend = () => {
      
      if (isRecording) {
        recog.start();
      }
    };

    recognitionRef.current = recog;
    setIsRecording(true);
    recog.start();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
    alert("Text copied to clipboard!");
  };

  const handleSave = () => {
    const blob = new Blob([transcript], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "transcript.txt";
    link.click();
  };

  const handleClear = () => {
    setTranscript("");
    finalTranscriptRef.current = "";
  };

  return (
    <div className="w-full min-h-[40vh] bg-gradient-to-br from-purple-100 via-blue-50 to-purple-50 flex flex-col items-center justify-center rounded-2xl shadow-lg p-8 text-gray-900 border-2 border-purple-200">
      

      <button
        onClick={handleRecord}
        className={`px-5 py-2 rounded-full font-semibold text-white shadow transition-colors duration-150 mb-4 ${
          isRecording ? "bg-red-500" : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      <textarea
        className="w-full max-w-xl min-h-[120px] bg-white border-2 border-purple-200 rounded-xl p-4 mb-4 text-base text-gray-800 shadow overflow-y-auto resize-none"
        value={transcript}
        onChange={(e) => {
          setTranscript(e.target.value);
          finalTranscriptRef.current = e.target.value; 
        }}
        placeholder="Your speech will appear here..."
      />

      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={handleCopy}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded shadow font-medium"
        >
          Copy Text
        </button>
        <button
          onClick={handleSave}
          className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-1 rounded shadow font-medium"
        >
          Save Text
        </button>
        <button
          onClick={handleClear}
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded shadow font-medium"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
