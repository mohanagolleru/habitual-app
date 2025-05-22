
"use client";

import * as React from 'react';
import type { Habit } from "@/lib/types";
import { HabitItem } from "./habit-item";
import { format, differenceInCalendarDays, parseISO } from 'date-fns';

interface HabitListProps {
  habits: Habit[];
  onToggleCompletion: (habitId: string, date: string, completed: boolean) => void;
  onDeleteHabit: (habitId: string) => void;
  onEditHabit: (habit: Habit) => void;
  currentDate: Date;
  draggingHabitId: string | null;
  dropTargetId: string | null;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, habitId: string) => void;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>, targetHabitId: string) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, targetHabitId: string) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
}

export function HabitList({ 
  habits, 
  onToggleCompletion, 
  onDeleteHabit, 
  onEditHabit, 
  currentDate,
  draggingHabitId,
  dropTargetId,
  onDragStart,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd
}: HabitListProps) {
  
  const relevantHabits = habits.filter(habit => {
    const createdAt = parseISO(habit.createdAt);
    // The order from the 'habits' prop (managed by HomePage) is now preserved.
    return differenceInCalendarDays(currentDate, createdAt) >= 0;
  });


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
            isDragging={habit.id === draggingHabitId}
            isDropTarget={habit.id === dropTargetId}
            onDragStartHandler={(e) => onDragStart(e, habit.id)}
            onDragEnterHandler={(e) => onDragEnter(e, habit.id)}
            onDragOverHandler={onDragOver}
            onDragLeaveHandler={onDragLeave}
            onDropHandler={(e) => onDrop(e, habit.id)}
            onDragEndHandler={onDragEnd}
          />
        )
      )}
    </div>
  );
}
