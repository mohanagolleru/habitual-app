
export type HabitFrequency = 'daily' | 'weekly' | 'monthly';

export interface Habit {
  id: string;
  title: string;
  // description?: string; // Removed
  frequency: HabitFrequency;
  icon: string; // Lucide icon name
  color: string; // Tailwind CSS background class, e.g., 'bg-blue-500'
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
