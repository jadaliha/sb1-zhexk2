import React, { useRef, useEffect } from 'react';
import { useVirtual } from 'react-virtual';
import { format, addDays, isSameDay } from 'date-fns';
import { useCalendarStore } from '../store/calendarStore';

const DAYS_TO_LOAD = 365 * 2; // 2 years worth of dates

export function DatePicker() {
  const parentRef = useRef<HTMLDivElement>(null);
  const { selectedDate, setSelectedDate, scrollToDate } = useCalendarStore();

  const rowVirtualizer = useVirtual({
    horizontal: true,
    size: DAYS_TO_LOAD,
    parentRef,
    estimateSize: React.useCallback(() => 100, []),
    overscan: 5,
  });

  const baseDate = new Date(); // Starting from today

  // Scroll to date when scrollToDate changes
  useEffect(() => {
    if (scrollToDate) {
      const daysDiff = Math.floor((scrollToDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
      rowVirtualizer.scrollToIndex(daysDiff);
    }
  }, [scrollToDate]);

  return (
    <div
      ref={parentRef}
      className="overflow-x-auto flex items-center h-32 bg-white shadow-lg"
      style={{
        width: '100%',
      }}
    >
      <div
        style={{
          width: `${rowVirtualizer.totalSize}px`,
          height: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.virtualItems.map((virtualItem) => {
          const date = addDays(baseDate, virtualItem.index);
          const isSelected = isSameDay(date, selectedDate);

          return (
            <div
              key={virtualItem.index}
              className={`absolute top-0 h-full flex flex-col items-center justify-center cursor-pointer transition-colors
                ${
                  isSelected
                    ? 'bg-pink-600 text-white'
                    : 'hover:bg-pink-100'
                }`}
              style={{
                left: `${virtualItem.start}px`,
                width: `${virtualItem.size}px`,
              }}
              onClick={() => setSelectedDate(date)}
            >
              <div className="text-2xl font-bold">
                {format(date, 'd')}
              </div>
              <div className="text-sm uppercase">
                {format(date, 'MMM')}
              </div>
              <div className="text-xs uppercase">
                {format(date, 'EEE')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}