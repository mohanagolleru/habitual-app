
"use client";

import * as React from 'react';
import type { Habit } from '@/lib/types';
import { HabitHeatmapCard } from '@/components/habit-heatmap-card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { parseISO } from 'date-fns';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

const LOCAL_STORAGE_KEY = "habitsData_v1";
const DEFAULT_HABIT_COLOR = "bg-blue-500";

export default function HeatmapPage() {
  const [habits, setHabits] = React.useState<Habit[]>([]);
  const [currentYear, setCurrentYear] = React.useState(new Date().getFullYear());
  const { toast } = useToast();
  const [isMounted, setIsMounted] = React.useState(false);

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user && !user.emailVerified) {
        router.push('/verify-email');
      }
      // If user is logged in and email is verified, proceed.
    }
  }, [user, authLoading, router]);

  const loadHabitsFromStorage = React.useCallback(() => {
    try {
      const storedHabits = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedHabits) {
        const parsedHabits: Habit[] = JSON.parse(storedHabits);
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
        setHabits(validatedHabits); // Order from localStorage is preserved
      }
    } catch (error) {
      console.error("Failed to load habits from local storage for heatmap:", error);
      toast({ title: "Error", description: "Could not load saved habits.", variant: "destructive" });
    }
  }, [toast]);

  React.useEffect(() => {
    if (user && user.emailVerified) { // Only load habits if user is logged in and verified
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
    }
  }, [loadHabitsFromStorage, user]);


  const handlePreviousYear = () => {
    setCurrentYear((prevYear) => prevYear - 1);
  };

  const handleNextYear = () => {
    setCurrentYear((prevYear) => prevYear + 1);
  };

  if (authLoading) {
    return <div className="flex justify-center items-center min-h-screen"><p>Loading authentication...</p></div>;
  }
  if (!user || (user && !user.emailVerified)) {
    // The useEffect hook will handle redirection.
    return <div className="flex justify-center items-center min-h-screen"><p>Access denied. Please log in and verify your email.</p></div>;
  }
  
  if (!isMounted) { // Show loading heatmap data only if authenticated, verified, and not yet mounted
    return <div className="flex justify-center items-center min-h-screen"><p>Loading heatmap data...</p></div>;
  }
  

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-3 border-b sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:relative md:z-auto">
        <div className="container mx-auto flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left px-4 md:px-8">
          <Link href="/" passHref className="self-center sm:self-auto">
            <Button variant="outline" size="icon" aria-label="Back to Home" className="sm:mr-auto">
              <Home className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-primary order-first sm:order-none sm:absolute sm:left-1/2 sm:-translate-x-1/2">Habit Heatmap</h1>
          <div className="flex items-center justify-center sm:justify-end gap-2 sm:ml-auto">
            <Button variant="outline" size="icon" onClick={handlePreviousYear} aria-label="Previous year">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-lg md:text-xl font-semibold min-w-[4rem] md:min-w-[5rem] text-center">{currentYear}</span>
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
          <div className="text-center py-16">
             <img src="https://placehold.co/150x150.png" alt="No habits illustration" data-ai-hint="calendar empty" className="mx-auto mb-6 rounded-lg w-36 h-36" />
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
