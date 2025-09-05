# TODO: Make Website Responsive for Phones

## Tasks
- [x] Update App.jsx: Add state for sidebar toggle, hide sidebar on small screens, add hamburger menu button
- [x] Update Sidebar.jsx: Add responsive classes to hide/show based on toggle state
- [x] Update Home.jsx: Adjust layout to stack vertically on small screens, remove fixed margins, use responsive grid
- [x] Fix sidebar toggle: Add overlay to close sidebar on outside click
- [x] Update Timetable.jsx: Make responsive for phones
- [x] Update Schedule.jsx: Make responsive for phones
- [x] Update Reminders.jsx: Make responsive for phones
- [x] Update MarksEntry.jsx: Make responsive for phones
- [x] Update Exams.jsx: Make responsive for phones
- [x] Update Notes.jsx: Make responsive for phones
- [ ] Test responsiveness on different screen sizes (run npm run dev in frontend directory and check on phone/laptop)

## Notes
- Keep laptop layout unchanged (use md: breakpoints)
- Use Tailwind responsive utilities (sm:, md:)
- Sidebar should be hidden by default on phones, toggleable via hamburger menu
- Input fields left-aligned on small screens
- Missed button next to Add button on phones
