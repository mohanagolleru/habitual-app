
"use client";

import * as React from 'react';
import type { Habit } from "@/lib/types";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { parseISO } from "date-fns";
import { isHabitCompletedOnDate } from '@/lib/habit-utils';
import { cn } from '@/lib/utils';


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
        // Ensure the habit was actually completable on this date according to its own logic (frequency etc.)
        // This check might be slightly redundant if `habit.completions` is always accurate,
        // but good for robustness.
        if (habits.some(habit => isHabitCompletedOnDate(habit, date))) {
            dates.push(date);
        }
    });
    return dates;
  }, [habits]);

  return (
    <Card className={cn("shadow-md", className)}>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">Activity Calendar</CardTitle>
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
            completed: "bg-accent text-accent-foreground rounded-full",
            selected: "bg-primary text-primary-foreground rounded-full ring-1 ring-offset-background ring-primary-foreground/50",
            today: "border-2 border-ring text-foreground font-semibold rounded-full",
            // Default ShadCN styles that we might want to ensure are not lost or can be customized further:
            // day_outside: "day-outside text-muted-foreground opacity-50", // Default from Shadcn
            // day_disabled: "text-muted-foreground opacity-50", // Default from Shadcn
          }}
          disabled={(date) => date > new Date()} // Disable future dates
        />
      </CardContent>
    </Card>
  );
}
