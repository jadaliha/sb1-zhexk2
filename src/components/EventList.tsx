import React, { useRef, useEffect } from 'react';
import { useVirtual } from 'react-virtual';
import { format, addDays } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';
import { useCalendarStore } from '../store/calendarStore';

interface Event {
  id: string;
  title: string;
  description: string;
  time: string;
  date: Date;
}

const DAYS_TO_LOAD = 365 * 2; // 2 years worth of dates
const EVENTS_PER_DAY = 5;

// Generate events for all days
const generateAllEvents = () => {
  const events: Event[] = [];
  const baseDate = new Date();

  for (let dayOffset = 0; dayOffset < DAYS_TO_LOAD; dayOffset++) {
    const currentDate = addDays(baseDate, dayOffset);
    
    for (let i = 0; i < EVENTS_PER_DAY; i++) {
      events.push({
        id: `${currentDate.toISOString()}-${i}`,
        title: `Event ${i + 1}`,
        description: `Description for event on ${format(currentDate, 'MMM d, yyyy')}`,
        time: `${9 + i}:00`,
        date: currentDate,
      });
    }
  }
  
  return events;
};

const ALL_EVENTS = generateAllEvents();

export function EventList() {
  const parentRef = useRef<HTMLDivElement>(null);
  const { selectedDate, setSelectedDate, setScrollToDate } = useCalendarStore();
  
  const rowVirtualizer = useVirtual({
    size: ALL_EVENTS.length,
    parentRef,
    estimateSize: React.useCallback(() => 100, []),
    overscan: 5,
  });

  // Update selected date based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!parentRef.current) return;
      
      const scrollTop = parentRef.current.scrollTop;
      const eventHeight = 100; // matches estimateSize
      const currentEventIndex = Math.floor(scrollTop / eventHeight);
      const currentEvent = ALL_EVENTS[currentEventIndex];
      
      if (currentEvent) {
        setSelectedDate(currentEvent.date);
      }
    };

    const element = parentRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
      return () => element.removeEventListener('scroll', handleScroll);
    }
  }, [setSelectedDate]);

  // Scroll to selected date
  useEffect(() => {
    const eventIndex = ALL_EVENTS.findIndex(event => 
      event.date.getDate() === selectedDate.getDate() &&
      event.date.getMonth() === selectedDate.getMonth() &&
      event.date.getFullYear() === selectedDate.getFullYear()
    );
    
    if (eventIndex !== -1) {
      rowVirtualizer.scrollToIndex(eventIndex);
    }
  }, [selectedDate]);

  return (
    <div
      ref={parentRef}
      className="flex-1 overflow-auto bg-gray-50"
    >
      <div
        style={{
          height: `${rowVirtualizer.totalSize}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.virtualItems.map((virtualRow) => {
          const event = ALL_EVENTS[virtualRow.index];
          
          return (
            <div
              key={virtualRow.index}
              className="absolute top-0 left-0 w-full"
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div className="m-2 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-semibold text-lg text-gray-800">
                  {event.title}
                </h3>
                <div className="mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{format(event.date, 'MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {event.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}