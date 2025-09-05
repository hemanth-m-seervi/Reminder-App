import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaTable, FaBook, FaClipboardList, FaBell, FaCalendarAlt, FaHome } from 'react-icons/fa';

const navItems = [
  { name: 'Home', path: '/', icon: <FaHome /> },
  { name: 'Timetable', path: '/timetable', icon: <FaTable /> },
  { name: 'Exams', path: '/exams', icon: <FaClipboardList /> },
  { name: 'Marks Entry', path: '/marks-entry', icon: <FaClipboardList /> },
  { name: 'Notes', path: '/notes', icon: <FaBook /> },
  { name: 'Reminders', path: '/reminders', icon: <FaBell /> },
  { name: 'Schedule', path: '/schedule', icon: <FaCalendarAlt /> },
];


export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
  <nav className="w-full bg-black/70 backdrop-blur-md shadow-md flex items-center px-2 sm:px-8 py-2 z-50 fixed top-0 left-0 right-0">
      <div className="flex items-center gap-2 sm:gap-4 mr-6">
        
        <button
          className="sm:hidden mr-2 p-2 focus:outline-none"
          aria-label="Open navigation menu"
          onClick={() => setOpen(o => !o)}
        >
          <span className="block w-6 h-0.5 bg-white mb-1 rounded"></span>
          <span className="block w-6 h-0.5 bg-white mb-1 rounded"></span>
          <span className="block w-6 h-0.5 bg-white rounded"></span>
        </button>
        <span className="text-2xl font-bold text-purple-200">Remin</span>
        <span className="hidden sm:inline text-xs text-gray-200">College Manager</span>
      </div>
      
      <div className="hidden sm:flex flex-1 gap-4 overflow-x-auto scrollbar-hide">
        {navItems.map(item => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-2 sm:px-4 py-1 rounded-lg transition-colors duration-200 text-base sm:text-lg font-medium whitespace-nowrap ${isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-purple-50'}`
            }
            onClick={() => setOpen(false)}
          >
            <span className="text-lg sm:text-xl">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </div>
      
      {open && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex">
          <div className="w-64 bg-white h-full shadow-2xl flex flex-col p-6 animate-slideInLeft">
            <button
              className="self-end mb-4 text-2xl text-gray-500 hover:text-red-500"
              aria-label="Close navigation menu"
              onClick={() => setOpen(false)}
            >
              &times;
            </button>
            <nav className="flex flex-col gap-4">
              {navItems.map(item => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 text-lg font-medium ${isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-purple-50'}`
                  }
                  onClick={() => setOpen(false)}
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
          
          <div className="flex-1" onClick={() => setOpen(false)}></div>
        </div>
      )}
    </nav>
  );
}
