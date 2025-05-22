
"use client";

import * as React from 'react';
import type { Habit } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthGrid } from './month-grid';
import * as LucideIcons from 'lucide-react';
import { Flame, TrendingUp, Calendar } from 'lucide-react';
import { format, getMonth, subMonths } from 'date-fns';

interface HabitHeatmapCardProps {
  habit: Habit;
  year: number;
}

// Define specific months to show (e.g., last 3 months of the year)
const MONTHS_TO_DISPLAY = [9, 10, 11]; // Oct, Nov, Dec (0-indexed)

export function HabitHeatmapCard({ habit, year }: HabitHeatmapCardProps) {
  const IconComponent = (LucideIcons as any)[habit.icon] || LucideIcons.Target;

  const getMonthName = (monthIndex: number): string => {
    return format(new Date(year, monthIndex), 'MMM');
  };
  
  const frequencyTextMap = {
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
  };

  return (
    <Card className="shadow-md w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <span className="p-2 bg-primary/10 rounded-lg">
                <IconComponent className="h-7 w-7 text-primary" />
                </span>
                <div>
                <CardTitle className="text-xl">{habit.title}</CardTitle>
                <CardDescription className="text-sm">
                    <Calendar className="inline-block h-3 w-3 mr-1" />
                    {frequencyTextMap[habit.frequency]}
                </CardDescription>
                </div>
            </div>
            <div className="text-right">
                <div className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
                    <Flame className="h-4 w-4 text-orange-500" /> Current: <span className="font-semibold text-foreground">{habit.currentStreak}</span>
                </div>
                <div className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4 text-blue-500" /> Longest: <span className="font-semibold text-foreground">{habit.longestStreak}</span>
                </div>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {MONTHS_TO_DISPLAY.map((monthIndex) => (
            <div key={monthIndex} className="flex flex-col items-center">
              <h4 className="text-sm font-medium mb-1 text-muted-foreground">{getMonthName(monthIndex)} {year}</h4>
              <MonthGrid
                year={year}
                month={monthIndex}
                completions={habit.completions}
                creationDate={habit.createdAt}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
