
"use client";

import type * as React from 'react';
import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";

interface AppHeaderProps {
  onOpenAddHabitDialog: () => void;
}

export function AppHeader({ onOpenAddHabitDialog }: AppHeaderProps) {
  return (
    <header className="py-6">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-4xl font-bold text-primary">
          Habitual
        </h1>
        <Button onClick={onOpenAddHabitDialog} variant="default" size="lg">
          <PlusSquare className="mr-2 h-5 w-5" />
          Add New Habit
        </Button>
      </div>
    </header>
  );
}
