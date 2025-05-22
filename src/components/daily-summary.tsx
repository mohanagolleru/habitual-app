
"use client";

import * as React from 'react';
import type { Habit } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { isHabitCompletedOnDate } from '@/lib/habit-utils'; 
import { format, isToday, differenceInCalendarDays, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface DailySummaryProps {
  habits: Habit[];
  currentDate: Date; 
}

export function DailySummary({ habits, currentDate }: DailySummaryProps) {
  
  const relevantHabits = habits.filter(habit => {
    const createdAt = parseISO(habit.createdAt);
    // Habit is relevant if it was created on or before the current date
    return differenceInCalendarDays(currentDate, createdAt) >= 0;
  });

  const completedCount = relevantHabits.filter(habit => 
    isHabitCompletedOnDate(habit, currentDate)
  ).length;
  
  const totalRelevantHabits = relevantHabits.length;
  const progressPercentage = totalRelevantHabits > 0 ? (completedCount / totalRelevantHabits) * 100 : 0;

  const titleText = isToday(currentDate) ? "Today's Progress" : `Progress on ${format(currentDate, 'MMMM d, yyyy')}`;

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">
          {titleText}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {totalRelevantHabits > 0 ? (
          <>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">
                {completedCount} / {totalRelevantHabits}
              </p>
              <p className="text-sm text-muted-foreground">habits completed</p>
            </div>
            <Progress value={progressPercentage} className="w-full h-3 [&>div]:bg-accent" />
          </>
        ) : (
          <p className="text-center text-muted-foreground">
            No habits scheduled for {isToday(currentDate) ? 'today' : format(currentDate, 'MMMM d')}. Add some habits to get started!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
