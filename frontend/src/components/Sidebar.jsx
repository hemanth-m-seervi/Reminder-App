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

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-lg rounded-r-3xl flex flex-col py-8 px-4 animate-fade-in fixed top-0 left-0 h-screen z-40">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-purple-700">Remin</h1>
        <p className="text-sm text-gray-500">College Manager</p>
      </div>
      <nav className="flex flex-col gap-4">
        {navItems.map(item => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 text-lg font-medium ${isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-purple-50'}`
            }
          >
            <span className="text-xl">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
