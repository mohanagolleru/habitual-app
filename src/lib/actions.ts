
"use server";

import { z } from "zod";
import type { Habit, HabitFrequency } from "./types";
import { revalidatePath } from "next/cache";
import { format, subDays, differenceInCalendarDays, parseISO } from 'date-fns';

const habitSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  description: z.string().optional(),
  frequency: z.enum(["daily", "weekly", "monthly"]),
  icon: z.string().min(1, "Icon is required."),
});

// This is a placeholder for actual database operations.
// In a real app, you'd interact with a database here.
// For now, these actions will primarily be used for validation and data transformation.

export async function createHabitAction(formData: FormData): Promise<{ habit?: Habit; errors?: z.ZodIssue[] }> {
  const validatedFields = habitSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    frequency: formData.get("frequency"),
    icon: formData.get("icon"),
  });

  if (!validatedFields.success) {
    return { errors: validatedFields.error.issues };
  }

  const newHabit: Habit = {
    id: crypto.randomUUID(),
    title: validatedFields.data.title,
    description: validatedFields.data.description,
    frequency: validatedFields.data.frequency as HabitFrequency,
    icon: validatedFields.data.icon,
    createdAt: new Date().toISOString(),
    completions: {},
    currentStreak: 0,
    longestStreak: 0,
  };

  // In a real app, save to DB here.
  // For this example, we just return the created habit.
  // The client will manage its own state.
  revalidatePath("/"); // If we were fetching data on the server, this would be useful.
  return { habit: newHabit };
}

function calculateStreakForDaily(completions: Record<string, boolean>, referenceDateStr: string): { currentStreak: number, longestStreak: number } {
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  const completionDates = Object.keys(completions)
    .filter(dateStr => completions[dateStr])
    .map(dateStr => parseISO(dateStr))
    .sort((a, b) => a.getTime() - b.getTime());

  if (completionDates.length === 0) return { currentStreak: 0, longestStreak: 0 };

  // Calculate longest streak
  for (let i = 0; i < completionDates.length; i++) {
    tempStreak++;
    if (i < completionDates.length - 1) {
      if (differenceInCalendarDays(completionDates[i+1], completionDates[i]) > 1) {
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        tempStreak = 0;
      }
    }
  }
  if (tempStreak > longestStreak) {
    longestStreak = tempStreak;
  }
  
  // Calculate current streak up to referenceDateStr
  const referenceDate = parseISO(referenceDateStr);
  let dayToCheck = new Date(referenceDate);

  if (completions[format(dayToCheck, 'yyyy-MM-dd')]) {
    currentStreak = 1;
    for (let i = 1; i < 365 * 5; i++) { 
      dayToCheck = subDays(referenceDate, i);
      const formattedDate = format(dayToCheck, 'yyyy-MM-dd');
      if (completions[formattedDate]) {
        currentStreak++;
      } else {
        break;
      }
    }
  } else {
    currentStreak = 0;
  }

  return { currentStreak, longestStreak };
}


export async function logHabitCompletionAction(
  habit: Habit,
  dateStr: string, // YYYY-MM-DD
  completed: boolean
): Promise<{ updatedHabit: Habit; errors?: string[] }> {
  const newCompletions = { ...habit.completions };
  if (completed) {
    newCompletions[dateStr] = true;
  } else {
    delete newCompletions[dateStr];
  }
  
  let streaks: { currentStreak: number, longestStreak: number };
  
  // For weekly/monthly, streak calculation is complex and often defined differently.
  // For this app, we will apply daily streak logic to all for simplicity,
  // or a user might expect streak to mean consecutive days of *doing the habit within the period*.
  // The current implementation of calculateStreakForDaily is best suited for daily habits.
  // For weekly/monthly, it would count consecutive days of logging within those less frequent habits.
  // This might not be "true" weekly/monthly streaks but is a consistent calculation.
  streaks = calculateStreakForDaily(newCompletions, dateStr);


  const updatedHabit: Habit = {
    ...habit,
    completions: newCompletions,
    currentStreak: streaks.currentStreak,
    longestStreak: Math.max(habit.longestStreak, streaks.currentStreak, streaks.longestStreak)
  };
  
  revalidatePath("/");
  return { updatedHabit };
}

export async function deleteHabitAction(habitId: string): Promise<{ success: boolean, errors?: string[] }> {
  // In a real app, delete from DB here.
  console.log("Deleting habit (server action mock):", habitId);
  revalidatePath("/");
  return { success: true };
}
