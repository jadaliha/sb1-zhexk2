import { create } from 'zustand';
import { addDays, startOfDay } from 'date-fns';

interface CalendarState {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  scrollToDate: Date | null;
  setScrollToDate: (date: Date | null) => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  selectedDate: startOfDay(new Date()),
  setSelectedDate: (date: Date) => set({ selectedDate: startOfDay(date) }),
  scrollToDate: null,
  setScrollToDate: (date: Date | null) => set({ scrollToDate: date }),
}));