
"use client";

import * as React from 'react';
import { format, getDaysInMonth, startOfMonth, getDay, isToday, isFuture, isSameDay, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Habit } from '@/lib/types';

interface MonthGridProps {
  year: number;
  month: number; // 0-indexed (0 for January, 11 for December)
  completions: Record<string, boolean>; // 'YYYY-MM-DD': true
  creationDate: string; // ISO string of when the habit was created
}

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function MonthGrid({ year, month, completions, creationDate }: MonthGridProps) {
  const daysInMonth = getDaysInMonth(new Date(year, month));
  const firstDayOfMonth = startOfMonth(new Date(year, month));
  const habitCreatedAt = parseISO(creationDate);

  // getDay returns 0 for Sunday, 1 for Monday, ..., 6 for Saturday.
  // We want Monday to be the first day of the week (index 0).
  let startingDayOfWeek = (getDay(firstDayOfMonth) + 6) % 7; // Monday is 0, Sunday is 6

  const cells = React.useMemo(() => {
    const monthCells: Array<{
      day: number | null;
      date: Date | null;
      isCompleted: boolean;
      isTodayCell: boolean;
      isFutureCell: boolean;
      isDisabled: boolean; // Before habit creation
    }> = [];

    // Add padding cells for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      monthCells.push({ day: null, date: null, isCompleted: false, isTodayCell: false, isFutureCell: false, isDisabled: false });
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const isDisabled = currentDate < habitCreatedAt && !isSameDay(currentDate, habitCreatedAt);

      monthCells.push({
        day,
        date: currentDate,
        isCompleted: completions[dateStr] || false,
        isTodayCell: isToday(currentDate),
        isFutureCell: isFuture(currentDate) && !isToday(currentDate),
        isDisabled,
      });
    }
    return monthCells;
  }, [year, month, completions, startingDayOfWeek, daysInMonth, habitCreatedAt]);

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-7 gap-1 mb-1 w-full px-1">
        {DAY_LABELS.map((label) => (
          <div key={label} className="text-xs font-medium text-center text-muted-foreground">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 w-full p-1 bg-card rounded-md">
        {cells.map((cell, index) => (
          <div
            key={index}
            className={cn(
              'w-5 h-5 rounded-sm flex items-center justify-center text-xs',
              cell.day === null ? 'bg-transparent' : 'border border-transparent',
              cell.isDisabled ? 'bg-muted/10 cursor-not-allowed' : 
              cell.isCompleted ? 'bg-accent text-accent-foreground' :
              cell.isTodayCell && !cell.isFutureCell ? 'border-primary border-2' :
              cell.isFutureCell ? 'bg-muted/20' :
              cell.day !== null ? 'bg-muted/30' : '' // Past, not completed
            )}
            title={cell.date ? format(cell.date, 'PPP') : undefined}
          >
            {/* Optionally render day number for debugging, but design doesn't show it */}
            {/* {cell.day} */}
          </div>
        ))}
      </div>
    </div>
  );
}
