
"use client";

import * as React from "react";
import type { Habit } from "@/lib/types";
import { AppHeader } from "@/components/app-header";
import { DailySummary } from "@/components/daily-summary";
import { HabitList } from "@/components/habit-list";
import { HabitCalendar } from "@/components/habit-calendar";
import { AddHabitDialog } from "@/components/add-habit-dialog";
import type { HabitFormValues } from "@/components/habit-form";
import { createHabitAction, logHabitCompletionAction, deleteHabitAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, isToday } from 'date-fns';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";

const LOCAL_STORAGE_KEY = "habitsData_v1"; // increment version if schema changes
const DEFAULT_HABIT_COLOR = "bg-blue-500";

export default function HomePage() {
  const [habits, setHabits] = React.useState<Habit[]>([]);
  const [isAddHabitDialogOpen, setIsAddHabitDialogOpen] = React.useState(false);
  const [editingHabit, setEditingHabit] = React.useState<Habit | undefined>(undefined);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();
  const [isMounted, setIsMounted] = React.useState(false);

  const [draggingHabitId, setDraggingHabitId] = React.useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = React.useState<string | null>(null);


  React.useEffect(() => {
    setIsMounted(true);
    try {
      const storedHabits = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedHabits) {
        const parsedHabits: Habit[] = JSON.parse(storedHabits);
        // Validate and use stored order
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
      console.error("Failed to load habits from local storage:", error);
      toast({ title: "Error", description: "Could not load saved habits.", variant: "destructive" });
    }
  }, [toast]);

  React.useEffect(() => {
    if (isMounted) {
        try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(habits));
        } catch (error) {
        console.error("Failed to save habits to local storage:", error);
        }
    }
  }, [habits, isMounted]);

  const handleOpenAddHabitDialog = (habitToEdit?: Habit) => {
    setEditingHabit(habitToEdit);
    setIsAddHabitDialogOpen(true);
  };

  const handleCloseAddHabitDialog = () => {
    setEditingHabit(undefined);
    setIsAddHabitDialogOpen(false);
  };

  const handleAddOrUpdateHabit = async (values: HabitFormValues, existingHabitId?: string) => {
    setIsSubmitting(true);
    if (existingHabitId) {
      const habitToUpdate = habits.find(h => h.id === existingHabitId);
      if (!habitToUpdate) {
        toast({ title: "Error", description: "Habit not found for editing.", variant: "destructive" });
        setIsSubmitting(false);
        return;
      }
      const updatedHabitData: Habit = {
        ...habitToUpdate,
        title: values.title,
        frequency: values.frequency,
        icon: values.icon,
        color: values.color,
      };
      setHabits(prevHabits => prevHabits.map(h => h.id === existingHabitId ? updatedHabitData : h));
      toast({ title: "Success", description: "Habit updated successfully." });
    } else {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined) formData.append(key, String(value));
      });
      const result = await createHabitAction(formData);

      if (result.habit) {
        // Add new habit to the end of the list
        setHabits(prevHabits => [...prevHabits, result.habit!]);
        toast({ title: "Success", description: "New habit added!" });
      } else if (result.errors) {
        result.errors.forEach(err => {
          toast({ title: "Validation Error", description: `${err.path.join('.')}: ${err.message}`, variant: "destructive" });
        });
      }
    }
    setIsSubmitting(false);
    handleCloseAddHabitDialog();
  };

  const handleToggleHabitCompletion = async (habitId: string, dateStr: string, completed: boolean) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    setIsSubmitting(true);
    const result = await logHabitCompletionAction(habit, dateStr, completed);
    setIsSubmitting(false);

    if (result.updatedHabit) {
      setHabits(prevHabits =>
        prevHabits.map(h => (h.id === habitId ? result.updatedHabit : h))
      );
      toast({
        title: "Progress Updated",
        description: `${habit.title} marked as ${completed ? 'complete' : 'incomplete'} for ${format(parseISO(dateStr), 'MMM d')}.`
      });
    } else if (result.errors) {
       toast({ title: "Error", description: result.errors.join(', '), variant: "destructive" });
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    const habitToDelete = habits.find(h => h.id === habitId);
    if (!habitToDelete) return;

    if (!window.confirm(`Are you sure you want to delete the habit "${habitToDelete.title}"? This action cannot be undone.`)) {
        return;
    }

    const originalHabits = [...habits];
    setHabits(prevHabits => prevHabits.filter(h => h.id !== habitId));

    const result = await deleteHabitAction(habitId);
    if (result.success) {
      toast({ title: "Habit Deleted", description: `"${habitToDelete.title}" has been removed.` });
    } else {
      setHabits(originalHabits);
      toast({ title: "Error", description: result.errors?.join(', ') || "Failed to delete habit.", variant: "destructive" });
    }
  };

  const resetToToday = () => {
    setSelectedDate(new Date());
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, habitId: string) => {
    e.dataTransfer.setData('text/plain', habitId);
    setDraggingHabitId(habitId);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, targetHabitId: string) => {
    e.preventDefault();
    if (targetHabitId !== draggingHabitId) {
      setDropTargetId(targetHabitId);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); 
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    setDropTargetId(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetHabitId: string) => {
    e.preventDefault();
    const sourceHabitId = e.dataTransfer.getData('text/plain');
    
    if (!sourceHabitId || sourceHabitId === targetHabitId) {
      setDraggingHabitId(null);
      setDropTargetId(null);
      return;
    }

    setHabits(currentHabits => {
      const newHabits = [...currentHabits];
      const sourceIndex = newHabits.findIndex(h => h.id === sourceHabitId);
      let targetIndex = newHabits.findIndex(h => h.id === targetHabitId);

      if (sourceIndex === -1 || targetIndex === -1) {
        return currentHabits; 
      }
      
      const [draggedItem] = newHabits.splice(sourceIndex, 1);
      
      newHabits.splice(targetIndex, 0, draggedItem);
      
      return newHabits;
    });
    
    setDraggingHabitId(null);
    setDropTargetId(null);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setDraggingHabitId(null);
    setDropTargetId(null);
  };


  const currentDateContext = selectedDate || new Date();

  if (!isMounted) {
    return <div className="flex justify-center items-center min-h-screen" suppressHydrationWarning={true}><p>Loading habits...</p></div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader onOpenAddHabitDialog={() => handleOpenAddHabitDialog()} />

      <main className="flex-grow container mx-auto px-4 py-4 space-y-4">
        <AddHabitDialog
          isOpen={isAddHabitDialogOpen}
          onClose={handleCloseAddHabitDialog}
          onSubmit={handleAddOrUpdateHabit}
          initialData={editingHabit}
          isSubmitting={isSubmitting}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-1 space-y-6">
            <DailySummary habits={habits} currentDate={currentDateContext} />
            <HabitCalendar habits={habits} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
             {selectedDate && !isToday(selectedDate) && (
                <Button onClick={resetToToday} variant="outline" className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" /> Back to Today
                </Button>
             )}
          </div>

          <div className="md:col-span-2">
            {habits.length > 0 ? (
              <HabitList
                habits={habits}
                onToggleCompletion={handleToggleHabitCompletion}
                onDeleteHabit={handleDeleteHabit}
                onEditHabit={handleOpenAddHabitDialog}
                currentDate={currentDateContext}
                draggingHabitId={draggingHabitId}
                dropTargetId={dropTargetId}
                onDragStart={handleDragStart}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
              />
            ) : (
              <Card className="shadow-xl text-center py-12 bg-card">
                <div className="flex flex-col items-center">
                  <img src="https://placehold.co/150x150.png" alt="Empty state illustration" data-ai-hint="journal empty" className="mb-6 rounded-lg" />
                  <h2 className="text-2xl font-semibold text-primary mb-4">Welcome to Habitual!</h2>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    It looks like you don't have any habits yet.
                    <br />
                    Click the "Add New Habit" button to get started on your journey.
                  </p>
                  <Button onClick={() => handleOpenAddHabitDialog()} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    Add Your First Habit
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>

      <footer className="py-3 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Habitual. Keep building those habits!</p>
      </footer>
    </div>
  );
}
