
"use client";

import * as React from 'react';
import type { Habit } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, Flame, TrendingUp, Trash2, Edit3, Calendar as CalendarIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { format, isToday as dateIsToday, differenceInCalendarDays, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface HabitItemProps {
  habit: Habit;
  onToggleCompletion: (habitId: string, date: string, completed: boolean) => void;
  onDeleteHabit: (habitId: string) => void;
  onEditHabit: (habit: Habit) => void;
  currentDateContext: Date; 
}

export function HabitItem({ habit, onToggleCompletion, onDeleteHabit, onEditHabit, currentDateContext }: HabitItemProps) {
  const IconComponent = (LucideIcons as any)[habit.icon] || LucideIcons.Target;
  
  const isCompletedForCurrentDate = habit.completions[format(currentDateContext, 'yyyy-MM-dd')];
  const canLogForThisDate = dateIsToday(currentDateContext);
  const habitExistsOnThisDate = differenceInCalendarDays(currentDateContext, parseISO(habit.createdAt)) >= 0;

  const handleToggleCompletion = () => {
    if (canLogForThisDate && habitExistsOnThisDate) {
      onToggleCompletion(habit.id, format(currentDateContext, 'yyyy-MM-dd'), !isCompletedForCurrentDate);
    }
  };
  
  const frequencyTextMap = {
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
  };
  
  const iconTextColor = 'text-white'; // Consistently white icon glyph

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
      <CardHeader className="flex-row items-start gap-4 space-y-0 pb-3">
        <span className={cn("p-2 rounded-lg", habit.color)}>
          <IconComponent 
            className={cn("h-8 w-8", iconTextColor)} 
            strokeWidth={1}
            style={{ shapeRendering: 'crispEdges', imageRendering: 'pixelated' }} 
          />
        </span>
        <div className="flex-1">
          <CardTitle className="text-xl">{habit.title}</CardTitle>
          {/* Description removed */}
        </div>
        <Badge variant="secondary" className="capitalize">
            <CalendarIcon className="w-3 h-3 mr-1" />
            {frequencyTextMap[habit.frequency]}
        </Badge>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex justify-around text-center">
          <div>
            <p className="text-2xl font-semibold text-accent flex items-center justify-center">
              <Flame className="h-6 w-6 mr-1 text-orange-500" /> {habit.currentStreak}
            </p>
            <p className="text-xs text-muted-foreground">Current Streak</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-primary flex items-center justify-center">
              <TrendingUp className="h-6 w-6 mr-1 text-blue-500" /> {habit.longestStreak}
            </p>
            <p className="text-xs text-muted-foreground">Longest Streak</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-4 mt-auto">
        <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => onEditHabit(habit)} aria-label="Edit habit">
                <Edit3 className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="icon" onClick={() => onDeleteHabit(habit.id)} aria-label="Delete habit">
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
        {canLogForThisDate && habitExistsOnThisDate && (
          <Button 
            onClick={handleToggleCompletion} 
            variant={isCompletedForCurrentDate ? "default" : "outline"}
            className={`min-w-[140px] ${isCompletedForCurrentDate ? 'bg-green-500 hover:bg-green-600 text-white' : ''}`}
          >
            {isCompletedForCurrentDate ? (
              <CheckCircle2 className="mr-2 h-5 w-5" />
            ) : (
              <Circle className="mr-2 h-5 w-5" />
            )}
            {isCompletedForCurrentDate ? "Completed" : "Log Today"}
          </Button>
        )}
        {(!canLogForThisDate || !habitExistsOnThisDate) && (
             <Button disabled variant="outline" className="min-w-[140px]">
                {isCompletedForCurrentDate ? <CheckCircle2 className="mr-2 h-5 w-5" /> : <Circle className="mr-2 h-5 w-5" />}
                {isCompletedForCurrentDate ? 'Done' : 'Log'} for {format(currentDateContext, 'MMM d')}
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
