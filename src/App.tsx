import React from 'react';
import { DatePicker } from './components/DatePicker';
import { EventList } from './components/EventList';

function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="bg-pink-600 text-white p-4">
        <h1 className="text-2xl font-bold">Calendar Events</h1>
      </header>
      <DatePicker />
      <EventList />
    </div>
  );
}

export default App;