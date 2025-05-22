
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
  isDragging: boolean;
  isDropTarget: boolean;
  onDragStartHandler: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnterHandler: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOverHandler: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeaveHandler: (e: React.DragEvent<HTMLDivElement>) => void;
  onDropHandler: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEndHandler: (e: React.DragEvent<HTMLDivElement>) => void;
}

export function HabitItem({
  habit,
  onToggleCompletion,
  onDeleteHabit,
  onEditHabit,
  currentDateContext,
  isDragging,
  isDropTarget,
  onDragStartHandler,
  onDragEnterHandler,
  onDragOverHandler,
  onDragLeaveHandler,
  onDropHandler,
  onDragEndHandler
}: HabitItemProps) {
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

  return (
    <Card
      className={cn(
        "shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col h-full",
        isDragging ? "opacity-50 cursor-grabbing" : "cursor-grab",
        isDropTarget ? "border-t-4 border-primary" : ""
      )}
      draggable={true}
      onDragStart={onDragStartHandler}
      onDragEnter={onDragEnterHandler}
      onDragOver={onDragOverHandler}
      onDragLeave={onDragLeaveHandler}
      onDrop={onDropHandler}
      onDragEnd={onDragEndHandler}
    >
      <CardHeader className="flex-row items-start gap-2 space-y-0 pb-2 pt-3">
        <span className="p-1">
          <IconComponent
            className={cn("h-8 w-8 text-black")}
            strokeWidth={1}
            style={{ shapeRendering: 'crispEdges', imageRendering: 'pixelated' }}
          />
        </span>
        <div className="flex-1">
          <CardTitle className="text-xl">{habit.title}</CardTitle>
        </div>
        <Badge variant="secondary" className="capitalize">
            <CalendarIcon className="w-3 h-3 mr-1" />
            {frequencyTextMap[habit.frequency]}
        </Badge>
      </CardHeader>
      <CardContent className="flex-grow space-y-1 py-2">
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
      <CardFooter className="flex justify-center items-center gap-2 border-t pt-3 pb-3 mt-auto">
        <Button variant="outline" size="icon" onClick={() => onEditHabit(habit)} aria-label="Edit habit" className="flex-shrink-0">
            <Edit3 className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => onDeleteHabit(habit.id)} aria-label="Delete habit" className="flex-shrink-0">
            <Trash2 className="h-4 w-4" />
        </Button>
        {canLogForThisDate && habitExistsOnThisDate && (
          <Button
            onClick={handleToggleCompletion}
            variant={isCompletedForCurrentDate ? "default" : "outline"}
            size="default" 
            className={cn(
              isCompletedForCurrentDate
                ? "bg-[#ADFF2F] hover:bg-[#98e61a] text-black" // "Done" button
                : "text-black hover:text-black px-2" // "Log now" button - narrower
            )}
          >
            {isCompletedForCurrentDate ? (
              <CheckCircle2 className="mr-2 h-5 w-5" />
            ) : (
              <Circle className="mr-1 h-4 w-4" /> // Smaller icon and margin for "Log now"
            )}
            {isCompletedForCurrentDate ? "Done" : "Log now"}
          </Button>
        )}
        {(!canLogForThisDate || !habitExistsOnThisDate) && (
             <Button disabled variant="outline" size="default" className="px-2">
                {isCompletedForCurrentDate ? <CheckCircle2 className="mr-1 h-4 w-4" /> : <Circle className="mr-1 h-4 w-4" />}
                {isCompletedForCurrentDate ? 'Done' : 'Log'} for {format(currentDateContext, 'MMM d')}
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
