
"use client";

import type * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HabitForm, type HabitFormValues } from "./habit-form";
import type { Habit } from '@/lib/types';

interface AddHabitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: HabitFormValues, existingHabitId?: string) => Promise<void>;
  initialData?: Habit; 
  isSubmitting: boolean;
}

export function AddHabitDialog({ isOpen, onClose, onSubmit, initialData, isSubmitting }: AddHabitDialogProps) {
  
  // Key prop on HabitForm to force re-render and reset form state when initialData changes
  const formKey = React.useMemo(() => initialData?.id || 'new', [initialData]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {initialData ? "Edit Habit" : "Add New Habit"}
          </DialogTitle>
          <DialogDescription>
            {initialData ? "Update the details of your habit." : "Fill in the details below to create a new habit."}
          </DialogDescription>
        </DialogHeader>
        <HabitForm 
            key={formKey} // Ensure form re-initializes with new initialData
            onSubmit={onSubmit} 
            initialData={initialData} 
            isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
