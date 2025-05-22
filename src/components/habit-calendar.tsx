
"use client";

import * as React from 'react';
import type { Habit } from "@/lib/types";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isSameDay, parseISO } from "date-fns";
import { isHabitCompletedOnDate } from '@/lib/habit-utils';


interface HabitCalendarProps {
  habits: Habit[];
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  className?: string;
}

export function HabitCalendar({ habits, selectedDate, onSelectDate, className }: HabitCalendarProps) {
  
  const completedDays = React.useMemo(() => {
    const dates: Date[] = [];
    if (!habits || habits.length === 0) return dates;

    const allCompletionDates: Set<string> = new Set();
    habits.forEach(habit => {
      Object.keys(habit.completions).forEach(dateStr => {
        if (habit.completions[dateStr]) {
            allCompletionDates.add(dateStr);
        }
      });
    });
    
    allCompletionDates.forEach(dateStr => {
        const date = parseISO(dateStr); 
        if (habits.some(habit => isHabitCompletedOnDate(habit, date))) { // Double check with frequency logic
            dates.push(date);
        }
    });
    return dates;
  }, [habits]);

  return (
    <Card className={`shadow-lg ${className}`}>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-primary">Activity Calendar</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          className="rounded-md"
          modifiers={{ 
            completed: completedDays,
          }}
          modifiersClassNames={{
            completed: "border border-accent rounded-full",
            selected: "bg-primary text-primary-foreground rounded-full",
            today: "text-accent font-bold border-primary"
          }}
          disabled={(date) => date > new Date()} // Disable future dates
        />
      </CardContent>
    </Card>
  );
}
