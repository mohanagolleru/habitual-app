
"use client";

import * as React from 'react';
import type { Habit } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthGrid } from './month-grid';
import * as LucideIcons from 'lucide-react';
import { Flame, TrendingUp, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface HabitHeatmapCardProps {
  habit: Habit;
  year: number;
}

const ALL_MONTHS = Array.from({ length: 12 }, (_, i) => i);

export function HabitHeatmapCard({ habit, year }: HabitHeatmapCardProps) {
  const IconComponent = (LucideIcons as any)[habit.icon] || LucideIcons.Target;

  const getMonthName = (monthIndex: number): string => {
    return format(new Date(year, monthIndex), 'MMMM');
  };

  const frequencyTextMap = {
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
  };

  const iconTextColor = habit.color.includes('yellow-400') || habit.color.includes('lime-500') || habit.color.includes('cyan-500') || habit.color.includes('amber-500') ? 'text-black' : 'text-white';


  return (
    <Card className="shadow-md w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span className={cn("p-1.5 rounded-lg", habit.color)}>
                <IconComponent 
                    className={cn("h-6 w-6", iconTextColor)} 
                    strokeWidth={1}
                    style={{ shapeRendering: 'crispEdges', imageRendering: 'pixelated' }} 
                />
                </span>
                <div>
                <CardTitle className="text-lg">{habit.title}</CardTitle>
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
        <div className="flex overflow-x-auto space-x-4 py-2">
          {ALL_MONTHS.map((monthIndex) => (
            <div key={monthIndex} className="flex flex-col items-center flex-shrink-0">
              <h4 className="text-sm font-medium mb-1 text-muted-foreground">{getMonthName(monthIndex)} {year}</h4>
              <MonthGrid
                year={year}
                month={monthIndex}
                completions={habit.completions}
                creationDate={habit.createdAt}
                habitColor={habit.color}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
