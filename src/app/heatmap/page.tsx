
"use client";

import * as React from 'react';
import type { Habit } from '@/lib/types';
import { HabitHeatmapCard } from '@/components/habit-heatmap-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { parseISO } from 'date-fns';

const LOCAL_STORAGE_KEY = "habitsData_v1";
const DEFAULT_HABIT_COLOR = "bg-blue-500";

export default function HeatmapPage() {
  const [habits, setHabits] = React.useState<Habit[]>([]);
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());
  const { toast } = useToast();
  const [isMounted, setIsMounted] = React.useState(false);

  const loadHabitsFromStorage = React.useCallback(() => {
    try {
      const storedHabits = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedHabits) {
        const parsedHabits: Habit[] = JSON.parse(storedHabits);
        // Validate and use stored order, do not re-sort here
        const validatedHabits = parsedHabits.map(h => ({
            ...h,
            icon: h.icon || 'Target',
            color: (typeof h.color === 'string' && h.color.startsWith('bg-')) ? h.color : DEFAULT_HABIT_COLOR,
            completions: h.completions || {},
            currentStreak: h.currentStreak || 0,
            longestStreak: h.longestStreak || 0,
            frequency: h.frequency || 'daily',
            createdAt: h.createdAt || new Date(0).toISOString()
          }));
        setHabits(validatedHabits);
      }
    } catch (error) {
      console.error("Failed to load habits from local storage for heatmap:", error);
      toast({ title: "Error", description: "Could not load saved habits.", variant: "destructive" });
    }
  }, [toast]);

  React.useEffect(() => {
    setIsMounted(true);
    loadHabitsFromStorage();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === LOCAL_STORAGE_KEY) {
        loadHabitsFromStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadHabitsFromStorage]);


  const handlePreviousYear = () => {
    setCurrentYear((prevYear) => prevYear - 1);
  };

  const handleNextYear = () => {
    setCurrentYear((prevYear) => prevYear + 1);
  };

  if (!isMounted) {
    return <div className="flex justify-center items-center min-h-screen"><p>Loading heatmap data...</p></div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-3 border-b">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" passHref>
            <Button variant="outline" size="icon" aria-label="Back to Home">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-primary">Habit Heatmap</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handlePreviousYear} aria-label="Previous year">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-xl font-semibold min-w-[5rem] text-center">{currentYear}</span>
            <Button variant="outline" size="icon" onClick={handleNextYear} aria-label="Next year" disabled={currentYear === new Date().getFullYear()}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-4 space-y-3">
        {habits.length > 0 ? (
          habits.map((habit) => (
            <HabitHeatmapCard key={habit.id} habit={habit} year={currentYear} />
          ))
        ) : (
          <div className="text-center py-20">
             <img src="https://placehold.co/150x150.png" alt="No habits illustration" data-ai-hint="calendar empty" className="mx-auto mb-6 rounded-lg" />
            <h2 className="text-2xl font-semibold text-primary mb-2">No Habits to Display</h2>
            <p className="text-muted-foreground">
              Once you add some habits, their heatmaps will appear here.
            </p>
            <Button asChild className="mt-6">
              <Link href="/">Add Your First Habit</Link>
            </Button>
          </div>
        )}
      </main>
       <footer className="py-3 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Habitual. Keep building those habits!</p>
      </footer>
    </div>
  );
}
