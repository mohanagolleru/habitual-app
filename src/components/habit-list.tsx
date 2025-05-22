
"use client";

import type * as React from 'react';
import type { Habit } from "@/lib/types";
import { HabitItem } from "./habit-item";
// import { isHabitCompletedOnDate } from '@/lib/actions'; // Removed this, not directly used here but good to be aware
import { format, differenceInCalendarDays, parseISO } from 'date-fns';

interface HabitListProps {
  habits: Habit[];
  onToggleCompletion: (habitId: string, date: string, completed: boolean) => void;
  onDeleteHabit: (habitId: string) => void;
  onEditHabit: (habit: Habit) => void;
  currentDate: Date; 
}

export function HabitList({ habits, onToggleCompletion, onDeleteHabit, onEditHabit, currentDate }: HabitListProps) {
  
  const relevantHabits = habits.filter(habit => {
    const createdAt = parseISO(habit.createdAt);
    return differenceInCalendarDays(currentDate, createdAt) >= 0;
  }).sort((a,b) => parseISO(a.createdAt).getTime() - parseISO(b.createdAt).getTime());


  if (relevantHabits.length === 0) {
    const anyHabitsExist = habits.length > 0;
    return (
      <div className="text-center py-10">
        <p className="text-xl text-muted-foreground">
          {anyHabitsExist 
            ? `No habits active for ${format(currentDate, 'MMMM d, yyyy')}.`
            : "No habits yet. Start by adding a new one!"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {relevantHabits.map((habit) => (
          <HabitItem
            key={habit.id}
            habit={habit}
            onToggleCompletion={onToggleCompletion}
            onDeleteHabit={onDeleteHabit}
            onEditHabit={onEditHabit}
            currentDateContext={currentDate}
          />
        )
      )}
    </div>
  );
}
