import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function CalendarWidget() {
  const [date, setDate] = React.useState(new Date());
  return (
    <div className="my-8 flex flex-col items-center">
      <h3 className="text-2xl font-bold text-purple-600 mb-2">Calendar</h3>
      <Calendar
        onChange={setDate}
        value={date}
        className="rounded-xl shadow border-2 border-purple-200"
      />
      <p className="mt-2 text-gray-600">Selected date: {date.toLocaleDateString()}</p>
    </div>
  );
}
