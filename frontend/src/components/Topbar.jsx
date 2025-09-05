import React from 'react';

export default function Topbar({ onLogout }) {
  return (
    <header className="fixed top-0 left-0 w-full h-14 bg-white/80 backdrop-blur-md z-50 flex items-center justify-end px-6 shadow">
      <button
        onClick={onLogout}
        className="ml-auto px-4 py-2 rounded-lg bg-purple-100 text-purple-700 font-semibold border border-purple-300 hover:bg-purple-200 transition text-sm"
      >
        Logout
      </button>
    </header>
  );
}
