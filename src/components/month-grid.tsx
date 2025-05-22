
"use client";

import * as React from 'react';
import { format, getDaysInMonth, startOfMonth, getDay, isToday, isFuture, isSameDay, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Habit } from '@/lib/types'; // Ensure Habit type is imported if needed, though not directly used in props

interface MonthGridProps {
  year: number;
  month: number; // 0-indexed (0 for January, 11 for December)
  completions: Record<string, boolean>; // 'YYYY-MM-DD': true
  creationDate: string; // ISO string of when the habit was created
  habitColor: string; // Tailwind CSS class for the habit's color e.g. 'bg-blue-500'
}

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function MonthGrid({ year, month, completions, creationDate, habitColor }: MonthGridProps) {
  const daysInMonth = getDaysInMonth(new Date(year, month));
  const firstDayOfMonth = startOfMonth(new Date(year, month));
  const habitCreatedAt = parseISO(creationDate);

  let startingDayOfWeek = (getDay(firstDayOfMonth) + 6) % 7; 

  const cells = React.useMemo(() => {
    const monthCells: Array<{
      day: number | null;
      date: Date | null;
      isCompleted: boolean;
      isTodayCell: boolean;
      isFutureCell: boolean;
      isDisabled: boolean; 
    }> = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      monthCells.push({ day: null, date: null, isCompleted: false, isTodayCell: false, isFutureCell: false, isDisabled: false });
    }

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
        {DAY_LABELS.map((label, index) => (
          <div key={`${label}-${index}`} className="text-xs font-medium text-center text-muted-foreground">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 w-full p-1 bg-card rounded-md">
        {cells.map((cell, index) => (
          <div
            key={index}
            className={cn(
              'w-5 h-5 rounded-sm', 
              cell.day === null ? 'bg-transparent' : 'border border-transparent',
              cell.isDisabled ? 'bg-muted/10 cursor-not-allowed' :
              cell.isCompleted ? habitColor : // Use habitColor here
              cell.isTodayCell && !cell.isFutureCell ? 'border-primary border-2' :
              cell.isFutureCell ? 'bg-muted/20' :
              cell.day !== null ? 'bg-muted/30' : '' 
            )}
            title={cell.date ? format(cell.date, 'PPP') : undefined}
          >
          </div>
        ))}
      </div>
    </div>
  );
}
