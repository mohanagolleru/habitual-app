
export type HabitFrequency = 'daily' | 'weekly' | 'monthly';

export interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: HabitFrequency;
  icon: string; // Lucide icon name
  createdAt: string; // ISO date string
  completions: Record<string, boolean>; // Key: 'YYYY-MM-DD', Value: true if completed
  currentStreak: number;
  longestStreak: number;
}

export interface HabitCompletionLog {
  date: string; // 'YYYY-MM-DD'
  habitId: string;
  completed: boolean;
}
