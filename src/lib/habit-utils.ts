
import type { Habit } from "./types";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

// Helper to check if a habit is completed on a specific date based on its frequency
export function isHabitCompletedOnDate(habit: Habit, targetDate: Date): boolean {
  const targetDateStr = format(targetDate, 'yyyy-MM-dd');

  if (habit.frequency === 'daily') {
    return !!habit.completions[targetDateStr];
  } else if (habit.frequency === 'weekly') {
    const weekStart = startOfWeek(targetDate, { weekStartsOn: 1 }); 
    const weekEnd = endOfWeek(targetDate, { weekStartsOn: 1 });
    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
    return daysInWeek.some(dayInWeek => !!habit.completions[format(dayInWeek, 'yyyy-MM-dd')]);
  } else if (habit.frequency === 'monthly') {
    const monthStart = startOfMonth(targetDate);
    const monthEnd = endOfMonth(targetDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    return daysInMonth.some(dayInMonth => !!habit.completions[format(dayInMonth, 'yyyy-MM-dd')]);
  }
  return false;
}
